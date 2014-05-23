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
            loginView: 'loginview',
        },
        
        control: {            
            sideMenu: {
                changelocation: "onChangeLocation",
                login: "onLoginButtonTap",
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
     * On change location event
     * @method
     * @private
     */
    onChangeLocation : function() {
        Ext.Msg.alert("Guide", "Click anywhere & press Done");
        this.getMapView().changeBaseLocationToSearch();
    }
 

})