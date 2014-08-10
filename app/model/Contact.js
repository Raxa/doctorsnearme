/**
 * Authored by Amaya
 */
Ext.define("DoctorsNearMe.model.Contact", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'string' },
            { name: 'displayName', type: 'string' },
            { name: 'phoneNumbers', type: 'auto' },
            { name: 'emails', type: 'auto' }
        ]
    }
})