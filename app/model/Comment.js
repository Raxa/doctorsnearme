/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.Comment", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'timestamp', type: 'string' },
            { name: 'comment', type: 'string' }
        ]
    }
})