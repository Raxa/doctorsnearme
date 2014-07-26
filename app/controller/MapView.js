/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.MapView', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.device.Contacts'],
    config: {
        refs: {
            mapView: 'mapview',
            menu: 'mainmenu',
            detailsView: 'detailsview',
            listView: 'listview'
        },
        control: {
            mapView: {
                showmenu: "showMenu",
                choicedone: "onChoice",
                itemselected: "onLocationSelect",
                moredetails: "onMoreDetails",
                getdirections: "onGetDirections",
                basechanged: "onBaseChange",
                backtomap: "onBackToMap",
                textsearch: "onTextSearch",
                like: "onLike",
                cityreceived: "onCityReceived"
            },
            detailsView: {
                //after new design
                getdirections: "directToMapView",
                forward: "forwardToNextLocation",
                //like: "onLike"
            },
            listView: {
                moredetails: "onMoreDetails",
                getdirections: "directToMapView"
            }
        }
        
    },

    /**
      * Called when response from openMRS API is received - in search accoring to city 
      * @method
      * @private
      */
    onCityReceived: function(requestSuccessful,city){
        if (requestSuccessful) {
            console.log("inside city received:" + city);
            var raxaDoctorStore = Ext.data.StoreManager.lookup('raxadoctor-store');

            //set the proxy according to the city
            raxaDoctorStore.setProxyToTheStore(city);

            //load the store
            raxaDoctorStore.load();
        }
    },

    /**
     * Called when user clicks on forward icon in details view 
     * @method
     * @private
     */
    forwardToNextLocation: function(currentId){
        var store = this.getMapView().getStore();
        var index = store.findExact('id', currentId);

        //incase this is from favoritestore
        if (index == -1) {
            store = this.getListView().getItemList().getStore();
            index = store.findExact('id', currentId);
        }

        console.log("index:"+index);
        var nextRecord = store.getAt(index + 1);
        console.log(nextRecord);
        if (nextRecord == null) {
            nextRecord = store.getAt(0);
        }


        this.onLocationSelect(nextRecord);
    },

    /**
     * Called when usr clicks on like button in an infowindow 
     * @method
     * @private
     */
    onLike: function (like, id, button) {
        console.log(id);
        var store = this.getMapView().getStore();

        var placeId = store.getById(id).get('place_id');

        store.like(like, placeId, button, null);

    },

    /**
     * Called when a user clicks on search icon in mapview 
     * @method
     * @private
     */
    onTextSearch: function (searchField) {
        console.log("inside on text search");

        var searchString = searchField.getValue();

        if (searchString.replace(/\s/g, '').length) {
            var mapview = this.getMapView();
            var locationmap = mapview.getLocationMap();
            var base = locationmap.getBaseLocation();
            var types = ['doctor', 'hospital', 'pharmacy'];

            var radius1 = mapview.getSearchRadius();
            var radius2 = radius1 == null ? 2000 : radius1;

            mapview.getStore().textSearch(base, types, radius2, locationmap, searchField.getValue());

            this.getMapView().zoomMap(parseInt(radius2));
        }
    },

    /**
     * Called when user clicks on get directions button in either detailsview or listview 
     * @method
     * @private
     */
    directToMapView: function(id){
       
        var mapview = this.getMapView();
        this.onGetDirections(mapview.getLocationMap(), id);
        Ext.Viewport.setActiveItem(mapview);
        this.onBackToMap();
    },

    /**
     * Make dearch, specialty, loactor visible and make location map active item 
     * @method
     * @private
     */
    onBackToMap: function () {
        var mapview = this.getMapView();

        mapview.getSearchField().setHidden(false);
        mapview.getSpecialtySelectField().setHidden(false);
        mapview.getLocator().setHidden(false);

        mapview.setActiveItem(0);
    },

    /**
     * Called on change of baselocation
     * @method
     * @private
     */
    onBaseChange: function (initialUserLocationSetting) {
        var currentSearch = this.getMapView().getCurrentSearch();

        if (currentSearch != null) {
            this.onChoice(currentSearch);
        } else if (initialUserLocationSetting) {
            this.onChoice(0);
        }

        ////for get raxa doctors according to user location
        var mapview = this.getMapView();
        
        //this will send request to get the city of the base location
        //after city arrives the event cityreceived will be fired and
        // that city will be used to set the proxy and raxa doctor store 
        //will be loaded
        mapview.getLocationMap().getCity();

        
         
    },  

    /**
     * Called when user click on info icon on an infowindow
     * @method
     * @private
     */
    onMoreDetails: function (recordId) {
        var record = this.getMapView().getStore().getById(recordId);

        //that is incase this moredetails call is from listview
        if (record == null) {
            record = this.getListView().getItemList().getStore().getById(recordId);
        }

        this.onLocationSelect(record);
    },

    /**
     * Call the calcRoute() of MapPanel
     * @method
     * @private
     */
    onGetDirections: function (map, recordId) {
        console.log(" onGetDirectionsButtonTap");
        var record = this.getMapView().getStore().getById(recordId);

        //that is incase this moredetails call is from listview
        if (record == null) {
            record = this.getListView().getItemList().getStore().getById(recordId);
        }

        //To fix the error that comes when getting directions from favorite list (list view)
        var latlng = record.get('geometry').location;
        if (record.get('isFavorite')) {
            var loc = record.get('geometry').location;
            var lat = parseFloat(loc.k);
            var lng = parseFloat(loc.B);//I dunno what on earth is this! first its A now B you pumpkin head google maps
            console.log("lat: " + lat);
            console.log("lng: " + lng);
            latlng = new google.maps.LatLng(lat, lng);
        }
        map.calcRoute(map.getBaseLocation(), latlng, map.getMap());
        //map.calcRoute(map.getBaseLocation(), record.get('geometry').location, map.getMap());

    },

    /*
  * Executed when an item is selected in List view
  */
    onLocationSelect: function (record) {
        var detailsView = this.getDetailsView();

        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView');
        } 
        detailsView.setData(record.getData());


        var loggedIn = EasyTreatyApp.config.getLoggedIn();
        
        detailsView.toggleLikeComment(!loggedIn);

        if (loggedIn) {
            detailsView.toggleLikeButtonState(record.get('isLiked'));
        }

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
        
    },

    showMenu: function () {
        this.getMenu().toggle();
    },

    onChoice: function (choice) {
        console.log("inside on choice");
        var mapview = this.getMapView();
        var locationmap =mapview.getLocationMap();
        var base = locationmap.getBaseLocation();
        var type, title;

        var specialtyField=mapview.getSpecialtySelectField();
        switch (choice) {
            case 0: type = 'hospital';
                title = 'Medical Centers';
                specialtyField.setHidden(false);
                break;
            case 1: type = 'doctor';
                title = 'Doctors';
                specialtyField.setHidden(false);
                break;
            case 2: type = 'pharmacy';
                title = 'Pharmacies';
                specialtyField.setHidden(true);
                break;
        }

        //new design
        // mapview.getBottomBar().setTitle(title);

        console.log("inside mapview controller, base: " + base);

        var radius1 = mapview.getSearchRadius();
        var radius2 = radius1 == null ? 2000 : radius1;

        var specialties1 = mapview.getSpecialties();
        var specialties2 = specialties1 == null ? [] : specialties1;
        
        mapview.getStore().radarSearch(base, type, radius2, locationmap, specialties2);
        //mapview.getStore().populate(new google.maps.LatLng(6.897358, 79.863437), type, mapview.getSearchRadius(), locationmap, mapview.getSpecialties());

        this.getMapView().zoomMap(parseInt(radius2));
    }


});