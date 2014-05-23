/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.User", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'weight', type: 'string' },
            { name: 'remarks', type: 'auto' }
        ]
    }
})