/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.MapView', {
    extend: 'Ext.app.Controller',
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
                detailsreadyfordetailsview:"onDetailsReady"
            },
            detailsView: {
                getdirections: "directToMapView",
                forward: "forwardToNextLocation"
            },
            listView: {
                moredetails: "onMoreDetails",
                getdirections: "directToMapView"
            }
        }
        
    },

    /**
     * In case a separate request is sent for get place details, after getting details this will be called
     * @method
     * @private
     */
    onDetailsReady: function(record){
        this.onLocationSelect(record);
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

        if (nextRecord.get('name') == null) {
            //marker is set to null. by this way we can reuse the function in store
            store.setDetailsForTheRecord(nextRecord, null);
        } else {
            this.onLocationSelect(nextRecord);
        }
        
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
    onTextSearch: function(searchField){
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

            this.getMapView().zoomMap(10000);

            this.getMenu().unCheckRadioButtons();
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

        mapview.getSearchToolbar().setHidden(false);
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
        var geometry = record.get('geometry');

        if (geometry != null) {
            var latlng = geometry.location;

            if (record.get('isFavorite')) {
                var loc = record.get('geometry').location;
                var lat = parseFloat(loc.k);
                var lng = parseFloat(loc.B);//I dunno what on earth is this! first its A now B you pumpkin head google maps
                console.log("lat: " + lat);
                console.log("lng: " + lng);
                latlng = new google.maps.LatLng(lat, lng);
            }
            map.calcRoute(map.getBaseLocation(), latlng, map.getMap());
        } 
       

    },

    /*
     * Executed when an item is selected in List view
     * @method
     * @param {Object} record
     * @private
     */
    onLocationSelect: function (record) {
        var detailsView = this.getDetailsView();

        if (detailsView == undefined) {
            detailsView = Ext.create('DoctorsNearMe.view.DetailsView');
        } 
        detailsView.setData(record.getData());


        var loggedIn = DoctorsNearMe.config.getLoggedIn();
        
        detailsView.toggleLikeComment(!loggedIn);

        if (loggedIn) {
            detailsView.toggleLikeButtonState(record.get('isLiked'));
        }

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
        
    },

    /*
     * Shows the side menu
     * @method
     * @private
     */
    showMenu: function () {
        this.getMenu().toggle();
    },

    /*
     * Executed when a new search is initiated
     * @method
     * @param {Integer} the search choice of the user
     * @private
     */
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
                break;
            case 1: type = 'doctor';
                title = 'Doctors';
                break;
            case 2: type = 'pharmacy';
                title = 'Pharmacies';
                break;
        }

        console.log("inside mapview controller, base: " + base);

        var radius1 = mapview.getSearchRadius();

        console.log("radius: " + radius1)

        //if radius is null set it to 2km
        var radius2 = radius1 == null ? 2000 : radius1;

        var specialties1 = mapview.getSpecialties();

        //if specialties are null set it to empty array
        var specialties2 = specialties1 == null ? [] : specialties1;
        
        mapview.getStore().radarSearch(base, type, radius2, locationmap, specialties2);

        this.getMapView().zoomMap(parseInt(radius2));
    }


});