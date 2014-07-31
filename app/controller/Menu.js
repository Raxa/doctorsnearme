/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.Menu', {
    extend: 'Ext.app.Controller',
    
    config: {
        
        refs:
        {
            sideMenu: 'mainmenu',
            mapView: 'mapview',
            userProfile: 'userprofile',
            listView:'listview'
        },
        
        control: {            
            sideMenu: {
                searchradiuschange: "onSearchRadiusChange",
                specialtychange: "onSpecialtyChange",
                choice: "onChoice",
                showfavorites: "onShowFavorites",
            }
        }
    },

    onShowFavorites: function () {
        console.log("on show favorites");
        var store = Ext.data.StoreManager.lookup('fav-store');

        store.load();

        var mapview = this.getMapView();
        var listview = this.getListView();
        var favStore = listview.getItemList().getStore();

        var location;
        store.getRange().forEach(function (record) {
            location = Ext.JSON.decode(record.get('query'));
            console.log("decoded...");
            console.log(location);
            favStore.add(location);
        });

        listview.fillList();

        mapview.setActiveItem(1);
        //  mapview.getSearchField().setHidden(true);
        mapview.getSearchToolbar().setHidden(true);
        mapview.getSpecialtySelectField().setHidden(true);
        mapview.getLocator().setHidden(true);

        this.getSideMenu().toggle();

    },

    onChoice: function (choice) {
        console.log("inside onchoice menu controller");
        this.getMapView().setCurrentSearch(choice);
    },

    onSearchRadiusChange: function (newRadius) {
        console.log("on search radius change");
        this.getMapView().setSearchRadius(newRadius*1000);
    },

    onSpecialtyChange: function (newSpecialtyArray) {
        this.getMapView().setSpecialties(newSpecialtyArray);
    }
 

})