Ext.define('EasyTreatyApp.store.OpenmrsLocation', {
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.Rest'],

    config: {
        model: 'EasyTreatyApp.model.OpenmrsLocation',
        storeId:'raxadoctor-store',
        autoload: false
    },

    setProxyToTheStore: function (city) {
        this.setProxy({
            type: 'rest',
            url: 'http://api.raxa.io/ws/rest/v1/location?cityVillage=' + city,
            extraParams: {
                country: 'india',
                //  limit: '10',
                v: 'full',

            },
            username: 'garippa.haroun',//EasyTreatyApp.config.getOpenMRSUsername(),
            password: 'asdf',//EasyTreatyApp.config.getOpenMRSPassword(),
            withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: 'results',
            },
            method: 'get'
        });
    }



});