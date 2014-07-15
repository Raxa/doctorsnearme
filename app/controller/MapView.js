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
              //  togglemaplist: "onMapListToggle",
              //  togglefavorite: "onFavoriteToggle",
                showfavorites: "onShowFavorites",
                basechanged: "onBaseChange",
                backtomap:"onBackToMap"
            },
            detailsView: {
               // togglefavorite: "onFavoriteToggle",
                //after new design
                getdirections:"directToMapView"
            }
        }
        
    },

    directToMapView: function(id){
       
        var mapview = this.getMapView();
        this.onGetDirections(mapview.getLocationMap(), id);
        Ext.Viewport.setActiveItem(mapview);
        this.onBackToMap();
    },

    onBackToMap: function () {
        var mapview = this.getMapView();

        mapview.getSearchField().setHidden(false);
        mapview.getSpecialtySelectField().setHidden(false);

        mapview.setActiveItem(0);
    },

    onBaseChange: function(initialUserLocationSetting){
        var currentSearch = this.getMapView().getCurrentSearch();

        if (currentSearch != null) {
            this.onChoice(currentSearch);
        } else if (initialUserLocationSetting) {
            this.onChoice(0);
        }
    },

    onShowFavorites: function(){
        var store = Ext.data.StoreManager.lookup('fav-store');

        store.load();
        var locationStore = this.getMapView().getStore();
        locationStore.storeClear();
        var location;
        store.getRange().forEach(function (record) {
            location = Ext.JSON.decode(record.get('query'));
            console.log("decoded...");
            console.log(location);
            locationStore.addFavoriteItem(location);
        });

    },    

    onMoreDetails: function(map,recordId){
        var record = this.getMapView().getStore().getById(recordId);

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

        map.calcRoute(map.getBaseLocation(), record.get('geometry').location, map.getMap());

       // console.log(Ext.device.Contacts.getContacts());
    },

    /*
  * Executed when an item is selected in List view
  */
    onLocationSelect: function (record) {
        console.log("on location select");
        console.log(record);
        var detailsView = this.getDetailsView();

        //if (detailsView == undefined) {
        //    detailsView = Ext.create('EasyTreatyApp.view.DetailsView', { data: record.getData() });
        //} else {
        //    detailsView.setData(record.getData());
        //}

        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView');
        } 
        detailsView.setData(record.getData());


        var loggedIn = EasyTreatyApp.config.getLoggedIn();
        
        detailsView.toggleLikeComment(!loggedIn);

        if(loggedIn){
            this.checkLiked(detailsView,record);
        }
     //   detailsView.getLikeCount(detailsView.getData().id);

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
        
    },

    checkLiked: function (detailsView,record) {
        var me = this;
        Ext.Ajax.request({
            // url: 'http://localhost:8888/checkLike',
            // url: 'http://192.168.122.1:8888/checkLike',
            url:EasyTreatyApp.config.getRatingServerDomain()+'checkLike',
            method: 'GET',
            params: {
                location: record.get('id'),
                user: EasyTreatyApp.config.getUser().get('personUuid')
            },
            success: function (response, opts) {
               // Ext.Msg.alert("like success");
                console.log("success");
                console.log(response);
                // var like = Ext.JSON.decode(response.responseText).likes;
                var like = Ext.JSON.decode(response.responseText).data[0].status;
                console.log("like: " + like);

                if (like == 1) {
                    console.log("like==1");
                    detailsView.toggleLikeButtonState(true);
                    detailsView.setLiked(true);
                } else {
                    console.log("like!=1");
                    detailsView.toggleLikeButtonState(false);
                    detailsView.setLiked(false);
                }

            },
            failure: function (response, opts) {
                Ext.Msg.alert("like failure");
                console.log("failure");
                console.log(response);
            }
        });
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
        
      //  mapview.getStore().populate(base, type, mapview.getSearchRadius(), locationmap, mapview.getSpecialties());
        mapview.getStore().populate(new google.maps.LatLng(6.897358, 79.863437), type, mapview.getSearchRadius(), locationmap, mapview.getSpecialties());

        this.getMapView().zoomMap(parseInt(mapview.getSearchRadius()));
    }


});