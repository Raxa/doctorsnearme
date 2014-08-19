Ext.define('DoctorsNearMe.model.Memory', {
    extend: 'Ext.data.Model',
    config: {
        identifier:'uuid',
        fields: ['id', 'query']
    }
});