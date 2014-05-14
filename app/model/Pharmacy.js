/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.Pharmacy", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'name', type: 'string' },
            { name: 'address1', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'phoneNumber', type: 'string' },
            { name: 'distance', type: 'int' },
            { name: 'cost', type: 'int' }        
        ]
    }
})