/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.ContactList', {
    extend: 'Ext.dataview.DataView',
    xtype:'contactlist',
    config: {
        cls:'contact-list',
        defaultType: 'contact',

        //this is a dataview with checkbox components
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

        /**
         * cfg {String} sharing option of user
         */
        activeType:null
    },


    initialize: function () {
       
        this.setTheStore();
        this.addTopToolBar();

        this.addSearchBar();
        this.addBottomToolbar();

        this.addIndexbar();
        this.callParent();
        this.setLanguage();
    },

    setTheStore: function(){
        var contactStore = Ext.create('DoctorsNearMe.store.Contact');

        this.setStore(contactStore);

        //load contacts from device
         contactStore.loadContacts();       

    },

    /*
    * Adds indexbar
    * @method
    * @private
    */
    addIndexbar: function () {
        var me = this;

        //index bar was put inside a panel because otherwise when touching an index items get selected
        var panel = Ext.create('Ext.Panel', {
            layout: 'fit',
            width: '20px',
            height: '100%',
            right:'5px'
        });

        var indexbar = Ext.create('Ext.dataview.IndexBar', {
            height: '100%',
            width:'100%',
            zIndex: 3
        });

        indexbar.on('index', function (indexbar, html, target, eOpts) {
            me.scrollToSelectedItem(html);
        })

        panel.add(indexbar)
        this.add(panel);
    },

    /*
    * Adds searchbar
    * @method
    * @private
    */
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
                        clearicontap: me.onSearchClearIconTap
                    },
                    width:'100%'
                }
            ]

        });

        this.add(searchBar);
        var searchField = searchBar.getComponent(0);
        var task = Ext.create('Ext.util.DelayedTask', function () {
            me.onSearchKeyUp(searchField);
        });

        searchField.on('keyup', function () {
            task.delay(500);
        })
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
        //first clear any current filters on the store
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

    /*
    * Adds the tool bar at bottom
    * @method
    * @private
    */
    addBottomToolbar: function () {
        var me = this;
        var bottombar = Ext.create('Ext.Toolbar', {
            docked: 'bottom'

        });

        var doneButton = Ext.create('Ext.Button', {
            text:'Done'
        });

        doneButton.on('tap', function () {
            var activeType = me.getActiveType();
            switch (activeType) {
                case 'E': me.fireEvent('shareviaemail', me.getSelectedEmails());
                    break;
                case 'M': me.fireEvent('shareviamessage', me.getSelectedPhoneNumbers());
                    break;
            }
            me.getViewItems().forEach(function (item) {
                item.getComponent(0).uncheck();
            })
            
        });

        var spacer = Ext.create('Ext.Spacer');

        var cancelButton = Ext.create('Ext.Button', {
            text:'Cancel'
        });

        cancelButton.on('tap', function () {
            me.fireEvent('cancel');
            me.getViewItems().forEach(function (item) {
                item.getComponent(0).uncheck();
            })
        })

        bottombar.add(cancelButton);
        bottombar.add(spacer);
        bottombar.add(doneButton);

        this.add(bottombar);
    },

    /*
    * Adds top tool bar
    * @method
    * @private
    */
    addTopToolBar: function () {
        var me = this;

        var topbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            title: 'My Contacts',
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

    getTopToolbar: function(){
        return this.getComponent(0);
    },

    getSearchBar: function(){
        return this.getComponent(1).getComponent(0);
    },

    getSelectAllButton: function(){
        return this.getTopToolbar().down('button');
    },

    getBottomToolbar: function(){
        return this.getComponent(2);
    },

    getDoneButton: function(){
        return this.getBottomToolbar().getComponent(2);
    },

    getCancelButton: function(){
        return this.getBottomToolbar().getComponent(0)
    },

    /*
    * When an index is tapped on index bar scrolls to the first item which has the index
    * @method
    * @private
    */
    scrollToSelectedItem: function (index) {
        var store = this.getStore();

        var groups = store.getGroups(String(index));

        console.log(groups);


        if (groups != undefined) {
            var first = groups.children[0].getData().id;
            console.log(first);

            var recordIndex = store.find('id', first);

            //had to do this way because there was no other easy way for a dataview unlike a list
            //get Y coordinate
            var y = this.getViewItems()[recordIndex].element.getY();

            //scroll to Y coordinate
            this.getScrollable().getScroller().scrollTo(0, y, true);
            
        }
    },

    /*
    * Returns the email addresses and names of selected contacts
    * @method
    * @private
    * @return [Object]
    */
    getSelectedEmails: function () {
        var name, email, array=[],object,valueObject;
        this.getViewItems().forEach(function (item) {
            if (item.getComponent(0).getChecked()) {
                object = Ext.JSON.decode(item.getComponent(0).getValue());
                if (object.emails != null) {
                    valueObject = { name: object.name, email: object.emails[0].value }
                    array.push(valueObject);
                }
                
            }
        });

        return array;
    },

    /*
    * Returns the phone numbers of selected contacts
    * @method
    * @private
    * @return [String]
    */
    getSelectedPhoneNumbers: function () {
        var name, phoneNo, array = [], object, valueObject;
        this.getViewItems().forEach(function (item) {
            if (item.getComponent(0).getChecked()) {
                object = Ext.JSON.decode(item.getComponent(0).getValue());
                if (object.phoneNumbers != null) {
                    array.push(String(object.phoneNumbers[0].value));
                }

            }
        });

        return array;
    },

    /*
    * Sets language
    * @method
    * @public
    */
    setLanguage: function () {
        var lang = DoctorsNearMe.config.getLanguage();

        this.getTopToolbar().setTitle(lang.CONTACTS);
        this.getSelectAllButton().setText(lang.SELECT_ALL);
        this.getDoneButton().setText(lang.DONE);
        this.getCancelButton().setText(lang.SIMPLE_CANCEL);
        this.getSearchBar().setPlaceHolder(lang.SEARCH);
    }

    
});