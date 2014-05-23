/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',
    requires:['Ext.data.proxy.Rest'],

    config: {
        model: 'EasyTreatyApp.model.Location',
        proxy: {
                type: 'rest',
                url:EasyTreatyApp.config.getDomain()+'location/',
                extraParams: {
                    limit: '100',
                    v: 'full'
                },
                username: EasyTreatyApp.config.getOpenMRSUsername(),
                password: EasyTreatyApp.config.getOpenMRSPassword(),
                withCredentials:true,
                reader: {
                    type: 'json',
                    rootProperty: 'results',
                },
                method: 'get'
        },
        autoload:false
    }

});