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
                loginpagerequested: "onLogInPageRequest",
                logout:"onLogout"
            },
            loginView: {
                login: "authenticate",
                
                cancel:"proceed"
            }
        }
    },
 
    onLogout: function (sideMenu) {
        //TODO: Implement logout functionality
        var lang = EasyTreatyApp.config.getLanguage();
        var sideMenu = this.getSideMenu();
        sideMenu.atLogOut();
        EasyTreatyApp.config.setLoggedIn(false);


        sideMenu.getProfileButton().doSetHidden(true);
        sideMenu.getLogInButton().setText(lang.LOG_IN);
    },

    
    proceed: function() {
        var mapview = this.getMapView();

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    },
    
    onLogInPageRequest: function () {
        var loginView = this.getLoginView();

        if (loginView == undefined) {
            loginView = Ext.create('EasyTreatyApp.view.Login');

            Ext.Viewport.add(loginView);
        }

        Ext.Viewport.setActiveItem(loginView);
        
    },

    authenticate: function () {

        var values = this.getLoginView().getTheValues();

        var encodedString = "Basic " + btoa(values.userName + ":" + values.password);

        var me = this;
        Ext.Ajax.request({
            //url: 'https://api.raxa.io/login.htm',
            url: 'https://api.raxa.io/ws/rest/v1/raxacore/login',
            method: 'GET',
           // withCredentials: true,
            success: function (response, opts) {
                console.log("success");

                me.logInSuccess(Ext.JSON.decode(response.responseText));
                
            },
            failure: function (response, opts) {
                console.log("failure");
            },
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': encodedString
                //'Authorization': 'Basic Z2FyaXBwYS5oYXJvdW46YXNkZg=='
                //'Authorization': 'Basic YW1heWE6ZWFzeXRyZWF0eTM0MjE'
                //'Authorization': 'Basic amFtZXNraWVya2VnYWFyZDpIZWxsbzEyMw=='
            }
        });
    },

    logInSuccess: function (loginResponse) {
        EasyTreatyApp.config.setLoggedIn(true);
        var lang = EasyTreatyApp.config.getLanguage();
        var user = Ext.create('EasyTreatyApp.model.User');

        user.setData(loginResponse);

        EasyTreatyApp.config.setUser(user);

        this.getSideMenu().getProfileButton().doSetHidden(false);
        this.getSideMenu().getLogInButton().setText(lang.LOG_OUT);
        this.proceed();
    }

})