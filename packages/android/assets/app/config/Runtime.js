/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.config.Runtime', {
    singleton: true,

    config: {        
        userName: 'Harry Potter',

        userId: 1,
             
        // domain: 'http://localhost:8081/openmrs-standalone/ws/rest/v1/',
        // domain: 'http://192.168.1.4:8081/openmrs-standalone/ws/rest/v1/',
        //  domain: 'http://192.168.1.108:8081/openmrs-standalone/ws/rest/v1/',
        domain: 'https://api.raxa.io/ws/rest/v1/',
        openMRSUsername: 'jameskierkegaard',

        openMRSPassword: 'Hello123',
        
        // openMRSUsername: 'admin',
        //  openMRSPassword: 'test',

        loggedIn: false
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    

}, function () {
    EasyTreatyApp.config = this;
}
);