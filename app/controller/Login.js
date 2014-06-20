/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            loginView: 'loginview',
            sideMenu: "mainmenu",
            detailsView:'detailsview'
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
        var me = this;
        var encodedString = "Basic " + btoa(EasyTreatyApp.config.getUserName() + ":" + EasyTreatyApp.config.setPassword());

        Ext.Ajax.request({
            // url: 'https://api.raxa.io/ws/rest/v1/session',
            url:EasyTreatyApp.config.getDomain()+'session',
            method: 'DELETE',
            success: function (response, opts) {
                console.log("success");

                me.logoutSuccess();

            },
            failure: function (response, opts) {
                console.log("failure");
            },
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': encodedString
            }
        });

    },

    logoutSuccess: function () {

        var lang = EasyTreatyApp.config.getLanguage();
        var sideMenu = this.getSideMenu();
        sideMenu.atLogOut();
        EasyTreatyApp.config.setLoggedIn(false);

        sideMenu.getProfileButton().doSetHidden(true);
        sideMenu.getLogInButton().setText(lang.LOG_IN);
        
        var detailsView = this.getDetailsView();
        if (detailsView != null) {
            detailsView.toggleLikeComment(true);
        }

        EasyTreatyApp.config.setUser(null);

        EasyTreatyApp.config.setUserName(null);
        EasyTreatyApp.config.setPassword(null);
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
            url: 'https://api.raxa.io/ws/rest/v1/raxacore/login',
          // url:EasyTreatyApp.config.getDomain()+'raxacore/login',
            method: 'GET',
           // withCredentials: true,
            success: function (response, opts) {
                console.log("success");
               // Ext.Msg.alert("success");
                me.logInSuccess(Ext.JSON.decode(response.responseText),values);
                
            },
            failure: function (response, opts) {
                 Ext.Msg.alert("failure:"+response.responseText);
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

    logInSuccess: function (loginResponse,values) {
        EasyTreatyApp.config.setLoggedIn(true);
        var lang = EasyTreatyApp.config.getLanguage();
        var user = Ext.create('EasyTreatyApp.model.User');

        user.setData(loginResponse);

        EasyTreatyApp.config.setUser(user);

        EasyTreatyApp.config.setUserName(values.userName);
        EasyTreatyApp.config.setPassword(values.password);

        this.getSideMenu().getProfileButton().doSetHidden(false);
        this.getSideMenu().getLogInButton().setText(lang.LOG_OUT);

        var detailsView = this.getDetailsView();
        if (detailsView != null) {
            detailsView.toggleLikeComment(false);
        }
        this.proceed();
    }

})