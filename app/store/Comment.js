/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.store.Comment', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Comment',
        autoLoad: false
    },

    setTheProxy: function (locationid) {
        this.setProxy({
            type: 'ajax',
            url:DoctorsNearMe.config.getRatingServerDomain()+'getComments',
            extraParams: {
                location: locationid
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        });

    }

});