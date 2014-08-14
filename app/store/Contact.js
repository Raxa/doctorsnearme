Ext.define('DoctorsNearMe.store.Contact', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Contact',
        sorters: 'displayName',
        grouper: {
            groupFn: function (record) {
                // console.log(record.get('displayName').substr(0, 1));
                return record.get('displayName').substr(0, 1);
            }
        },
        data:[],
        //data: [
        //{
        //    id:'1',
        //    displayName: 'Thurani'
        //},
        //{
        //    id:'2',
        //    displayName: 'Hansani'
        //},
        //{
        //    id:'3',
        //    displayName: 'Devni',
        //    emails:['devni@gmail.com','devni@yahoo.com']
        //},
        //{
        //    id: '4',
        //    displayName: 'Devni'
        //},
        //{
        //    id: '5',
        //    displayName: 'Devni'
        //},
        //{
        //    id: '6',
        //    displayName: 'Devni'
        //},
        //{
        //    id: '7',
        //    displayName: 'Devni'
        //},
        //{
        //    id: '8',
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //}, {
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Amaya',
        //    emails:['amaya.uom@gmail.com']
        //},
        //{
        //    displayName: 'Akila'
        //},
        //{
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //},
        //{
        //    displayName: 'Devni'
        //}
        //],
    },

   /* loadContacts: function () {
        var data = [{
            id: '1',
            displayName: 'Thurani'
        },
          {
              id: '2',
              displayName: 'Hansani'
          },
          {
              id: '3',
              displayName: 'Devni',
              emails: ['devni@gmail.com', 'devni@yahoo.com']
          },
          {
              id: '4',
              displayName: 'Devni'
          },
          {
              id: '5',
              displayName: 'Devni'
          },
          {
              id: '6',
              displayName: 'Devni'
          },
          {
              id: '7',
              displayName: 'Devni'
          },
          {
              id: '8',
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          }, {
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          },
          {
              displayName: 'Amaya',
              emails: ['amaya.uom@gmail.com']
          },
          {
              displayName: 'Akila'
          },
          {
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          },
          {
              displayName: 'Devni'
          }];
        var me = this;
        Ext.Function.defer(function () {
            me.setData(data);
        }, 5000);
     // this.setData(data);
    }*/
    loadContacts: function (dataview) {
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
                            //id: contacts[i].id,
                            displayName: String(contacts[i].name.formatted),
                            // displayName: i+"Amaya",
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

        //navigator.contacts.pickContact(function (contact) {
        //    Ext.Msg.alert(contact.name.formatted);

        //}, function (err) {
        //    console.log('Error: ' + err);
        //});

    }

});