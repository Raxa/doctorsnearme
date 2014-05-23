/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.view.MapPanel", {
    extend: 'Ext.Container',
    xtype: 'mappanel',
    requires: ['Ext.Map'],
    config: {
        layout: 'fit',
        
        /**
         * @cfg {Marker} Marker for the location of the user
         */
        myLocationMarker: null,
        
        /**
         * @cfg [{Marker}] Array of all Markers
         */
        markers: [],
        
        /**
         * @cfg [{DirectionsRenderer}] Array of all DirectionsRenderers
         */
        routes: [],
        
        /**
         * @cfg {Marker} Marker for the location of the user's choice
         */
        searchChoiceMarker: null,
        
        /**
         * @cfg {Latlng} Relative location for search
         */
        relativeLocation: null,
        
        /**
         * @cfg {Geolocation} To track the current location
         */
        geo: null,
        
        /**
         * @cfg [{Object}] Set of locations for the current search
         */
        locations: null,
        
        /**
         * @cfg {Object} Listener for clicks when changing the location
         */
        clickListener: null,
        
        /**
         * @cfg Boolean Set to false after setting the searchChoiceMarker for the first time
         */
        firstTime: true,
        
        items: [
            {
                xtype: 'map',
            }            
        ]                
    },
    
    /**
     * Initialize
     * @method
    */
    initialize: function() {

        this.callParent(arguments);
        // wait 100 ms
        Ext.Function.defer(this.initMap, 100, this);

        this.setCurrentLocationListener();


        this.addListener({
                element: 'element',
                delegate: 'button.direction',
                tap: function(event, node, options, eOpts) {
                    this.parent.fireEvent('getdirections',this.getParent(), this,node.id);
                }
            }
        );

        this.addListener({
                element: 'element',
                delegate: 'button.more-details',
                tap: function(event, node, options, eOpts) {
                    this.parent.fireEvent('moredetails', this.getParent(), node.id);
                }
            }
        );


    },

    /**
     * Set the listener for the location of the user
     * @method
     * @private
    */
    setCurrentLocationListener: function() {
        var me = this;
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo) {
                    var currentLat = geo.getLatitude();
                    var currentLng = geo.getLongitude();

                    var loc = { latlng: new google.maps.LatLng(currentLat, currentLng) };

                    var firstTime = me.getFirstTime();
                    me.setMyLocation(loc, firstTime);
                    console.log("after set my location");
                    console.log(me.getSearchChoiceMarker());

                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout)
                        Ext.Msg.alert('Timeout occurred', "Could not get current position");
                    else
                        alert('Error occurred.');
                }
            }
        });
        this.setGeo(geo);

        geo.updateLocation();
    },
    
    /**
     * Initialize the map
     * @method
     * @private
    */
    initMap: function() {
        //var mapPanel = this.getComponent(0);
        var mapPanel = this.getMapComponent();
        var gMap = mapPanel.getMap();

        if (gMap == null) {
            Ext.Function.defer(this.initMap, 250, this);
        } else {
            // ready to start calling google map methods
            //this.geoCode();
            //this.getCurrentLocation();
        }


    },

    /**
     * Set the location of the user
     * @method
     * @private
    */
    setMyLocation: function(loc, firstTime) {

        //this.getComponent(0).setMapOptions({
        this.getMapComponent().setMapOptions({
            center: loc.latlng,
            zoom: 2
        });
        var marker = this.addMarker(loc, 'bluemarker.png');
        this.setMyLocationMarker(marker);

        if (firstTime) {
            this.fireEvent('initialsearchchoicemarkerset', this, loc);
            this.setFirstTime(false);

            this.setSearchChoiceMarker(marker);
            this.setRelativeLocation(marker.position);

        }
    },    
    
    /**
     * Returns the Map
     * @method
     * @return {Map}
    */
    getMapComponent: function() {
        return this.getComponent(0);
    },
    

    /**
     * Toggle traffic layer
     * @method
     * @public
     * @param Boolean set
    */
    setTrafficLayer: function(set) {
        console.log("traffic layer");
        var trafficLayer = new google.maps.TrafficLayer();
        console.log(trafficLayer);

        if (set) {
            //var gMap = this.getComponent(0).getMap();
            var gMap = this.getMapComponent().getMap();
            trafficLayer.setMap(gMap);
        } else {
            trafficLayer.setMap(null);
        }
    },
    

    /**
     * Set an InfoWindow for the marker
     * @method
     * @private
     * @param {Map} map
     * @param {Marker} marker
     * @param {Object} location
     */
    codeLatLng: function(map, marker, location) {
        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow();

        var idString = location.id;
        var callLink = '</br><button class="direction" id=' + idString + '>Get Directions</button><button class="more-details" id=' + idString + '>More Details</button>';
        var theName = '';
        if (location.phoneNumber != null) {
            callLink = callLink + '</br><button class="call" type="button"><a href="tel:' + location.phoneNumber + '">Call</a></button>' + location.phoneNumber;
        }
        if (location.name != null) {
            theName = location.name + '</br>';
        }
        geocoder.geocode({ 'latLng': location.latlng }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    infowindow.setContent('<div class="info-window">'+theName + results[1].formatted_address + callLink+'</div>');
                }
            } else {
                infowindow.setContent('<div class="info-window">' + theName + location.address + callLink + '</div>');
            }
            infowindow.open(map, marker);
        });

    },

    /**
     * Updates current location
     * @method
     * @private
    */
    getCurrentLocation: function() {
        this.getGeo().updateLocation();
    },

    /**
     * Add a Marker
     * @method
     * @private
     * @param {Object} location
     * @param {String} makerIcon
     * @return {Marker} marker
     */
    addMarker: function(location, markerIcon) {

        var me = this;
        //var gMap = this.getComponent(0).getMap();
        var gMap = this.getMapComponent().getMap();
        var marker = new google.maps.Marker({
            map: gMap,
            animation: null,
            position: location.latlng,
            icon: 'resources/icons/' + markerIcon
        });

            google.maps.event.addListener(marker, 'click', function(pos) {
                me.codeLatLng(gMap, marker, location);
            });
        this.getMarkers().push(marker);
        return marker;
    },
    
    /**
     * Clear the passed Marker
     * @method
     * @private
     * @param {Marker} marker
     */
    clearMarker: function(marker) {
        marker.setMap(null);
    },

    /**
     * Gets Executed when locations config is updated
     * @method
     */
    updateLocations: function (newValue, oldValue) {
        var me = this;
       // var locations = this.getLocations();
        var locations = newValue;
        var markers = this.getMarkers();

        var routes = this.getRoutes();
        Ext.Array.forEach(routes, function (route) {
            route.setMap(null);
        });

        Ext.Array.forEach(markers, function(marker) {
            me.clearMarker(marker);
        });
        Ext.Array.forEach(locations, function(location) {
            var loc = {
                name: location.name,
                phoneNumber: location.phoneNumber,
                latlng: new google.maps.LatLng(location.latitude, location.longitude),
                address: location.address1,
                id: location.id
            };
            me.addMarker(loc, 'redmarker.png');
        });

        this.getCurrentLocation();

        var relativeLocation = this.getRelativeLocation();

        this.addMarker({ latlng: relativeLocation }, 'flag.png');
    },

    /**
     * Sets the click listner 
     * @method
     * @private
     */
    addClickListnerOnMap: function() {

        var marker;
        var me = this;
        //var map = this.getComponent(0).getMap();
        var map = this.getMapComponent().getMap();
        
        var location;
        var listener = google.maps.event.addListener(map, 'click', function(event) {

            var searchMarker = me.getSearchChoiceMarker();
            console.log("tapped");

            me.clearMarker(searchMarker);

            location = { latlng: event.latLng };
            //me.setSearchChoiceMarker(marker);
            marker = me.addMarker(location, 'flag.png');
            me.setSearchChoiceMarker(marker);

        });

        this.setClickListener(listener);

    },

    /**
     * Removes the passed listener
     * @method
     * @private
     */
    removeClickListnerOnMap: function(listener) {
        google.maps.event.removeListener(listener);
    },


    changeTheRelativeLocationForSearch: function () {
        this.addClickListnerOnMap();
    },

    /**
     * gets Called when the user has changed the relative location
     * @method
     * @public
     */
    selectionDone: function() {
        this.removeClickListnerOnMap(this.getClickListener());

        var searchChoiceMarker = this.getSearchChoiceMarker();

        var position = searchChoiceMarker.position;


        this.setRelativeLocation(position);

        console.log("relative location setting");
        console.log(position);

    },

    createOrClearMap: function(locations) {
        this.setLocations(locations);
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
            this.getMarkers().push(marker);
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

            stepDisplay.setContent('<div class="info-window">' + text + '</div>');
            stepDisplay.open(map, marker);
        });
    }
    
})