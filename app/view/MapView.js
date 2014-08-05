/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.MapView', {
    extend: 'Ext.Container',
    requires:['Ext.data.Store'],
    xtype: 'mapview',

    config: {
        cls: 'mapview',
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
        

        var store = Ext.create('DoctorsNearMe.store.Location');
        this.setStore(store);
        this.down('locationmap').setStore(store);

        //store to put favorites when they are needed to be shown in list view once Saved button clicked
        var favoriteStore = Ext.create('Ext.data.Store', { model: 'DoctorsNearMe.model.Location' });

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

        //set the language
        var lang = DoctorsNearMe.config.getLanguage();
        this.setLanguage(lang, lang);

    },

    /**
     * This is used only in such a case that data for a given record is not set due to a OVER_QUERY_LIMIT 
     * but user clicks on a marker so a separate request is sent for the details
     * @method
     * @private
     */
    onDetailsSet: function (record, marker) {
        if (marker != null) {
            //marker will be null in case detailsseet event was fired after fetching details not for infowindow but for details view
            this.getLocationMap().setInfowindowContent(record, marker);
        } else{
            this.fireEvent('detailsreadyfordetailsview',record);
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
    addSpecialtyMenu: function () {
        var me = this;
        var specStore = Ext.create('DoctorsNearMe.store.Specialization')
        this.add({
            xtype: 'multiselectfield',
            placeHolder: 'Choose a Specialty',
            autoSelect: false,
            hidden: false,
            width: '80%',
            left: '7%',
            //top: '15%',
            top: '6%',
            // style: 'border:2px solid grey;border-radius:8px;color:black;',
            //style: 'border:1px solid #0d66f2;border-radius:0;color:#0d66f2;',
            style: 'border:1px solid #0d66f2;border-radius:8px;color:white;',
            store: specStore,
            cls: 'spec-cls',
            picker:false,
            defaultTabletPickerConfig: {
                top: '50px',
                //height: '90%',
                // minHeight: '90%',
                width: '17em',
                height: '70%'

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
    addSearchBox: function () {
        //this.add({
        //    xtype: 'searchfield',
        //    label: '<div class="search-box-images"><img class="list" src="resources/icons/User_30_30.png"><img class="more" src="resources/icons/moreArrow.png"></div>',
        //    // label:'',
        //    labelAlign: 'right',
        //    labelWidth: '65px',
        //    labelCls: 'searchbox-label',
        //    name: 'search',
        //    top: '6%',
        //    width: '85%',
        //    height: '30px',
        //    left: '5%',
        //    cls: 'search-box',
        //    style: 'border:0;border-radius:8px'
        //});
        var toolbar = Ext.create('Ext.Toolbar', { docked: 'top' });

        var searchField = Ext.create('Ext.field.Search', {
            labelAlign: 'right',
            labelWidth: '65px',
            labelCls: 'searchbox-label',
            name: 'search',
            width: '80%',
            height: '90%',
            cls: 'search-box',
            style: 'border:0;border-radius:8px',
            docked: 'left',
            placeHolder: ' '
        });

        var singleLine = Ext.create('Ext.Label', {
            html: '<img class="single-line" src="resources/icons/splitOneLine.png">',
            hidden: true,
            docked:'right'
        });

        var userLabel = Ext.create('Ext.Label', {
            html: '<div class="search-box-images"><img class="list" src="resources/icons/User_30_30.png">',
            docked:'right'
        });
        var moreLabel = Ext.create('Ext.Label', {
            html: '<img class="more arrow" src="resources/icons/moreArrow.png">',
            docked:'right'
        });

        toolbar.add(searchField);

        toolbar.add(moreLabel);
        toolbar.add(userLabel);
        toolbar.add(singleLine);
        
        
        

        this.add(toolbar);

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
                me.fireEvent('textsearch', me.getSearchField());
            }
        })
    },

    toggleToolbarMoreImage:function(){
        var label = this.getSearchToolbar().getComponent(1);
        var singleLineLabel = this.getSearchToolbar().getComponent(3);
        if (label.getHtml() == '<img class="more arrow" src="resources/icons/moreArrow.png">') {
            label.setHtml('<img class="more splitline" src="resources/icons/splitLine.png">');
            singleLineLabel.setHidden(false);
        } else {
            label.setHtml('<img class="more arrow" src="resources/icons/moreArrow.png">')
            singleLineLabel.setHidden(true);
        }
        
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
        //return this.getComponent(3);
    },

    /**
      * Returns the Search Toolbar
      * @method
      * @return {Ext.Toolbar}
     */
    getSearchToolbar: function () {
        return this.getComponent(3);
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
        var lang = DoctorsNearMe.config.getLanguage();

        this.getSpecialtySelectField().setPlaceHolder(lang.CHOOSE_SPECIALTY);

    }
})