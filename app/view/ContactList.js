
Ext.define('DoctorsNearMe.view.ContactList', {
    extend: 'Ext.dataview.DataView',
    xtype:'contactlist',
    config: {
        cls:'contact-list',
        defaultType: 'contact',
        useComponents: true,
        fullScreen: true,
        scrollable: {
            direction: 'vertical'
        },
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
    },


    initialize: function () {
        this.callParent();

        this.setTheStore();
        this.addTopToolBar();

        this.addSearchBar();
        this.addBottomToolbar();

        this.addIndexbar();
    },

    setTheStore: function(){
        var contactStore = Ext.create('DoctorsNearMe.store.Contact');

        this.setStore(contactStore);

         contactStore.loadContacts();
       
       // contactStore.setData(data);

    },

    addIndexbar: function () {
        var me = this;

        var indexbar = Ext.create('Ext.dataview.IndexBar', {
            right: '5px',
            height:'100%',
            width: '5px',
            zIndex:3
        });

        indexbar.on('index', function (indexbar, html, target, eOpts) {
            me.scrollToSelectedItem(html);
        })

        this.add(indexbar);
    },

    addSearchBar: function () {

        var me = this;
        var searchBar = Ext.create('Ext.Toolbar', {

            xtype: 'toolbar',
            docked: 'top',
            cls:'search-toolbar',
            items: [
                {
                    xtype: 'searchfield',
                    placeHolder: 'Search...',
                    listeners: {
                        scope: this,
                        clearicontap: me.onSearchClearIconTap,
                        keyup: me.onSearchKeyUp
                    },
                    width:'100%'
                }
            ]

        });

        this.add(searchBar);
    },

    /**
     * Called when the search field has a keyup event.
     *
     * This will filter the store based on the fields content.
     */
    onSearchKeyUp: function(field) {
        //get the store and the value of the field
        var value = field.getValue(),
            store = this.getStore();

        //first clear any current filters on thes tore
        store.clearFilter();

        //check if a value is set first, as if it isnt we dont have to do anything
        if (value) {
            //the user could have entered spaces, so we must split them so we can loop through them all
            var searches = value.split(' '),
                regexps = [],
                i;

            //loop them all
            for (i = 0; i < searches.length; i++) {
                //if it is nothing, continue
                if (!searches[i]) continue;

                //if found, create a new regular expression which is case insenstive
                regexps.push(new RegExp(searches[i], 'i'));
            }

            //now filter the store by passing a method
            //the passed method will be called for each record in the store
            store.filter(function(record) {
                var matched = [];

                //loop through each of the regular expressions
                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i],
                        didMatch = record.get('displayName').match(search);//|| record.get('lastName').match(search);

                    //if it matched the first or last name, push it into the matches array
                    matched.push(didMatch);
                }

                //if nothing was found, return false (dont so in the store)
                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    //else true true (show in the store)
                    return matched[0];
                }
            });
        }
    },

    /**
     * Called when the user taps on the clear icon in the search field.
     * It simply removes the filter form the store
     */
    onSearchClearIconTap: function() {
        //call the clearFilter method on the store instance
        this.getStore().clearFilter();
    },

    addBottomToolbar: function () {
        var me = this;
        var bottombar = Ext.create('Ext.Toolbar', {
            docked: 'bottom'

        });

        var doneButton = Ext.create('Ext.Button', {
            text:'Done'
        });

        doneButton.on('tap', function () {
            me.fireEvent('share', me.getSelectedEmails());
        });

        var spacer = Ext.create('Ext.Spacer');

        var cancelButton = Ext.create('Ext.Button', {
            text:'Cancel'
        });

        cancelButton.on('tap', function () {
            me.fireEvent('cancel');
        })

        bottombar.add(cancelButton);
        bottombar.add(spacer);
        bottombar.add(doneButton);

        this.add(bottombar);
    },

    addTopToolBar: function () {
        var me = this;

        var topbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            title: 'Contacts',
            cls:'contacts-toptoolbar'
        });

        var selectButton = Ext.create('Ext.Button', {
            text: 'Select All',
            docked: 'right',
            cls:'select-all-button'

        });

        topbar.add(selectButton);

        selectButton.on('tap', function () {
            console.log("tapped");
            me.getViewItems().forEach(function (item) {
                item.getComponent(0).check();
            })
        });

        this.add(topbar);

    },

    scrollToSelectedItem: function (index) {
        var store = this.getStore();

        var groups = store.getGroups(String(index));

        console.log(groups);

        if (groups != undefined) {
            var first = groups.children[0].getData().id;
            console.log(first);

            var recordIndex = store.find('id', first);
            console.log(recordIndex);

            this.getScrollable().getScroller().scrollTo(0, recordIndex, true);
        }
    },

    getSelectedEmails: function () {
        var name, email, array=[],object,valueObject;
        this.getViewItems().forEach(function (item) {
            if (item.getComponent(0).getChecked()) {
                object = Ext.JSON.decode(item.getComponent(0).getValue());
                if (object.emails != null) {
                    valueObject = { name: object.name, email: object.emails[0] }
                    array.push(valueObject);
                }
                
            }
        });

        return array;
    }

    
});