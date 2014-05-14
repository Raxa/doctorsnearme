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
            locFilterView: 'locfilterview',
            docFilterView: 'docfilterview',
            pharFilterView: 'pharfilterview',
            userProfile: 'userprofile',
            loginView: 'loginview',
            listView:'listview'
        },
        
        control: {            
            sideMenu: {
                showprofile: "showUserProfile",
                addfilters: "onAddFiltersButtonTap",
                changelocation: "onChangeLocation",
                trafficon: "onShowTraffic",
                login: "onLoginButtonTap",
                sort:"onSort"
            }
        }
    },

   
    /**
     * go to LogIn View
     * @method
     * @private
     */
    onLoginButtonTap: function () {
        EasyTreatyApp.config.setLoggedIn(true);
        var loginView = this.getLoginView();

        if (loginView == undefined) {
            loginView = Ext.create('EasyTreatyApp.view.Login');

            Ext.Viewport.add(loginView);
        }

        Ext.Viewport.setActiveItem(loginView);
    },
 
    /**
     * go to Filter View
     * @method
     * @private
     */
    onAddFiltersButtonTap: function() {
        var currentSearch = this.getMapView().getCurrentSearch();
        console.log("current search: "+currentSearch);
        var filterview;

        switch (currentSearch) {
            case 0:
                filterview = this.getLocFilterView();
                if (filterview === null) {
                    filterview = Ext.create('EasyTreatyApp.view.LocationFilterView');
                }
                break;

            case 1:
                filterview = this.getDocFilterView();
                if (filterview === null) {
                    filterview = Ext.create('EasyTreatyApp.view.DoctorFilterView');
                }
                break;
            case 2:
                filterview = this.getPharFilterView();
                if (filterview === null) {
                    filterview = Ext.create('EasyTreatyApp.view.PharmacyFilterView');
                }
                break;
        }
        Ext.Viewport.add(filterview);
        Ext.Viewport.setActiveItem(filterview);
    },


    /**
     * go to Profile View
     * @method
     * @private
     */
    showUserProfile: function () {
        
        var profile = this.getUserProfile();

        if (profile == null) {            
            profile = Ext.create('EasyTreatyApp.view.UserProfile');
        }

        Ext.Viewport.add(profile);
        Ext.Viewport.setActiveItem(profile);
    },
    
    /**
     * On change location event
     * @method
     * @private
     */
    onChangeLocation : function() {
        Ext.Msg.alert("Guide", "Click anywhere & press Done");
        this.getMapView().changeTheRelativeLocationForSearch();
    },
 
    /**
     * On on of off traffic event
     * @method
     * @private
     */
    onShowTraffic: function(button,show) {       
        //this.getMapView().getComponent(0).setTrafficLayer(show);
        this.getMapView().getMapPanel().setTrafficLayer(show);
    },
    
    onSort: function() {
        var listView = this.getListView();

        if (listView == null) {
            listView = Ext.create('EasyTreatyApp.view.ListView');
        }

        listView.setListStore(this.getMapView().getCurrentSearch());
        listView.setTheTitle(this.getMapView().getToolbarTitle());
        
        var mapPanel = this.getMapView().getMapPanel();
        var locations = mapPanel.getLocations();
        var relativePosition = mapPanel.getRelativeLocation();

        Ext.Array.forEach(locations, function (location) {
            location.distance = EasyTreatyApp.math.distanceCalculator(relativePosition.lat(), relativePosition.lng(), location.latitude, location.longitude, 'K');
        });
        listView.setListData(locations);

        Ext.Viewport.add(listView);
        Ext.Viewport.setActiveItem(listView);
    }
})