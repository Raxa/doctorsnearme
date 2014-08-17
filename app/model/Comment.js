/**
 * Authored by Amaya
 */
Ext.define("DoctorsNearMe.model.Comment", {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'timestamp', type: 'date' },
            { name: 'comment', type: 'string' },
            {name:'name',type:'string'}
        ]
    }
})