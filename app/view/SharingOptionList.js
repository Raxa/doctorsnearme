Ext.define('DoctorsNearMe.view.SharingOptionsList', {
    extend: 'Ext.List',

    itemTpl:'{method}',
    data:[
        { method:'Email' }
    ]
});