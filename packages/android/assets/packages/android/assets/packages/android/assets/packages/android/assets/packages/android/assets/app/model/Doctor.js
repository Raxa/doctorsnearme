/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.Doctor", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'name', type: 'string' },
            { name: 'address1', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'phoneNumber', type: 'string' },
            { name: 'specialized', type: 'auto' },
            { name: 'distance', type: 'int' }      
        ]
    }
})