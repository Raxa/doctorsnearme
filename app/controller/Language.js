/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.Language', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            sideMenu: 'mainmenu',
            detailsView: 'detailsview',
            mapView: 'mapview',
            listView: 'listview',
            loginView: 'loginview',
            shareOptionsList: 'sharelist',
            contactList: 'contactlist',
            thankPanel: 'thanks'
        },
        control: {
            sideMenu: {
                languagechange: "onLanguageChange"
            }

        }
    },

    /**
     * Convert the language in each view 
     * @method
     * @private
     */
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

        DoctorsNearMe.config.setLanguage(language);

        this.getSideMenu().setLanguage();

        var detailsview = this.getDetailsView();

        if(detailsview!=null){
            detailsview.setLanguage();
        }

        var loginview = this.getLoginView();

        if (loginview != null) {
            loginview.setLanguage();
        }
        
        if (prevLanguage != null) {
            prevLanguage = language;
        }

        var mapview = this.getMapView();

        if (mapview != null) {
            mapview.setLanguage(language, prevLanguage);
        }

        var listview = this.getListView();

        if (listview != null) {
            listview.setLanguage(language, prevLanguage);

            listview.refreshTemplate();
        }

        var shareList = this.getShareOptionsList();
        if (shareList != null) {
            shareList.setLanguage();
        }

        var contactList = this.getContactList();
        if (contactList != null) {
            contactList.setLanguage();
        }
        
        var thankPanel = this.getThankPanel();
        if (thankPanel != null) {
            thankPanel.setHtml('<span style="color:#1081FB;background-color:transparent"><b>' + DoctorsNearMe.config.getLanguage().THANKS + '</b></span>');
        }
    }

})