/**
 * Authored by Amaya
 */

Ext.define('DoctorsNearMe.view.ContactContainer', {
    extend: 'Ext.Container',

    layout: 'fit',
    cls:'contact-panel',
   

    initialize: function () {
        this.callParent();


    },

    addList: function () {
        var me = this;
        var searchBar = Ext.create('Ext.Toolbar', {

            xtype: 'toolbar',
            docked: 'top',

            items: [
                { xtype: 'spacer' },
                {
                    xtype: 'searchfield',
                    placeHolder: 'Search...',
                    listeners: {
                        scope: this,
                        clearicontap: me.onSearchClearIconTap,
                        keyup: me.onSearchKeyUp
                    }
                },
                { xtype: 'spacer' }
            ]

        });

        var list = Ext.create('Ext.List', {
            ui: 'round',

            pinHeaders: false,

            //itemTpl defines the template for each item in the list
            itemTpl: '<div class="contact">{displayName}<span class="check"></span></div>',

            //give it a link to the store instance
            store: null,


            grouped: true,
            emptyText: '<div style="margin-top: 20px; text-align: center">No Matching Items</div>',
            disableSelection: false,
        });

        list.add(searchBar);

        var contactsStore = Ext.create('DoctorsNearMe.store.Contact');

        contactsStore.loadContacts();

        list.setStore(contactsStore);

    }

});