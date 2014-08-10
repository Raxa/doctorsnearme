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

    /*loadContacts: function () {
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
                //Ext.Msg.alert(contacts[20].id);
                //me.setData(contacts);

                //Ext.Array.forEach(contacts,function(contact){
                //    array.push({ id: contact.id });
                //    array.push(contact.id);

                //    var record = Ext.create('DoctorsNearMe.model.Contact');
                //    record.set('id', contact.id);
                //    record.set('displayName', contact.displayName);
                //    record.set('emails', contact.emails);
                //    record.set('phoneNumbers', contact.phoneNumbers);

                //    me.add(record);

                //    i++;
                //});
                // Ext.Msg.alert(array.length);
               

               // Ext.Msg.alert(array.join(','));

                //Ext.Msg.alert(me.getAllCount());
                //alert(me.getAllCount());


              /*  var record1 = Ext.create('DoctorsNearMe.model.Contact', {
                    id: contacts[0].id,
                    displayName: contacts[0].displayName,
                    phoneNumbers:contacts[0].phoneNumbers,
                    emails:contacts[0].emails
                });
                   
                me.add(record1);

                    record1 = Ext.create('DoctorsNearMe.model.Contact', {
                        id: '2',
                        displayName: 'Amaya',
                        phoneNumbers: ['0718010490','1111676868'],
                        emails: ['amaya.uom@gmail.com']
                    });

                    me.add(record1);*/

                var i = 0;

                for (i = 0; i < contacts.length; i++) {
                    var record1 = Ext.create('DoctorsNearMe.model.Contact', {
                        id: contacts[i].id,
                        displayName: contacts[i].displayName,
                        phoneNumbers: contacts[i].phoneNumbers,
                        emails: contacts[i].emails
                    });

                    me.add(record1);
                }


               // Ext.Msg.alert("TEST");
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