/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.config.Runtime', {
    singleton: true,

    config: {      
        domain: 'https://api.raxa.io/ws/rest/v1/',

        //ratingServerDomain: 'http://192.168.122.1:8888/',
        ratingServerDomain: 'http://192.168.56.1:8888/',
        openMRSUsername: 'jameskierkegaard',

        openMRSPassword: 'Hello123',

        user:null,

        loggedIn: false,

        favorites: [],

        language: EN,

        userName: null,

        password:null

    },

    constructor: function (config) {
        this.initConfig(config);
    },

    

}, function () {
    EasyTreatyApp.config = this;
}
);