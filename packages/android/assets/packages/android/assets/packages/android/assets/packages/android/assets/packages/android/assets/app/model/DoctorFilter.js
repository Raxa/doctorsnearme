/**
 * Authored by Amaya
 */
Ext.define("EasyTreatyApp.model.DoctorFilter", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'specializedIn', type: 'string' },
            { name: 'maxCost', type: 'int' },
            { name: 'minCost', type: 'int' },
            { name: 'maxDistance', type: 'int' },
            { name: 'noOfResults', type: 'string' }
            
        ],
        validations: [
            { type: 'format', name: 'maxCost', matcher: /[0-9]/, message: "Enter a valid value" },
            { type: 'format', name: 'minCost', matcher: /[0-9]/, message: "Enter a valid value" },
            { type: 'format', name: 'maxDistance', matcher: /[0-9]/, message: "Enter a valid value" }
        ]
    }
})