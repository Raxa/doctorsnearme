/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Doctor', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Doctor',
        //autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'data.json',
            reader: {
                type: 'json',
                rootProperty: 'doctor'
            }
        }
    }

});