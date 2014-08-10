/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.Login', {
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
        var encodedString = "Basic " + btoa(DoctorsNearMe.config.getUserName() + ":" + DoctorsNearMe.config.setPassword());

        Ext.Ajax.request({
             url: 'http://api.raxa.io/ws/rest/v1/session',
           // url:DoctorsNearMe.config.getDomain()+'session',
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

        var lang = DoctorsNearMe.config.getLanguage();
        var sideMenu = this.getSideMenu();
        sideMenu.atLogOut();
        DoctorsNearMe.config.setLoggedIn(false);

        sideMenu.getProfileButton().doSetHidden(true);
        sideMenu.getLogInButton().setText(lang.LOG_IN);
        
        var detailsView = this.getDetailsView();
        if (detailsView != null) {
            detailsView.toggleLikeComment(true);
        }

        DoctorsNearMe.config.setUser(null);

        DoctorsNearMe.config.setUserName(null);
        DoctorsNearMe.config.setPassword(null);
    },
    
    proceed: function() {
        var mapview = this.getMapView();

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    },
    
    onLogInPageRequest: function () {
        var loginView = this.getLoginView();

        if (loginView == undefined) {
            loginView = Ext.create('DoctorsNearMe.view.Login');

            Ext.Viewport.add(loginView);
        }

        Ext.Viewport.setActiveItem(loginView);
        
    },

    authenticate: function () {

        var values = this.getLoginView().getTheValues();

        var encodedString = "Basic " + btoa(values.userName + ":" + values.password);

        var me = this;
        Ext.Ajax.request({
            url: 'http://api.raxa.io/ws/rest/v1/raxacore/login',
          // url:DoctorsNearMe.config.getDomain()+'raxacore/login',
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
        DoctorsNearMe.config.setLoggedIn(true);
        var lang = DoctorsNearMe.config.getLanguage();
        var user = Ext.create('DoctorsNearMe.model.User');

        user.setData(loginResponse);

        DoctorsNearMe.config.setUser(user);
        console.log(user);

        DoctorsNearMe.config.setUserName(values.userName);
        DoctorsNearMe.config.setPassword(values.password);

        this.getSideMenu().getProfileButton().doSetHidden(false);
        this.getSideMenu().getProfileButton().setText(user.getData().display);
        this.getSideMenu().getLogInButton().setText(lang.LOG_OUT);

        var detailsView = this.getDetailsView();
        if (detailsView != null) {
            detailsView.toggleLikeComment(false);
        }
        this.proceed();
        this.getMapView().getStore().setLikeForRecords();
    }

})