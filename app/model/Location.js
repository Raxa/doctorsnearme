/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.Location", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'formatted_address', type: 'string' },
            { name: 'geometry', type: 'auto' },
            { name: 'international_phone_number', type: 'string' },
            { name: 'reviews', type: 'auto' },
            { name: 'opening_hours', type: 'auto' },
            { name: 'types', type: 'auto' },
            { name: 'specialty', type: 'auto' },
            { name: 'reference', type: 'string' },
            { name: 'isFavorite', type: 'boolean' }
        ]
    }
})