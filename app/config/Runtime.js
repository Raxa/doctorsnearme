/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.config.Runtime', {
    singleton: true,

    config: {      
        domain: 'http://api.raxa.io/ws/rest/v1/',

        //ratingServerDomain: 'http://192.168.122.1:8888/',
        ratingServerDomain: 'http://192.168.56.1:8888/',
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

            EasyTreatyApp.config.setLanguage(EN);

            //create slide menu
            var menu = Ext.create('EasyTreatyApp.view.Menu');
            Ext.Viewport.add(menu);

            //create mapview
            var mapView = Ext.create('EasyTreatyApp.view.MapView');
            Ext.Viewport.add(mapView);
            Ext.Viewport.setActiveItem(mapView);

            //create favorites store
            var favoritesStore = Ext.create('EasyTreatyApp.store.Memory', {
                storeId: 'fav-store'
            });

            //load from local storage
            favoritesStore.load();

            //store favorites from local storage in a runtime variable
            var currentFavorites = EasyTreatyApp.config.getFavorites();
            favoritesStore.getRange().forEach(function (record) {
                currentFavorites.push(Ext.JSON.decode(record.get('query')));
            });
        }, 200);
            
    }
    

}, function () {
    EasyTreatyApp.config = this;
}
);