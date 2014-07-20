Ext.define('EasyTreatyApp.store.OpenmrsLocation', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.Rest'],

    config: {
        model: 'EasyTreatyApp.model.OpenmrsLocation',
        proxy: {
            type: 'rest',
            url: 'https://api.raxa.io/ws/rest/v1/location/',
            extraParams: {
                country: 'india',
                limit: '200',
                v: 'full',

            },
            //username: 'garippa.haroun',//EasyTreatyApp.config.getOpenMRSUsername(),
            //password: 'asdf',//EasyTreatyApp.config.getOpenMRSPassword(),
            //withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: 'results',
            },
            method: 'get'
        },
        autoload: false
    }

});