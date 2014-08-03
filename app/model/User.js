/**
 * Authored by Amaya
 */
Ext.define("DoctorsNearMe.model.User", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'age', type: 'int' },
            { name: 'display', type: 'string' },
            { name: 'firstName', type: 'string' },
            { name: 'gender', type: 'string' },
            { name: 'isPatient', type: 'boolean' },
            { name: 'lastName', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'locationAddress', type: 'auto' },
            { name: 'patientIdentifier', type: 'string' },
            { name: 'personAttributes', type: 'auto' },
            { name: 'personUuid', type: 'string' },
            { name: 'privileges', type: 'auto' },
            { name: 'raxaVersion', type: 'string' },
            { name: 'roles', type: 'auto' },
            { name: 'serverTime', type: 'string' }
        ]
    }
})