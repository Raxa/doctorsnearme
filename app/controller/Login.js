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
                forgotpassword:"onForgotPassword",
                cancel:"proceed"
            }
        }
    },

    /**
     * Resets password
     * @method
     * @private
     */
    onForgotPassword:function(userName){
        if (userName === '') {
            Ext.Msg.alert('Field Required', 'Please fill in your Username or Email');
        } else {
            var urlParam = '';
            if (! /.*@.*/.test(userName)) {
                console.log('Resetting via username');
                urlParam = 'resetUsername=' + userName;
            } else {
                console.log('Resetting via Email');
                urlParam = 'resetEmail=' + userName;
            }
            Ext.Ajax.request({
                scope: this,
                url: DoctorsNearMe.config.getDomain()+'/raxacore/user?' + urlParam,
                method: 'GET',
                disableCaching: false,
                headers: { 
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                success: function (response) {
                    var responseJSON = Ext.decode(response.responseText);
                    Ext.Msg.alert(responseJSON.title, responseJSON.body);
                },
                failure: function () {
                    Ext.Msg.alert('Error', 'Failed to Reset Password! Please contact support@raxa.io');
                }
            });
        }
    },

    /**
     * Called when user clicks log out
     * @method
     * @private
     */
    onLogout: function (sideMenu) {
        var me = this;
        var encodedString = "Basic " + btoa(DoctorsNearMe.config.getUserName() + ":" + DoctorsNearMe.config.setPassword());

        Ext.Ajax.request({
            url:DoctorsNearMe.config.getDomain()+'session',
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

    /**
     * Called if log out is successful 
     * @method
     * @private
     */
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

    /**
     * Go back to mapview 
     * @method
     * @private
     */
    proceed: function() {
        var mapview = this.getMapView();

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    },

    /**
     * Called when user clicks login to go to login view 
     * @method
     * @private
     */
    onLogInPageRequest: function () {
        var loginView = this.getLoginView();

        if (loginView == undefined) {
            loginView = Ext.create('DoctorsNearMe.view.Login');

            Ext.Viewport.add(loginView);
        }

        Ext.Viewport.setActiveItem(loginView);
        
    },

    /**
     * Sends request to log in
     * @method
     * @private
     */
    authenticate: function () {

        var values = this.getLoginView().getTheValues();

        var encodedString = "Basic " + btoa(values.userName + ":" + values.password);

        var me = this;
        Ext.Ajax.request({
           url:DoctorsNearMe.config.getDomain()+'raxacore/login',
            method: 'GET',
            success: function (response, opts) {
                console.log("success");
                me.logInSuccess(Ext.JSON.decode(response.responseText),values);
                
            },
            failure: function (response, opts) {
                 Ext.Msg.alert("Unable to login");
                console.log("failure");
            },
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': encodedString
            }
        });
    },

    /**
     * Called if authntication is successful 
     * @method
     * @private
     */
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