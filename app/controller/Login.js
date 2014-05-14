/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            loginView: 'loginview',
            sideMenu:"mainmenu"
        },

        control: {
            sideMenu: {
                logout: "onLogout"
            },
            loginView: {
                login: "onLogin",
                
                cancel:"proceed"
            }
        }
    },
 
    onLogout: function (sideMenu) {
        //TODO: Implement logout functionality
        sideMenu.atLogOut();
        EasyTreatyApp.config.setLoggedIn(false);
    },

    
    proceed: function() {
        var mapview = this.getMapView();

        if (mapview === null) {
            mapview = Ext.create('EasyTreatyApp.view.MapView');
        }

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    },
    
    onLogin: function () {
        
        //TODO: implement login functionality
        this.getSideMenu().getProfileButton().doSetHidden(false);
        this.getSideMenu().getLogInButton().setText('Log out');
        EasyTreatyApp.config.setLoggedIn(true);

        this.proceed();
    }

})