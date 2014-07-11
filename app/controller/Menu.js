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
            userProfile:'userprofile'
        },
        
        control: {            
            sideMenu: {
                showprofile: "onShowProfile",
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
        var locationStore = mapview.getStore();
        locationStore.storeClear();
        var location;
        store.getRange().forEach(function (record) {
            location = Ext.JSON.decode(record.get('query'));
            console.log("decoded...");
            console.log(location);
            locationStore.addFavoriteItem(location);
        });

        mapview.setActiveItem(1);
        mapview.getSearchField().setHidden(true);
        mapview.getSpecialtySelectField().setHidden(true);

    },

    onChoice: function (choice) {
        console.log("inside onchoice menu controller");
        this.getMapView().setCurrentSearch(choice);
    },

    onShowProfile: function () {
        var profileView = this.getUserProfile();

        if (profileView == null) {
            profileView = Ext.create('EasyTreatyApp.view.UserProfile');
            profileView.setData(EasyTreatyApp.config.getUser().getData());
            console.log("user: ");
            console.log(EasyTreatyApp.config.getUser().getData());
            Ext.Viewport.add(profileView);
        }

        Ext.Viewport.setActiveItem(profileView);
    },

    onSearchRadiusChange: function (newRadius) {
        this.getMapView().setSearchRadius(newRadius*1000);
    },

    onSpecialtyChange: function (newSpecialtyArray) {
        this.getMapView().setSpecialties(newSpecialtyArray);
    }
 

})