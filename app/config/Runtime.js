/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.config.Runtime', {
    singleton: true,

    config: {      
        domain: 'https://api.raxa.io/ws/rest/v1/',
        openMRSUsername: 'jameskierkegaard',

        openMRSPassword: 'Hello123',

        user:null,

        loggedIn: false,

        favorites: [],

        language:EN

    },

    constructor: function (config) {
        this.initConfig(config);
    },

    

}, function () {
    EasyTreatyApp.config = this;
}
);