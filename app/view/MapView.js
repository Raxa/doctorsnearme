/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.MapView', {
    extend: 'Ext.Container',
    requires:['Ext.data.Store'],
    xtype: 'mapview',

    config: {
        layout: {
            type: 'card',
            animation: 'pop'
        },

        /**
         * cfg {Integer} the current search selected by the user 
         */
        currentSearch: null,

        /**
         * cfg {Integer} search radius 
         */
        searchRadius: null,
        
        /**
         * cfg [String] Specialties chosen for current search 
         */
        specialties: null,


        border: 3,
        style: 'border-color: gray; border-style: solid;',

        /**
         * cfg {Store} store To store locations data from google places
         */
        store: null,        

        items: [
            {
              xtype:'locationmap'
            },
            {
                xtype: 'listview',
                data:[]
            }                
            ]
    },
    

    /**
     * Initialize
     * @method
    */
    initialize: function () {

        this.addSpecialtyMenu();
        this.addSearchBox();
        this.addLocator();

        this.callParent();
        
        var me = this;
        var store = Ext.create('EasyTreatyApp.store.Location');
        this.setStore(store);
        this.down('locationmap').setStore(store);

        //store to put favorites when they are needed to be shown in list view once Saved button clicked
        var favoriteStore = Ext.create('Ext.data.Store', { model: 'EasyTreatyApp.model.Location' });

        //set the favorites store as the store for the list view
        this.down('listview').setListStore(favoriteStore);

        //events for the locations store
        store.on({
            //this is fired when a location is added to store
            locationadded: this.onLocationAddition,

            //this is fired when the store is emptied. fired in location store class
            storecleared: this.onStoreClear,

            //this is fired when details are set to a given record. 
            detailsset: this.onDetailsSet,
            scope: this
        });

        //set the google places service to the locations store
        store.setService(new google.maps.places.PlacesService(this.down('locationmap').getMap()));

        //create openmrs store
        var raxaDoctorStore = Ext.create('EasyTreatyApp.store.OpenmrsLocation');

        //set handler for the load event
        raxaDoctorStore.on('load', function (store) {
            console.log("raxa doctors loaded");
            console.log(store.getRange());
        });

        //set the language
        var lang = EasyTreatyApp.config.getLanguage();
        this.setLanguage(lang, lang);

    },

    /**
     * This is used only in such a case that data for a given record is not set due to a OVER_QUERY_LIMIT 
     * but user clicks on a marker so a separate request is sent for the details
     * @method
     * @private
     */
    onDetailsSet: function(record,marker){
        if (marker != null) {
            //marker will be null in case detailsseet event was fired after fetching details not for infowindow but for details view
            this.getLocationMap().setInfowindowContent(record, marker);
        } else {
            this.fireEvent('detailsreadyfordetailsview', record);
        }
    },


    /**
     * Executed when a location is added to the store
     * @method
     * @private
     */
    onLocationAddition: function () {
        this.down('locationmap').onLocationAddition(this.getCurrentSearch());
        //this.down('listview').fillList();
    },

    /**
     * Zoom the map. Called inside mapview controller when a new search 
     * @method
     * @param {Integer} radius
     * @public
     */
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

    /**
     * Called on storeclear event 
     * @method
     * @private
     */
    onStoreClear: function(){
        this.down('locationmap').onStoreClear();
    },

    /**
     * Add the specialty menu to the view and add it's handler
     * @method
     * @private
     */
    addSpecialtyMenu: function(){
        var me = this;
        var specStore = Ext.create('EasyTreatyApp.store.Specialization')
        this.add({
            xtype: 'multiselectfield',
            placeHolder: 'Choose a Specialty',
            autoSelect: false,
            hidden: false,
            width: '80%',
            left: '7%',
            top: '12%',
            style: 'border:2px solid grey;border-radius:8px;color:black;',
            store: specStore,
            cls: 'spec-cls',
            defaultTabletPickerConfig: {
                height: '100%',
                minHeight: '100%'
            },
            defaultPhonePickerConfig: {
                height: '100%',
                minHeight: '100%'
            }

        });

        var specialtyArray;

        //on a change of spacialty choice update specialties config
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

    /**
     * Add the Search box to the view and add it's listners
     * @method
     * @private
     */
    addSearchBox: function(){
        this.add({
            xtype: 'searchfield',
            label: '<div class="search-box-images"><img class="list" src="resources/icons/User_30_30.png"><img class="more" src="resources/icons/moreArrow.png"></div>',
           // label:'',
            labelAlign: 'right',
            labelWidth: '65px',
            labelCls:'searchbox-label',
            name: 'search',
            top: '3%',
            width: '85%',
            height:'30px',
            left: '5%',
            cls:'search-box',
            style: 'border:0;border-radius:8px'
        });

        var me = this;

        //listener to open the side menu
        this.addListener({
            element: 'element',
            delegate: 'img.more',
            tap: function (event, node, options, eOpts) {
                console.log("show menu");
                me.fireEvent('showmenu');
            }
        });

        //listener to perform text search
        this.addListener({
            element: 'element',
            delegate: 'img.list',
            tap: function (event, node, options, eOpts) {
                console.log("text search");
                me.fireEvent('textsearch',me.getSearchField());
            }
        })
    },

    /**
     * Add locator icon by clicking on which user can go back to his own location
     * @method
     * @private
     */
    addLocator: function(){
        var locator = Ext.create('Ext.Img', {
            src: 'resources/icons/conpass_30_30.png',
            height: 30,
            width: 30,
            top: '30%',
            right: '5%',
            id:'locator'
        });

        this.add(locator);

        var me = this;

        //handler
        locator.on('tap', function (locator, e, eOpts) {
            console.log("locator");
            me.resetLocation();
        });
    },


    /**
     * Returns the Search field
     * @method
     * @return {Ext.field.SearchView}
    */
    getSearchField:function(){
        return this.down('searchfield');
    },
    
    /**
     * Returns the Search field
     * @method
     * @return {Ext.field.SelectField}
    */
    getSpecialtySelectField: function () {
        return this.down('multiselectfield');
    },

    /**
     * Returns the image
     * @method
     * @return {Ext.Image}
    */
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

    /**
     * Called when searchRadius config is updated. 
     * @method
     * @private
     */
    updateSearchRadius: function () {
        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        } else {
            this.fireEvent('choicedone', 0);
        }
    },

    /**
     * Called when specialties config is updated. 
     * @method
     * @private
     */
    updateSpecialties: function(){
        var currentSearch = this.getCurrentSearch();

        if (currentSearch != null) {
            this.fireEvent('choicedone', currentSearch);
        } else {
            this.fireEvent('choicedone', 0);
        }
    },

    /**
     * Called when currentSearch config is updated. 
     * @method
     * @private
     */
    updateCurrentSearch: function (newValue, oldValue) {
        this.fireEvent('choicedone', newValue);
    },

    /**
     * Called when user clicks on locator to reset his location 
     * @method
     * @private
     */
    resetLocation: function () {
        this.down('locationmap').getGeo().updateLocation();
    },

    /**
     * Set language 
     * @method
     * @public
     */
    setLanguage: function (newLang,oldLang) {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getSpecialtySelectField().setPlaceHolder(lang.CHOOSE_SPECIALTY);

    }
})