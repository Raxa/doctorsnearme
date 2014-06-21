/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.MapView', {
    extend: 'Ext.Container',

    xtype: 'mapview',

    config: {
        layout: {
            type: 'card',
            animation: 'pop'
        },

        currentSearch: null,
        searchRadius: 1000,
        specialties:[],

        cls: 'map-view',
        border: 3,
        style: 'border-color: gray; border-style: solid;',

        store: null,
        
        pharmacyStore: null,
        doctorStore: null,
        hospitalStore:null,

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

        var lang = EasyTreatyApp.config.getLanguage();
        this.setLanguage(lang,lang);
    },
    
    onLocationAddition: function () {
        console.log("map view onloactionaddition");
        this.down('locationmap').onLocationAddition(this.getCurrentSearch());
        this.down('listview').fillList();

    },

    zoomMap: function (radius) {
        console.log("inside zoommap");
        map =  this.down('locationmap');
       
        var zoom=10;
        if (radius > 75000) {
            zoom = 10;
        } else if (radius > 10000) {
            zoom = 12;
        }
        else {
            zoom=15
        }

        map.setMapOptions({
            zoom: zoom,
            center: map.getBaseLocation()
        });
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
                    margin: '5 5 5 5',
                    docked:'right',
                    handler: function() {
                        me.fireEvent('showmenu');
                    }
                },
                {
                    xtype: 'button',
                   // text: 'List',
                    docked: 'right',
                    margin: '5 5 5 5',
                    handler: function () {
                        var lang = EasyTreatyApp.config.getLanguage();
                        switch (me.indexOf(me.getActiveItem())) {
                            case 0: me.setActiveItem(1);
                                this.setText(lang.MAP);
                                // me.fireEvent('togglemaplist',true);
                                //me.setLayout({
                                //    type: 'card',
                                //    animation:'slideright'
                                //})
                                break;

                            case 1: me.setActiveItem(0);
                                this.setText(lang.LIST);
                                //me.fireEvent('togglemaplist',false);
                                break;
                        }
                        
                        
                    }
                },
                {
                    iconCls: 'locate',
                    docked: 'right',
                    margin: '5 5 5 5',
                    handler: function () {
                        me.resetLocation();
                    }
                },
                {
                    xtype: 'multiselectfield',
                    // label: 'Specilty',
                    labelWidth: '45%',
                    //ui: 'mainmenu',
                    placeHolder:'Choose a Specialty',
                    autoSelect: false,
                    hidden:true
                }
                 
                
            ]
        });

       // toolbar.setTitle(this.getToolbarTitle());

        this.add(toolbar);

        this.getSpecialtySelectField().setStore(Ext.create('EasyTreatyApp.store.Specialization'));

        this.getSpecialtySelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            me.setSpecialties(newValue);
        });

        this.add({ xtype: 'toolbar', docked: 'bottom' });
       
    },

    getBottomBar: function(){
        return this.getComponent(3);
    },
    
    getSpecialtySelectField: function () {
        return this.getTopToolBar().getComponent(3);
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

    updateSearchRadius: function () {
        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        }
    },

    updateSpecialties: function(){
        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        }
    },

    updateCurrentSearch: function (newValue, oldValue) {
        this.fireEvent('choicedone', newValue);
    },

    resetLocation: function(){
        this.down('locationmap').getGeo().updateLocation();
    },

    setLanguage: function (newLang,oldLang) {
        var lang = EasyTreatyApp.config.getLanguage();

        var topBar = this.getTopToolBar();

        var listBtn = topBar.getComponent(1);
        if (listBtn.getText() == oldLang.MAP) {
            listBtn.setText(lang.MAP);
        }
        else {
            listBtn.setText(lang.LIST);
        }
    }
})