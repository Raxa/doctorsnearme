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
                     // label:'{id}'

               }
    },
    updateRecord: function(record) {
        var me = this;
        var valueObject;
        var checkField = me.down('checkboxfield');

        if (checkField != null) {

            //if (record.get('emails') != null && record.get('phoneNumbers') != null) {
            //    checkField.setLabel(record.get('displayName') + '</br>' + '<span class="contact-email">' + record.get('emails')[0].value +  record.get('phoneNumbers')[0].value + '</span>');
            //} else if (record.get('emails') != null) {
            //    checkField.setLabel(record.get('displayName') + '</br>' + '<span class="contact-email">' + record.get('emails')[0].value + '</span>' + '<span class="contact-email">');
            //}
            //else if(record.get('phoneNumbers') != null){
            //    checkField.setLabel(record.get('displayName') + '</br>' +'<span class="contact-email">' + record.get('phoneNumbers')[0].value + '</span>');
            //}
            //else {
                checkField.setLabel(record.get('displayName'));
            //}
           // checkField.setLabel(record.get('id') + " " + record.get('displayName'));

            valueObject = { name: record.get('displayName'), emails: record.get('emails'), phoneNumbers: record.get('phoneNumbers') };

            checkField.setValue(Ext.JSON.encode(valueObject));
            

        }
            
        me.callParent(arguments);
    }


});