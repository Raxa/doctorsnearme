/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.User', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.User',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            // url: 'data.json',
            url: 'data.json',
            reader: {
                type: 'json',
                rootProperty: 'user'
            }
        }
    }

});