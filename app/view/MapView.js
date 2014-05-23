/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.MapView', {
    extend: 'Ext.Container',

    xtype: 'mapview',

    config: {
        layout: 'card',

        currentSearch:null,
        
        cls:'map-view',
        store: null,
        items: [
            {
              xtype:'locationmap'
            },
            {
                xtype: 'listview'
            }
                
            ]
    },
    

    /**
     * Initialize
     * @method
    */
    initialize: function () {

        this.addToolBar();
        
        this.callParent();

        var store = Ext.create('EasyTreatyApp.store.Location');
        this.setStore(store);
        this.down('locationmap').setStore(store);

        this.down('listview').setListStore(store);

        store.on({
            locationadded: this.onLocationAddition,
            storecleared: this.onStoreClear,
            scope: this
        });
    },
    
    onLocationAddition: function () {
        console.log("map view onloactionaddition");
        this.down('locationmap').onLocationAddition();
        this.down('listview').fillList();

    },

    onStoreClear: function(){
        this.down('locationmap').onStoreClear();
    },

    /**
     * Add the two toolbars 
     * @method
     * @private
    */
    addToolBar: function() {
        var me = this;

        var toolbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            items: [
                {
                    iconCls: 'list',
                    handler: function() {
                        me.fireEvent('showmenu');
                    }
                },
                {
                    xtype: 'button',
                    text: 'Done',
                    docked: 'right',
                    hidden: 'true'
                },
                {
                    xtype: 'button',
                    text: 'List',
                    docked: 'right',
                    handler: function () {
                        switch (me.indexOf(me.getActiveItem())) {
                            case 0: me.setActiveItem(1);
                                this.setText('Map');
                                break;

                            case 1: me.setActiveItem(0);
                                this.setText('List');
                                break;
                        }
                        
                    }
                }
                 
                
            ]
        });

       // toolbar.setTitle(this.getToolbarTitle());

        this.add(toolbar);

        toolbar.getComponent(1).on('tap', function () {
            me.selectionDone();
        });
        
        var bottomBar = Ext.create('Ext.Toolbar', {
            docked: 'bottom',
            scrollable:'horizontal',
            items: [
                {
                    iconCls:'search'
                },
                {
                    text:'Medical Centers',
                    iconCls: 'home',
                    handler: function () {
                        console.log("home");
                        me.setCurrentSearch(0);
                        me.fireEvent('choicedone', 0);
                    }
                },
                {
                    text: 'Doctors',
                    iconCls: 'user',
                    handler: function () {
                        console.log("user");
                        me.setCurrentSearch(1);
                        me.fireEvent('choicedone', 1);
                    }
                },
                {
                    text: 'Pharmacies',
                    iconCls: 'add',
                    handler: function () {
                        me.setCurrentSearch(2);
                        me.fireEvent('choicedone', 2);
                    }
                }

            ]
        });

        this.add(bottomBar);
        

    },
    

    changeBaseLocationToSearch: function () {

        this.down('locationmap').changeBaseLocation();
        this.toggleDoneButton();
    },
 
    
    /**
     * Toggles the visibility of the Done button
     * @method
     * @private
     * @param Boolean visibility
     */
    toggleDoneButton: function(visibility) {
        var doneButton = this.getDoneButton();

        doneButton.setHidden(visibility);
    },
    

    /**
     * Returns the top tool bar
     * @method
     * @return {Toolbar}
    */
    getTopToolBar: function () {
        return this.down('toolbar');
    },
    

    /**
     * Returns the Done button
     * @method
     * @return {Button}
    */
    getDoneButton: function() {
        return this.getTopToolBar().getComponent(1);
    },


    /**
     * Returns the MapPanel
     * @method
     * @return {MapPanel}
    */
    getLocationMap: function () {
        return this.down('locationmap');
    },
 
    

    /**
     * Returns the Menu
     * @method
     * @return {Menu}
    */
    getMenu: function () {
        return this.down('mainmenu');
    },

    /**
       * Calls selectionDone() of the item MapPanel, toogles Done button and refresh
       * @method
       * @private
       * @param [{Object}] records
       * @return [{Object}] data
       */
    selectionDone: function () {

        this.down('locationmap').selectionDone();

        this.toggleDoneButton(true);

        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        }

    }
})