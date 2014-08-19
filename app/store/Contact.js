/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.store.Contact', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Contact',
        sorters: 'displayName',
        grouper: {
            groupFn: function (record) {
                return record.get('displayName').substr(0, 1);
            }
        },
        data:[]       
    },

    /**
     * Loads device contacts
     * @method
     */
    loadContacts: function () {
        var me = this;
        //Ext.Msg.alert("inside store");
        var options = new ContactFindOptions();
       // options.filter = '';        // empty search string returns all contacts
        options.multiple = true;
        options.filter = "A";
        var array=[];
        var fields = ["displayName", "phoneNumbers", "emails", "name", "id"];
        navigator.contacts.find(fields, onSuccess, onError, options);

        function onSuccess(contacts) {
            
            if (contacts.length == 0) {
                Ext.Msg.alert("nothing");
            } else {

                var i = 0;

                for (i = 0; i < contacts.length; i++) {
                    if (contacts[i].displayName != null) {
                        var record1 = Ext.create('DoctorsNearMe.model.Contact', {
                            displayName: (contacts[i].name.formatted).toString(),
                            phoneNumbers: contacts[i].phoneNumbers,
                            emails: contacts[i].emails
                        });
                        me.add(record1);
                    }
                }
                

            }

        }

        function onError(contactError) {
            Ext.Msg.alert("Couldn't retrieve contacts");
        }
    }

});