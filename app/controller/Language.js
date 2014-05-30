/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.Language', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            sideMenu: 'mainmenu',
            detailsView: 'detailsview',
            mapView: 'mapview',
            userProfile: 'userprofile'
        },
        control: {
            sideMenu: {
                languagechange: "onLanguageChange"
            }

        }
    },

    onLanguageChange: function (newLang, oldLang) {
        var language,prevLanguage;
        switch (newLang) {
            case 'en': language = EN;
                break;
            case 'si': language = SI;
                break;
        }

        switch (oldLang) {
            case 'en': prevLanguage = EN;
                break;
            case 'si': prevLanguage = SI;
                break;
        }

        EasyTreatyApp.config.setLanguage(language);

        this.getSideMenu().setLanguage();

        var detailsview = this.getDetailsView();

        if(detailsview!=null){
            detailsview.setLanguage();
        }

        var profile = this.getUserProfile();

        if (profile != null) {
            profile.setLanguage();
        }
        
        this.getMapView().setLanguage(language,prevLanguage);

    }

})