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

        routes: [],

        locations: null,

        store:null
                      
    },

    initialize: function(){
        this.callParent();
        console.log("inside initialize");

        this.setLocationOfTheUser();

        //var store = Ext.create('EasyTreatyApp.store.Location');
        //this.setStore(store);
        //var pyrmont = new google.maps.LatLng(15.949228, 77.507717);
        ////var pyrmont = this.getUserLocation();
        //store.on({
        //    locationadded: this.onLocationAddition,
        //    storecleared:this.onStoreClear,
        //    scope: this
        //});
        //store.populate(pyrmont, 'hospital', 5000000, this);


    },
    onStoreClear: function(){
        this.clearLocationMarkers();
        this.clearRoutes();
    },

    onLocationAddition: function () {
        console.log("oh yeah location added!!!! ");

        var me = this;
        var record = this.getStore().last();
        me.addLocationMarker(record.getData(), 'redmarker.png');
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
        var me = this;
        var marker = new google.maps.Marker({
            map: me.getMap(),
            animation: null,
            position: location.geometry.location,
            icon: 'resources/icons/' + markerIcon
        });

        var address = location.formatted_address;
        var name = location.name;
        var phoneNumber = location.international_phone_number;
        if (address == null) {
            address = "";
        }
        var idString = location.id;
        var tpl = name+'</br>'+address+'</br><button class="direction" id=' + idString + '>Get Directions</button><button class="more-details" id=' + idString + '>More Details</button>';
        console.log("inside add location marker");
        console.log(address);
        if (location.phoneNumber != null) {
            tpl = tpl + '</br><button class="call" type="button"><a href="tel:' + location.phoneNumber + '">Call</a></button>' + location.phoneNumber;
        } 

        google.maps.event.addListener(marker, 'click', function (pos) {
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent('<div class="info-window">' + tpl + '</div>')
            infowindow.open(me.getMap(), marker);
        });
        this.getLocationMarkers().push(marker);
    },


    clearLocationMarkers: function () {
        var me = this;
        Ext.Array.forEach(me.getLocationMarkers(), function (marker) {
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

                    var currentLat = geo.getLatitude();
                    var currentLng = geo.getLongitude();
                    var location = new google.maps.LatLng(currentLat, currentLng);

                    me.setUserLocation(location);
                    me.setBaseLocation(location);

                    var marker = new google.maps.Marker({
                        map: me.getMap(),
                        animation: null,
                        position: location,
                        icon: 'resources/icons/bluemarker.png'
                    });

                    me.setMapOptions({
                        center: location,
                        zoom: 2
                    });
                    me.setUserLocationMarker(marker);
                    me.setBaseLocationMarker(marker);

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
    },

    /**
     * Sets the click listner 
     * @method
     * @private
     */
        addClickListnerOnMap: function () {

            var marker;
            var me = this;
            var map = this.getMap();

            var listener = google.maps.event.addListener(map, 'click', function (event) {

                var baseMarker = me.getBaseLocationMarker();
                console.log("tapped");

                baseMarker.setMap(null);

                var marker = new google.maps.Marker({
                    map: me.getMap(),
                    animation: null,
                    position: event.latLng,
                    icon: 'resources/icons/flag.png'
                });
                me.setBaseLocationMarker(marker);

            });

            this.setClickListener(listener);

        }
    
})