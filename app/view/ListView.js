/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.ListView', {
    extend: 'Ext.Container',

    xtype: 'listview',

    config:
   {
       
       layout: 'vbox',
       styleHtmlContent: true,
       align: 'stretch',
       cls:'list-view',
       items: [
           {
               xtype: 'list',
               cls:'favorite-list',
               flex: 7,
               disableSelection: true,
               emptyText:'No saved places'
           }
       ]

   },

    /**
     * Set handlers 
     * @method
     * @private
     */
    setHandlers: function(){
        var me = this;

        //listener for the direction button
        this.addListener({
            element: 'element',
            delegate: 'button.list-direction',
            tap: function (event, node, options, eOpts) {
                console.log("get directions");
                me.fireEvent('getdirections', node.id);
            }
        });

        //listener for moredetails button
        this.addListener({
            element: 'element',
            //delegate: 'button.more-details',
            delegate: 'img.list-more-details',
            tap: function (event, node, options, eOpts) {
                me.fireEvent('moredetails', node.id);
            }
        });
    },

    /**
     * Set template for the list 
     * @method
     * @private
     */
    setTemplate: function(){

        var lang = DoctorsNearMe.config.getLanguage();

        var template = new Ext.XTemplate(
            '<div display="block">',
            '<div display="table-column-group" class="list-firstrow-div">',
                 '<div class="inlineblock">',
                    '<div class="inlineblock docname"><p>{name}</p></div>',
                    '<div class="inlineblock"><img class="list-more-details" id ={id} src = "resources/icons/i_30_30.png"></div>',
            '<br><br>',
                 '</div>',
            '</div>',
            '</div>',
            '<div display="block">',
            '<div display="table-column-group">',
                '<tpl if="values.international_phone_number!=null">',
                '<div class="inlineblock list-call-block">',
                        '<img class="list-call-img" src = "resources/icons/Phone_40_40.png"><button class="list-call"><a href="tel:{international_phone_number}">{[this.getCallLabel()]}</a></button>',
                '</div>',
                '</tpl>',
                '<tpl if="values.international_phone_number!=null">',
                '<div class="inlineblock list-direction-block half-length">',
                '</tpl>',
                '<tpl if="values.international_phone_number==null">',
                '<div class="inlineblock list-direction-block full-length">',
                '</tpl>',
                    '<button class="list-direction" id={id}><img class="direction-img" src = "resources/icons/Arrow_40_40.png">{[this.getDirectionsLabel()]}</button>',
                '</div>',
            '</div>',
            '</div>'
                
          ,{
              isLoggedIn: function () {
                  console.log("template function, is logged in");
                  console.log(DoctorsNearMe.config.getLoggedIn());
                  return DoctorsNearMe.config.getLoggedIn();
              },
              getDirectionsLabel: function () {
                  return lang.GET_DIRECTIONS;
              },
              getCallLabel: function () {
                  return lang.CALL;
              }
          
          });

        this.getItemList().setItemTpl(template);
    },

    /*
    * Initialize
    */
    initialize: function () {
        this.enableBubble(['backtomap','like']);

        this.callParent();
        this.setTemplate();
        var me = this;

        this.addToolBar();

        this.setHandlers();
    },

    /**
     * Set the store for list. This is called inside mapview initialize function. 
     * @method
     * @public
     */
    setListStore: function(store){
        this.getItemList().setStore(store);
    },

    /**
     * Refill the list from values from the store 
     * @method
     * @public
     */
    fillList: function () {
        this.getItemList().refresh();
    },

    /**
     * Reset the template - used in language controller 
     * @method
     * @public
     */
    refreshTemplate: function(){
         this.setTemplate();
    },
    /*
    * Sets the top label
    * @method
    */
    setTheTitle: function(title) {
        this.getComponent(0).setData({ title: title });
    },
    

    /**
     * Returns the List
     * @method
     * @return {List} 
     */
    getItemList: function() {
        return this.getComponent(0);
    },

    /**
     * Add the top toolbar 
     * @method
     * @private
     */
    addToolBar: function () {
        var lang = DoctorsNearMe.config.getLanguage();
        var me = this;
        var toolbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    ui: 'back',
                    handler: function () {
                        me.fireEvent("backtomap");
                    }
                }
            ]
        });

        toolbar.setTitle('<p style="color:#0d66f2;">' + lang.SAVED+'</p>');

        this.add(toolbar);
        
    },

    /**
     * Get the toolbar 
     * @method
     * @private
     */
    getToolBar: function(){
        return this.getComponent(1);
    },

    /**
     * Set language 
     * @method
     * @public
     */
    setLanguage: function () {

        var lang = DoctorsNearMe.config.getLanguage();
        this.getToolBar().setTitle('<p style="color:#0d66f2;">' + lang.SAVED + '</p>');
    }


});