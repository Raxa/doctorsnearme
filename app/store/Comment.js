Ext.define('EasyTreatyApp.store.Comment', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Comment',
        autoLoad: false,
    },

    setTheProxy: function (locationid) {
        this.setProxy({
            type: 'ajax',
            //  url: 'http://192.168.122.1:8888/getComments',
            url:EasyTreatyApp.config.getRatingServerDomain()+'getComments',
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