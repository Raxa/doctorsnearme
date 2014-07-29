/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.view.LocationMap", {
    extend: 'Ext.Map',
    xtype: 'locationmap',
    config: {
        layout: 'fit',
        
        /**
         * cfg {LatLng} the location of the user
         */
        userLocation: null,

        /**
         * cfg {Marker} marker of current location of the user 
         */
        userLocationMarker:null,

        /**
         * cfg {LatLng} the location relative to which search happens
         */
        baseLocation: null,

        /**
         * cfg {Marker} marker of the location relative to which search happens 
         */
        baseLocationMarker: null,

        /**
         * cfg [Marker] markers of the location relative to which search happens 
         */
        locationMarkers: [],

        /**
         * cfg [Marker] markers of direction service 
         */
        directionMarkers: [],

        /**
         * cfg [google.maps.DirectionsRenderer] routes of direction service 
         */
        routes: [],

        /**
         * cfg {Store} locations store.  
         */
        store: null,

        /**
         * cfg {Ext.util.Geolocation}   
         */
        geo: null,

        /**
         * cfg {Boolean} To keep track of the initial userlocation setting
         */
        initialUserLocationSetting: true
                      
    },

    /**
     * Initialize
     * @method
    */
    initialize: function(){
        this.callParent();

        //bubble these events to MapView
        this.enableBubble(['getdirections', 'moredetails', 'togglefavorite','basechanged','like']);

        //set location of the user and also this keeps track of base changes
        this.setLocationOfTheUser();

        var me = this;

        //handler for direction buttons on infowindows
        this.addListener({
            element: 'element',
            delegate: 'button.direction',
            tap: function (event, node, options, eOpts) {
                console.log("get directions");
                me.fireEvent('getdirections', me, node.id);
            }
        });

        //handler for more details icons on infowindows
        this.addListener({
            element: 'element',
            //delegate: 'button.more-details',
            delegate: 'img.more-details',
            tap: function (event, node, options, eOpts) {
                me.fireEvent('moredetails', node.id);
            }
        });

        //handler for like buttons on infowindows
        this.addListener({
            element: 'element',
            delegate: 'button.like-img',
            tap: function (event, node, options, eOpts) {

                var button = Ext.get(node.id);

                if (button.hasCls('like')) {
                    me.fireEvent('like', true, node.id.slice(0, -5),button);
                }
                else {
                    me.fireEvent('like', false, node.id.slice(0, -5),button);
                }                               
            }
        });
        

    },

    /**
    * Clear all markers and routes when store is cleared
    * @method
    * @public
    */
    onStoreClear: function(){
        this.clearMarkers(this.getLocationMarkers());
        this.clearMarkers(this.getDirectionMarkers());
        this.clearRoutes();
    },

    /**
    * Called when a location is added to the store
    * @method
    * @public
    * @param {String} type
    */
    onLocationAddition: function (type) {
        var markerImg = 'Medical centers_small.png';
        switch (type) {
            case 1: markerImg = 'Doctors_small.png'
                break;
            case 2: markerImg = 'Pharmacies_small.png'
                break;
        }

        var me = this;
        var record = this.getStore().last();

        // me.addLocationMarker(record.getData(), markerImg);
        //COMMENTED ABOVE LINE AND ADDDED THIS TO TEST FOR SENDING SEPARATE REQUESTS
        me.addLocationMarker(record, markerImg);

    },


    /**
    * Add a Marker
    * @method
    * @private
    * @param {Object} record
    * @param {String} makerIcon
    */
    addLocationMarker: function (record, markerIcon) {
        var me = this;

        //get the location
        var latlng = record.get('geometry').location;       

        //create a marker there
        var marker = new google.maps.Marker({
            map: me.getMap(),
            animation: null,
            position: latlng,
            icon: 'resources/icons/' + markerIcon
        });

        //add a listener to the marker to open infowindow
        google.maps.event.addListener(marker, 'click', function (pos) {
            var infowindow = new google.maps.InfoWindow();

            lang = EasyTreatyApp.config.getLanguage();

            var name = record.get('name');

            //if name is not null that means this record has been filled with 
            //all the data            
            if(name !=null)
            {
                //then just set the infowindow content with record's data
                me.setInfowindowContent(record, marker);
                
            }
           //if name is null that means due to OVER_QUERY_LIMIT this record hasn't been filled with 
           //all the data
            else
            {
                //send a separate request to get details of the record
                me.getStore().setDetailsForTheRecord(record,marker);
            }

            me.setMapOptions({
                center: marker.position,
                zoom: 20
            });
           
        });

        //push this marker to the array of location markers
        this.getLocationMarkers().push(marker);
    },


    /**
    * Set the contents of the infowindow
    * @method
    * @private
    * @param {Object} record
    * @param {Marker} marker
    */
    setInfowindowContent: function (record,marker) {
        var phoneNumber = record.get('international_phone_number');
        var idString = record.get('id');

        var name = record.get('name');
        var userimg = '<img class="user-img" src="resources/icons/empty.png">';

        var moredetails = '<img class="more-details" id =' + idString + ' src = "resources/icons/i_30_30.png">';

        var like = "";

        if (EasyTreatyApp.config.getLoggedIn()) {

            if (!record.get('isLiked')) {
                console.log("not like");
                like = '<button class="like-img like" id=' + idString + '-like>';
            } else {
                console.log("like");
                like = '<button class="like-img dislike" id=' + idString + '-like>';
            }
        }

        var call = "";
        if (phoneNumber != null) {
            call = '<img class="call-img" src = "resources/icons/Phone_40_40.png"><button class="call"><a href="tel:' + phoneNumber + '">Call</a></button>';
        }
        var directions = '<button class="direction" id=' + idString + '><img class="direction-img" src = "resources/icons/Arrow_40_40.png">' + lang.GET_DIRECTIONS + '</button>';

        var infowindow = new google.maps.InfoWindow();

        var firstRow = '<div  class="inlineblock">' + userimg + '</div>' +
                 '<div class="inlineblock">' +
                       '<div class="inlineblock"><p class="wordstyle">&nbsp;&nbsp;' + name + '</p></div>' +
                       '<div class="inlineblock">' + moredetails + '</div>' +
                       '<div>' + like + '</div>' +
                 '</div>';

        var secondRow = '<div class="inlineblock">' + call + '</div>' +
                       '<div class="inlineblock">' + directions + '</div>';
        var tpl = '<div display="table-column-group">' + firstRow + '</div>' + '<div display="table-column-group">' + secondRow + '</div>';

        infowindow.setContent(tpl);
        infowindow.open(this.getMap(), marker);

        //////////////
     /*   var me = this;
        var infoBubble2 = new InfoBubble({
            map: me.getMap(),
            content: tpl,
            position: marker.position,
            shadowStyle: 1,
            padding: 0,
            backgroundColor: 'white',
            borderRadius: 0,
            arrowSize: 0,
            borderWidth: 1,
            borderColor: 'white',
            disableAutoPan: false,
            hideCloseButton: false,
            arrowPosition: 50,
            //backgroundClassName: 'phoney',
            arrowStyle: 2,
            maxWidth: 800
        });
        infoBubble2.open();*/


      /* var infobox = new InfoBox({
            content: tpl,
            disableAutoPan: false,
            maxWidth: 150,
            pixelOffset: new google.maps.Size(-140, 0),
            zIndex: null,
            boxStyle: {
               // background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                background:'white',
                opacity: 1,
                width: "280px"
            },
            closeBoxMargin: "12px 4px 2px 2px",
            closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            infoBoxClearance: new google.maps.Size(1, 1)
       });*/

    },

    /**
    * Clear the Markers
    * @method
    * @private
    * @param [Marker} markers
    */
    clearMarkers: function (markers) {
        Ext.Array.forEach(markers, function (marker) {
            marker.setMap(null);
        });
    },

    /**
    * Clear the routes
    * @method
    * @private
    */
    clearRoutes: function () {
        var me = this;
        Ext.Array.forEach(me.getRoutes(), function (route) {
            route.setMap(null);
        });
    },

    /**
     * Set the listener for the location of the user
     * @method
     * @private
    */
    setLocationOfTheUser: function () {
        var me = this;
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function (geo) {
                    console.log("location update");

                    var user = me.getUserLocationMarker();
                    var base = me.getBaseLocationMarker();

                    //now this is a location update and auto update is set to false. 
                    //Therefore location update only happens if user clicks on the locator.
                    //In that case both user location and base location need to be updated.
                    //Therefore existing ones are removed
                    if (user != null) {
                        user.setMap(null);
                    }
                    if (base != null) {
                        base.setMap(null);
                    }

                    var currentLat = geo.getLatitude();
                    var currentLng = geo.getLongitude();

                    //get new location
                    var location = new google.maps.LatLng(currentLat, currentLng);

                    //set new location
                    me.setUserLocation(location);
                    me.setBaseLocation(location);

                    var marker = new google.maps.Marker({
                        map: me.getMap(),
                        animation: null,
                        position: location,
                        draggable: true,
                        icon: 'resources/icons/bluedot.png'
                    });

                    //this event listener is for when user drags his marker to change the base location
                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        me.setBaseLocation(me.getBaseLocationMarker().position);
                        //need to fire basechanged event
                        me.fireEvent('basechanged');
                    });

                    me.setMapOptions({
                        center: location,
                        zoom: 15
                    });

                    //set markers at new locations
                    me.setUserLocationMarker(marker);
                    me.setBaseLocationMarker(marker);

                    //fire basechanged event. If this is the initial location setting currentsearch config 
                    //of mapview is null. Therefore in mapview controller this is checked and set the choice 
                    //to 0
                    me.fireEvent('basechanged', me.getInitialUserLocationSetting());

                    //after initial one this config is set to false
                    if (me.getInitialUserLocationSetting()) {
                        me.setInitialUserLocationSetting(false);
                    }

                },
                locationerror: function (geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout)
                        Ext.Msg.alert('Timeout occurred', "Could not get current position");
                    else
                        alert('Error occurred.');
                }
            }
        });

        this.setGeo(geo);
    },

    /**
    * Calculates the route from start to end
    * @method
    * @public
    * @param {Latlng} start
    * @param {latlng} end
    * @param {Map} map
    */
    calcRoute:function (start,end,map) {
        var directionsService = new google.maps.DirectionsService();

        console.log(directionsService);
        console.log(start);
        console.log(end);

        var rendererOptions = {
            map: map
        };
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        this.getRoutes().push(directionsDisplay);

        var stepDisplay = new google.maps.InfoWindow();

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        var me = this;

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log("OK");
                directionsDisplay.setDirections(response);
                me.showSteps(response, stepDisplay, map);
            } else {
                Ext.Msg.setMinWidth('50%');
                Ext.Msg.alert("Sorry","Unable to give directions from your location");
            }
        });
    },
    
    /**
     * Show steps in a given route
     * @method
     * @private
     * @param {Object} directionResult
     * @param {InfoWindow} stepDisplay
     * @param {Map} map
     */
    showSteps: function (directionResult, stepDisplay,map) {

        var myRoute = directionResult.routes[0].legs[0];
        console.log("my route");
        console.log(myRoute);
        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = new google.maps.Marker({
                position: myRoute.steps[i].start_location,
                map: map
            });
            this.attachInstructionText(marker, myRoute.steps[i].instructions, stepDisplay, map);
            this.getDirectionMarkers().push(marker);
        }
    },

    /**
     * Attaches instruction text
     * @method
     * @private
     * @param {Marker} marker
     * @param {String} text
     * @param {InfoWindow} stepDisplay
     * @param {Map} map
     */
    attachInstructionText: function (marker, text, stepDisplay,map) {
        google.maps.event.addListener(marker, 'click', function() {

            stepDisplay.setContent('<div>' + text + '</div>');
            stepDisplay.open(map, marker);
        });
    }
    
})