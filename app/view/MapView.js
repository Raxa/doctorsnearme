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

        // currentSearch: null,
        currentSearch: null,
        searchRadius: null,
        //specialties:[],
        specialties: null,
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

      //  this.addItems();
        this.callParent();
        

        var store = Ext.create('EasyTreatyApp.store.Location');
        this.setStore(store);
        this.down('locationmap').setStore(store);

        this.down('listview').setListStore(store);

        store.on({
            locationadded: this.onLocationAddition,
            storecleared: this.onStoreClear,
            detailsset: this.onDetailsSet,
            scope: this
        });
        //test
        store.setService(new google.maps.places.PlacesService(this.down('locationmap').getMap()));

        var lang = EasyTreatyApp.config.getLanguage();
        this.setLanguage(lang, lang);

        //to search soon at startup
      //  this.setCurrentSearch(0);
    },

    //addItems: function(){
    //    this.add({
    //        xtype: 'locationmap'
    //    });

    //    this.add({
    //        xtype: 'listview'
    //    });
    //},
    onDetailsSet: function(record,marker){
        // this.fireEvent('detailsset',record);
        this.getLocationMap().setInfowindowContent(record, marker);
    },

    onLocationAddition: function () {
        this.down('locationmap').onLocationAddition(this.getCurrentSearch());
        this.down('listview').fillList();

    },

    zoomMap: function (radius) {
        

        var map = this.down('locationmap');
       
        var zoom=15;
        

        if (radius < 5000) {
            zoom = 15;
        }
        else if (radius < 2000) {
            zoom = 14;
        }
        else if (radius < 50000) {
            zoom = 13;
        }
        else {
            zoom = 12;
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
        var me = this;
        var specStore = Ext.create('EasyTreatyApp.store.Specialization')
        this.add({
            xtype: 'multiselectfield',
            // label: 'Specilty',
            //  labelWidth: '45%',
            placeHolder: 'Choose a Specialty',
            autoSelect: false,
            hidden: false,
            width: '80%',
            left: '5%',
            top: '20%',
            style: 'border:2px solid grey;border-radius:8px;color:black;',
            store: specStore,
            cls: 'spec-cls'

        });

        var specialtyArray;
        this.getSpecialtySelectField().on('change', function (selectField, newValue, oldValue, eOpts) {

            specialtyArray = [];
            Ext.Array.forEach(newValue, function (itemArray) {
                Ext.Array.forEach(itemArray, function (keyword) {
                    specialtyArray.push(keyword);
                });
            });

            me.setSpecialties(specialtyArray);

        });
    },

    addSearchBox: function(){
        this.add({
            xtype: 'searchfield',
            label: '<div><img class="list" src="resources/icons/User_30_30.png"><img class="more" src="resources/icons/moreArrow.png"></div>',
            labelAlign: 'right',
            // labelWidth:'10%',
            labelWidth: '65px',
            name: 'search',
            top: '3%',
            width: '85%',
            height:'30px',
            left: '5%',
            cls:'search-box',
            style: 'border:0;border-radius:8px'
        });

        var me = this;
        this.addListener({
            element: 'element',
            delegate: 'img.more',
            tap: function (event, node, options, eOpts) {
                console.log("show menu");
                me.fireEvent('showmenu');
            }
        });

        this.addListener({
            element: 'element',
            delegate: 'img.list',
            tap: function (event, node, options, eOpts) {
                console.log("text search");
                me.fireEvent('textsearch',me.getSearchField());
            }
        })
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



    getSearchField:function(){
        return this.down('searchfield');
    },
    
    getSpecialtySelectField: function () {
        // return this.getTopToolBar().getComponent(3);
        //return this.getTopToolBar().getComponent(1);
        // return this.getComponent(2);
        return this.down('multiselectfield');
    },

    getLocator: function(){
        return this.down('image');
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
        } else {
            this.fireEvent('choicedone', 0);
        }
    },

    updateSpecialties: function(){
        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        } else {
            this.fireEvent('choicedone', 0);
        }
    },

    updateCurrentSearch: function (newValue, oldValue) {
        this.fireEvent('choicedone', newValue);
    },

    resetLocation: function () {
        this.down('locationmap').getGeo().updateLocation();
    },

    setLanguage: function (newLang,oldLang) {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getSpecialtySelectField().setPlaceHolder(lang.CHOOSE_SPECIALTY);

    }
})