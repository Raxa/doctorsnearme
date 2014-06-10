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
                specialtychange: "onSpecialtyChange"
            }
        }
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
        this.getMapView().setSearchRadius(newRadius);
    },

    onSpecialtyChange: function (newSpecialtyArray) {
        this.getMapView().setSpecialties(newSpecialtyArray);
    }
 

})