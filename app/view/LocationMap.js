/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.view.LocationMap", {
    extend: 'Ext.Map',
    xtype: 'locationmap',
    config: {
        layout: 'fit',
        
        userLocation: null,

        userLocationMarker:null,

        baseLocation: null,

        baseLocationMarker: null,

        locationMarkers: [],

        directionMarkers: [],

        routes: [],

        locations: null,

        store: null,

        geo: null,

        initialUserLocationSetting: true
                      
    },

    initialize: function(){
        this.callParent();
        console.log("inside initialize");

        this.enableBubble(['getdirections', 'moredetails', 'togglefavorite','basechanged']);

        this.setLocationOfTheUser();
        var me = this;
        this.addListener({
            element: 'element',
            delegate: 'button.direction',
            tap: function (event, node, options, eOpts) {
                console.log("get directions");
                me.fireEvent('getdirections', me, node.id);
            }
        });

        this.addListener({
            element: 'element',
            //delegate: 'button.more-details',
            delegate: 'img.more-details',
            tap: function (event, node, options, eOpts) {
                //me.fireEvent('moredetails', me, node.id);
                me.fireEvent('moredetails', node.id);
            }
        });

        this.addListener({
            element: 'element',
            delegate: 'button.like-img',
            //delegate: 'div.star',
            tap: function (event, node, options, eOpts) {
                var button = Ext.get(node.id);

                if (button.hasCls('like')) {
                    button.removeCls("like");
                    button.addCls("dislike");
                   // me.fireEvent('togglefavorite', node.id.slice(0,-4),false);
                }
                else {
                    button.removeCls("dislike");
                    button.addCls("like");
                  //  me.fireEvent('togglefavorite',node.id.slice(0,-4), true);
                }                               
            }
        });
        

    },
    onStoreClear: function(){
        this.clearMarkers(this.getLocationMarkers());
        this.clearMarkers(this.getDirectionMarkers());
        this.clearRoutes();
    },

    onLocationAddition: function (type) {
        // var markerImg = 'redmarker.png';
        var markerImg = 'Medical centers.png';
        switch (type) {
            case 1: markerImg = 'Doctors.png'
                break;
            case 2: markerImg = 'Pharmacies.png'
                break;
        }
        console.log("oh yeah location added!!!! ");

        var me = this;
        var record = this.getStore().last();
        me.addLocationMarker(record.getData(), markerImg);

        //this.getStore().getRange().forEach(function (record) {
        //    me.addLocationMarker(record.getData(), 'redmarker.png');
        //    //me.addLocationMarker(record, 'redmarker.png');
        //});
    },
    /**
    * Add a Marker
    * @method
    * @private
    * @param {Object} location
    * @param {String} makerIcon
    * @return {Marker} marker
    */
    addLocationMarker: function (location, markerIcon) {
        console.log("inside addlocation marker");
        console.log(location)
        
        var latlng = location.geometry.location;
        if (location.isFavorite) {
            var loc = location.geometry.location;
            var lat = parseFloat(loc.k);
            var lng = parseFloat(loc.A);
            console.log("lat: " + lat);
            console.log("lng: " + lng);
             latlng= new google.maps.LatLng(lat, lng);
        }

        var me = this;
        var marker = new google.maps.Marker({
            map: me.getMap(),
            animation: null,
            //position: location.geometry.location,
            position: latlng,
            icon: 'resources/icons/' + markerIcon
        });

        var address = location.formatted_address;
        var name = location.name;
        var phoneNumber = location.international_phone_number;

        if (address == null) {
            address = "";
        }

        //var lang = EasyTreatyApp.config.getLanguage();
        var lang;
        var idString = location.id;
        var tpl1 = "";
        //var tpl1 = name + '</br>' + address + '</br><button class="direction" id=' + idString + '>'+lang.GET_DIRECTIONS+'</button><button class="more-details" id=' + idString + '>'+lang.MORE_DETAILS+'</button>';
  
        var tpl2 = "";
        //if (phoneNumber != null) {
        //    tpl2 = '</br><button class="call" type="button"><a href="tel:' + phoneNumber + '">Call</a></button>' + phoneNumber;
        //}
        var tpl0 = "";
        var tpl3 = "";

        google.maps.event.addListener(marker, 'click', function (pos) {
            lang = EasyTreatyApp.config.getLanguage();


            var userimg = '<img class="user-img" src="test.png">';
            
            var moredetails = '<img class="more-details" id =' + idString + ' src = "resources/icons/i_30_30.png">';
            // var like = '<img class="like-img like-in-map" id=like-'+idString+' src = "resources/icons/Tellafriend.png">';
            var like = '<button class="like-img like" id=like-' + idString + '>';
            var doctorname = '<div>' + '<p style="padding:2px;word-wrap:break-word;">' + name + '</p>' + moredetails + like + '</div>';
            var call ="";
            if (phoneNumber != null) {
                call = '<img class="call-img" src = "resources/icons/Phone_40_40.png"><button class="call"><a href="tel:' + phoneNumber + '">Call</a></button>';
            }
            var directions = '<button class="direction" id=' + idString + '><img class="direction-img" src = "resources/icons/Arrow_40_40.png">' + lang.GET_DIRECTIONS + '</button>';

            var infowindow = new google.maps.InfoWindow();

            var tpl = '<table><tr><td>' + userimg +'</td><td>'+ doctorname + '</td></tr></table>'+'<table><tr><td>'+call+'</td>'+'<td>'+directions+'</td>'+'</tr>'+'</table>';
           
            infowindow.setContent(tpl);
             infowindow.open(me.getMap(), marker);
        });
        
        
        this.getLocationMarkers().push(marker);
    },

    /// An alternative. What this does is sending a request only when the user clicks on a marker. But when viewing on
    /// the list this is not possible because all the details 

    //addLocationMarker: function (record, markerIcon) {
    //    var me = this;
    //    var marker = new google.maps.Marker({
    //        map: me.getMap(),
    //        animation: null,
    //        position: record.getData().geometry.location,
    //        icon: 'resources/icons/' + markerIcon
    //    });

      
    //    console.log("inside add location marker");

    //    google.maps.event.addListener(marker, 'click', function (pos) {
    //        var infowindow = new google.maps.InfoWindow();

    //        me.getStore().setDetailsForTheRecord(me, record,infowindow,marker);
           
    //    });
    //    this.getLocationMarkers().push(marker);
    //},


    clearMarkers: function (markers) {
        Ext.Array.forEach(markers, function (marker) {
            marker.setMap(null);
        });
    },

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

                    if (user != null) {
                        user.setMap(null);
                    }
                    if (base != null) {
                        base.setMap(null);
                    }

                    var currentLat = geo.getLatitude();
                    var currentLng = geo.getLongitude();
                    var location = new google.maps.LatLng(currentLat, currentLng);

                    me.setUserLocation(location);
                    me.setBaseLocation(location);

                    var marker = new google.maps.Marker({
                        map: me.getMap(),
                        animation: null,
                        position: location,
                        draggable: true,
                        //icon: 'resources/icons/bluemarker.png'
                        icon: 'resources/icons/bluedot.png'
                    });
                    /////////////////
                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        console.log("dragend");
                        console.log(event);
                        me.setBaseLocation(me.getBaseLocationMarker().position);
                        me.fireEvent('basechanged');
                    });
                    /////////////////

                    me.setMapOptions({
                        center: location,
                        zoom: 7
                    });
                    me.setUserLocationMarker(marker);
                    me.setBaseLocationMarker(marker);

                    me.fireEvent('basechanged', me.getInitialUserLocationSetting());
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

        geo.updateLocation();
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