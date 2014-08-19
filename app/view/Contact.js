/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.Contact', {
    extend: 'Ext.dataview.component.DataItem',
    xtype: 'contact',
    config: {
        cls:'contactitem',
        padding: 0,
        width: '100%',
        style:'border-bottom:1px solid lightgray',
        layout: {
            type: 'fit'
        },
        defaults: {
            margin: 0,
            padding:0
        },

        items: {
                      xtype: 'checkboxfield',
                      labelAlign: 'right',
                      labelWidth: '80%',
                      width: '100%',
                      checked: false

               }
    },
    updateRecord: function(record) {
        var me = this;
        var valueObject;
        var checkField = me.down('checkboxfield');

        if (checkField != null) {

             checkField.setLabel(record.get('displayName'));

            valueObject = { name: record.get('displayName'), emails: record.get('emails'), phoneNumbers: record.get('phoneNumbers') };

            checkField.setValue(Ext.JSON.encode(valueObject));
            

        }
            
        me.callParent(arguments);
    }


});