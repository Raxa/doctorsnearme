/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.MapView', {
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
              //  togglemaplist: "onMapListToggle",
                togglefavorite: "onFavoriteToggle",
                showfavorites: "onShowFavorites",
                basechanged: "onBaseChange"
            },
            detailsView: {
                togglefavorite: "onFavoriteToggle"
            }
        }
        
    },

    onBaseChange: function(){
        var currentSearch = this.getMapView().getCurrentSearch();

        if (currentSearch != null) {
            this.onChoice(currentSearch);
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
        })

    },

    onFavoriteToggle: function (recordId, isFavorite) {
        console.log("is favorite");
        console.log(isFavorite);
        var store = Ext.data.StoreManager.lookup('fav-store');

        var record = this.getMapView().getStore().getById(recordId);

        var string;

        if (isFavorite) {
            record.set('isFavorite', true);

            string = Ext.JSON.encode(record.getData());
            store.storeTokenInLocalStorage(string);
            EasyTreatyApp.config.getFavorites().push(record.getData());
        }
        else {

            string = Ext.JSON.encode(record.getData());
            store.removeTokenFromLocalStorage(string);
            record.set('isFavorite', false);
            var newFav = Ext.Array.filter(EasyTreatyApp.config.getFavorites(), function (item) {
                if (item.reference != record.get('reference')) {
                    return true;
                };
            });
            EasyTreatyApp.config.setFavorites(newFav);

        }

        this.getListView().fillList();


        var starButton = Ext.get(recordId + '-fav');
        if (starButton != null) {
            if (isFavorite) {
                starButton.addCls('favorite');
            } else {
                starButton.removeCls("favorite");
            }
        }
        
    },

    //onMapListToggle: function (hide) {
    //    var menu = this.getMenu();

    //    menu.getChangeLocationButton().setHidden(hide);
    //},

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
    },

    /*
  * Executed when an item is selected in List view
  */
    onLocationSelect: function (record) {
        console.log("on location select");
        console.log(record);
        var detailsView = this.getDetailsView();

        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView', { data: record.getData() });
        } else {
            detailsView.setData(record.getData());
        }

        //detailsView.setData(record.getData());

        var favoriteButton = detailsView.getFavoriteButton();
        if (detailsView.getData().isFavorite) {
            favoriteButton.setIconCls('color-star');
        }
        else {
            favoriteButton.setIconCls('star');
        }

        var loggedIn = EasyTreatyApp.config.getLoggedIn();
        
        detailsView.toggleLikeComment(!loggedIn);

        if(loggedIn){
            this.checkLiked(detailsView,record);
        }
        detailsView.getLikeCount(detailsView.getData().id);

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
                var like = Ext.JSON.decode(response.responseText).likes;

                //if (like == 1) {
                //    detailsView.toggleLikeButtonState(true);
                //} else {
                //    detailsView.toggleLikeButtonState(false);
                //}
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

            mapview.getTopToolBar().setTitle(title);
        
        

        mapview.getStore().populate(base, type, mapview.getSearchRadius(), locationmap, mapview.getSpecialties());

        this.getMapView().zoomMap(parseInt(mapview.getSearchRadius()));
    }


});