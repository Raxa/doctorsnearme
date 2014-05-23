/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Pharmacy', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Pharmacy',
       // autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'data.json',
            reader: {
                type: 'json',
                rootProperty: 'pharmacy'
            }
        }
    }

});