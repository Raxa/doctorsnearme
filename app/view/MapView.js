/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.MapView', {
    extend: 'Ext.Container',

    xtype: 'mapview',

    config: {
        layout: 'card',

        currentSearch: null,
        searchRadius: 1000,
        specialties:[],

        cls:'map-view',
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

    zoomMap: function () {
        console.log("inside zoommap");
        map =  this.down('locationmap');
        map.setMapOptions({
            zoom: 10,
            center:map.getBaseLocation()
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
                    handler: function() {
                        me.fireEvent('showmenu');
                    }
                },
                {
                    xtype: 'button',
                   // text: 'List',
                    docked: 'right',
                    handler: function () {
                        var lang = EasyTreatyApp.config.getLanguage();
                        switch (me.indexOf(me.getActiveItem())) {
                            case 0: me.setActiveItem(1);
                                this.setText(lang.MAP);
                                me.fireEvent('togglemaplist',true);
                                break;

                            case 1: me.setActiveItem(0);
                                this.setText(lang.LIST);
                                me.fireEvent('togglemaplist',false);
                                break;
                        }
                        
                        
                    }
                },
                {
                    iconCls: 'locate',
                    docked:'right',
                    handler: function () {
                        me.resetLocation();
                    }
                }
                 
                
            ]
        });

       // toolbar.setTitle(this.getToolbarTitle());

        this.add(toolbar);
        
        var bottomBar = Ext.create('Ext.Toolbar', {
            docked: 'bottom',
            //docked: 'right',
            scrollable:'horizontal',
            items: [
                {
                    iconCls: 'favorites',
                    handler: function () {
                        me.fireEvent('showfavorites');
                    }
                },
                {
                  //  text: 'Medical Centers',
                    iconCls: 'home',
                    handler: function () {
                        console.log("home");
                        me.setCurrentSearch(0);
                        me.fireEvent('choicedone', 0);
                    }
                },
                {
                  //  text: 'Doctors',
                    iconCls: 'user',
                    handler: function () {
                        console.log("user");
                        me.setCurrentSearch(1);
                        me.fireEvent('choicedone', 1);
                    }
                },
                {
                  //  text: 'Pharmacies',
                    iconCls: 'add',
                    handler: function () {
                        me.setCurrentSearch(2);
                        me.fireEvent('choicedone', 2);
                    }
                }

            ]
        });

        this.add(bottomBar);
        
        bottomBar.getComponent(1).on('check', function () {
            me.setCurrentSearch(0);
        });

        bottomBar.getComponent(2).on('check', function () {
            me.setCurrentSearch(1);
        });

        bottomBar.getComponent(3).on('check', function () {
            me.setCurrentSearch(2);
        });
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

        var bottomBar = this.getComponent(3);

        bottomBar.getComponent(1).setText(lang.MEDICAL_CENTERS);
        bottomBar.getComponent(2).setText(lang.DOCTORS);
        bottomBar.getComponent(3).setText(lang.PHARMACIES);
    }
})