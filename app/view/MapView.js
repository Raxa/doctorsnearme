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

        //this.addToolBar();
        this.addSpecialtyMenu();
        this.addSearchBox();
        this.addLocator();

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
        //test
        store.setService(new google.maps.places.PlacesService(this.down('locationmap').getMap()));

        var lang = EasyTreatyApp.config.getLanguage();
        this.setLanguage(lang, lang);

        //to search soon at startup
        this.setCurrentSearch(0);
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

    addSpecialtyMenu: function(){

        var specStore = Ext.create('EasyTreatyApp.store.Specialization')
        this.add({
            xtype: 'multiselectfield',
            // label: 'Specilty',
            //  labelWidth: '45%',
            placeHolder: 'Choose a Specialty',
            autoSelect: false,
            hidden: false,
            width: '90%',
            left: '5%',
            top: '20%',
            style: 'border-color: gray; border-style:2px solid;border-radius:8px;',
            store: specStore

        });

        var specialtyArray;
        this.getSpecialtySelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            console.log("spec change");
            console.log(newValue.length);
            console.log(newValue);
            specialtyArray = [];
            Ext.Array.forEach(newValue, function (itemArray) {
                Ext.Array.forEach(itemArray, function (keyword) {
                    specialtyArray.push(keyword);
                });
            });

            me.setSpecialties(specialtyArray);
            console.log(specialtyArray);
        });
    },

    addSearchBox: function(){
        this.add({
            xtype: 'searchfield',
            label: '<img class="list" src="resources/icons/User_30_30.png">',
            labelAlign: 'right',
            labelWidth:'5%',
            name: 'search',
            top: '3%',
            width: '90%',
            height:'40px',
            left: '5%',
            style: 'border-radius:8px'
        });

        var me = this;
        this.addListener({
            element: 'element',
            delegate: 'img.list',
            tap: function (event, node, options, eOpts) {
                console.log("show menu");
                me.fireEvent('showmenu');
            }
        });
    },

    addLocator: function(){
        var locator = Ext.create('Ext.Img', {
            src: 'resources/icons/conpass_30_30.png',
            height: 30,
            width: 30,
            top: '40%',
            right: '5%',
            id:'locator'
        });

        this.add(locator);

        var me = this; 
        locator.on('tap', function (locator, e, eOpts) {
            console.log("locator");
            me.resetLocation();
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
                    margin: '5 5 5 5',
                    docked:'right',
                    handler: function() {
                        me.fireEvent('showmenu');
                    }
                }
                 
                
            ]
        });

       // toolbar.setTitle(this.getToolbarTitle());

        this.add(toolbar);

        this.getSpecialtySelectField().setStore(Ext.create('EasyTreatyApp.store.Specialization'));

        var specialtyArray;
        this.getSpecialtySelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            console.log("spec change");
            console.log(newValue.length);
            console.log(newValue);
            specialtyArray = [];
            Ext.Array.forEach(newValue, function (itemArray) {
                Ext.Array.forEach(itemArray, function (keyword) {
                    specialtyArray.push(keyword);
                });
            });
            
            me.setSpecialties(specialtyArray);
            console.log(specialtyArray);
        });

        var bottombar = Ext.create('Ext.Toolbar', {
            docked: 'bottom',
           // cls: 'toolbar-style',
            items: [{
                xtype: 'button',
                docked: 'right',
                margin: '15 5 5 5',
                handler: function () {
                    var lang = EasyTreatyApp.config.getLanguage();
                    switch (me.indexOf(me.getActiveItem())) {
                        case 0: me.setActiveItem(1);
                            this.setText(lang.MAP);
                            break;

                        case 1: me.setActiveItem(0);
                            this.setText(lang.LIST);
                            break;
                    }


                }
            },
                {
                    iconCls: 'locate',
                    docked: 'left',
                    margin: '15 5 5 5',
                    handler: function () {
                        me.resetLocation();
                    },

                },
            {
                iconCls: 'favorites',
                margin: '10 5 5 5',
            handler: function () {
                me.fireEvent('showfavorites');
            }
        },]
        });
        this.add(bottombar);
       
    },

    getBottomBar: function(){
        return this.getComponent(3);
    },

    getSearchField:function(){
        return this.down('searchfield');
    },
    
    getSpecialtySelectField: function () {
        // return this.getTopToolBar().getComponent(3);
        //return this.getTopToolBar().getComponent(1);
        // return this.getComponent(2);
        return this.down('multiselectfield');
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

    resetLocation: function () {
        console.log("inside reset");
        this.down('locationmap').getGeo().updateLocation();
    },

    setLanguage: function (newLang,oldLang) {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getSpecialtySelectField().setPlaceHolder(lang.CHOOSE_SPECIALTY);

    }
})