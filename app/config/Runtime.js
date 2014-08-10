/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.config.Runtime', {
    singleton: true,

    config: {      
        domain: 'http://api.raxa.io/ws/rest/v1/',

        //ratingServerDomain: 'http://192.168.122.1:8888/',
       // ratingServerDomain: 'http://192.168.56.1:8888/',
        ratingServerDomain: 'http://192.168.1.2:8888/',
        openMRSUsername: 'jameskierkegaard',

        openMRSPassword: 'Hello123',

        user:null,

        loggedIn: false,

        favorites: [],

        language: null,

        userName: null,

        password:null

    },

    constructor: function (config) {
        this.initConfig(config);
    },

    startApp: function () {

        Ext.Function.defer(function () {
            Ext.fly('splash').destroy();
            Ext.fly('bluespin').destroy();

            DoctorsNearMe.config.setLanguage(EN);

            //create slide menu
            var menu = Ext.create('DoctorsNearMe.view.Menu');
            Ext.Viewport.add(menu);

            var contactList = Ext.create('DoctorsNearMe.view.ContactList');
            Ext.Viewport.add(contactList);

            //create mapview
            var mapView = Ext.create('DoctorsNearMe.view.MapView');
            Ext.Viewport.add(mapView);
            Ext.Viewport.setActiveItem(mapView);

            //create favorites store
            var favoritesStore = Ext.create('DoctorsNearMe.store.Memory', {
                storeId: 'fav-store'
            });

            //load from local storage
            favoritesStore.load();

            //store favorites from local storage in a runtime variable
            var currentFavorites = DoctorsNearMe.config.getFavorites();
            favoritesStore.getRange().forEach(function (record) {
                currentFavorites.push(Ext.JSON.decode(record.get('query')));
            });

           
            //var store = Ext.create('DoctorsNearMe.store.Contact');
            //store.loadContacts();
        }, 10);

        

            
    }
    

}, function () {
    DoctorsNearMe.config = this;
}
);