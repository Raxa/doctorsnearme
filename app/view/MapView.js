/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.MapView', {
    extend: 'Ext.Container',

    xtype: 'mapview',

    config: {
        layout: 'card',
        
        /**
         * cfg {Store} locStore To store locations data 
         */
        locStore: null,
        
        /**
         * cfg {Store} docStore To store doctors' data 
         */
        docStore: null,
        
        /**
         * cfg {Store} pharmacyStore To store pharmacies' data 
         */
        pharmacyStore: null,
        
        /**
         * cfg {Integer} currentSearch 
         * 0 if current search is medical centers
         * 1 if current search is doctors
         * 2 if current search is pharmacies
         */
        currentSearch: null,
        
        /**
         * cfg {Object} filter values for the current search 
         */
        filterValues: null,
        
        cls:'map-view',
        
            items:[ {
                        xtype:'mappanel'
                    },
                    {
                        xtype: 'mainmenu'
                    }
                
            ]
    },
    

    /**
     * Initialize
     * @method
    */
    initialize: function () {
        this.setFilterValues({ noOfResults: 'All' });

        this.addToolBar();

        this.setAllStores();
        
        this.callParent();
    },
    

    /**
     * Create the three stores and set stores
     * @method
     * @private
    */
    setAllStores: function() {
        var locStore = Ext.create('EasyTreatyApp.store.Location', {
            model: "EasyTreatyApp.model.Location",
        });

        this.setLocStore(locStore);

        var docStore = Ext.create('EasyTreatyApp.store.Doctor', {
            model: "EasyTreatyApp.model.Doctor",
        });

        this.setDocStore(docStore);

        var pharStore = Ext.create('EasyTreatyApp.store.Pharmacy', {
            model: "EasyTreatyApp.model.Pharmacy",
        });

        this.setPharmacyStore(pharStore);

        this.getLocStore().on({
            load: this.onStoreLoad,
            scope: this
        });

        this.getDocStore().on({
            load: this.onStoreLoad,
            scope: this
        });

        this.getPharmacyStore().on({
            load: this.onStoreLoad,
            scope: this
        });
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
                        me.getMenu().toggle();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Done',
                    docked: 'right',
                    hidden: 'true'
                }
                 
                
            ]
        });

        toolbar.setTitle(this.getToolbarTitle());

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
                        me.fireEvent('choicedone', 0);
                    }
                },
                {
                    text: 'Doctors',
                    iconCls: 'user',
                    handler: function () {
                        console.log("user");
                        me.fireEvent('choicedone', 1);
                    }
                },
                {
                    text: 'Pharmacies',
                    iconCls: 'add',
                    handler: function () {
                        me.fireEvent('choicedone', 2);
                    }
                }

            ]
        });

        this.add(bottomBar);
        

    },
    

    /**
     * Get the title for the tool bar according to the current search
     * @method
     * @private
     * @return {String}
     */
    getToolbarTitle: function() {
        var currentSearch = this.getCurrentSearch();
        
        switch(currentSearch) {
            case 0:
                return 'Medical Centers';
            case 1:
                return 'Doctors';
            case 2:
                return 'Pharmacies';
            default :
                return 'nothing';
        }
    },
    

    /**
     * Executed at store load
     * @method
     * @private
     * @param {Store} store
     */
    onStoreLoad: function (store) {
        console.log("map view on store load");
        
        var records = store.getRange();
        var locations = this.extractData(records);

        var finalArray = this.filter(locations);

        console.log("final");
        this.createOrClearMap(finalArray);

        console.log(finalArray);
        
        this.setMasked(false);
    },
    

    /**
     * Filter the locations according to current filter values
     * @method
     * @private
     * @param [{Object}] locations
     * @return [{Object}]
     */
    filter: function(locations) {
        var mapPanel = this.down('mappanel');

        var relativePosition = mapPanel.getRelativeLocation();

        console.log("relative location");
        console.log(relativePosition.lat() + " " + relativePosition.lng());

        Ext.Array.forEach(locations, function(location) {
            location.distance = EasyTreatyApp.math.distanceCalculator(relativePosition.lat(), relativePosition.lng(), location.latitude, location.longitude, 'K');
        });

        var sorted = EasyTreatyApp.math.mergeSort(locations);


        if (this.getFilterValues().noOfResults != 'All') {
            var parsed = parseInt(this.getFilterValues().noOfResults);
        } else {
            parsed = 1000000;
        }

        var filtered = EasyTreatyApp.math.lengthFilter(sorted, parsed + 1);
        
        if (this.getFilterValues().maxDistance != null) {
            var finalArray = EasyTreatyApp.math.valueFilter(filtered,this.getFilterValues().maxDistance);
            return finalArray;
        } else {
            return filtered;
        }
        

    },
    

    /**
     * Extracts data from records
     * @method
     * @private
     * @param [{Object}] records
     * @return [{Object}] data
     */
    extractData: function (records) {
        var data = [];
        Ext.each(records, function (record, index) {
            data.push(record.data);
        }, this);
        return data;
    },


    /**
     * Calls createOrClearMap() method of the item MapPanel
     * @method
     * @public
     * @param [{Object}] locations
     */
    createOrClearMap:function(locations) {
        var map = this.down('mappanel');
        
        map.createOrClearMap(locations);
    },
    

    /**
     * Reloads the relevant store according to current search
     * @method
     * @private
     */
    refresh: function () {

        this.setMasked({
            xtype: 'loadmask'
        });
        
        var currentSearch = this.getCurrentSearch();
        var store;
        switch (currentSearch) {
            case 0: store = this.getLocStore(); break;
            case 1: store=this.getDocStore(); break;
            case 2: store = this.getPharmacyStore(); break;
        }
        if(store!=null) {
            store.load();
        }
    },
    

    /**
     * Executed when filterValues config is updated
     * @method
     * @private
     */
    updateFilterValues: function (newValue, oldValue) {

        this.refresh();
    },
 
    
    /**
     * Toggles the visibility of the Done button
     * @method
     * @private
     * @param Boolean visibility
     */
    toggleDoneButton: function(visibility) {
        //var toolbar = this.down('toolbar');
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
    getMapPanel: function () {
        return this.down('mappanel');
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
     * Calls changeTheRelativeLocationForSearch() of the item MapPanel and toogles Done button
     * @method
     * @public
     */
    changeTheRelativeLocationForSearch: function() {

        var mapPanel = this.getMapPanel();

        mapPanel.changeTheRelativeLocationForSearch();

        this.toggleDoneButton(false);
    },


    /**
     * Calls selectionDone() of the item MapPanel, toogles Done button and refresh
     * @method
     * @private
     * @param [{Object}] records
     * @return [{Object}] data
     */
    selectionDone: function () {

        var mapPanel = this.getMapPanel();

        mapPanel.selectionDone();

        this.toggleDoneButton(true);

        this.refresh();



    }

})