/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.ListView', {
    extend: 'Ext.Container',

    xtype: 'listview',
    
    config:
   {

       layout: 'vbox',
       styleHtmlContent: true,
       align: 'stretch',
       cls: 'list-view',
       items: [
           {
               xtype: 'list',
               cls: 'favorite-list',
               flex: 7,
               disableSelection: true
           }
       ]

   },

    /**
     * Set handlers 
     * @method
     * @private
     */
    setHandlers: function () {
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

        //this.addListener({
        //    element: 'element',
        //    delegate: 'button.list-like-img',
        //    //delegate: 'div.star',
        //    tap: function (event, node, options, eOpts) {
        //        var button = Ext.get(node.id);
        //        console.log("like tap");
        //        console.log(button);
        //        if (button.hasCls('like')) {
        //            console.log("has class like");
        //            console.log(node.id);
        //            console.log(node.id.slice(0, -5));
        //            me.fireEvent('like', true, node.id.slice(0, -5), button);
        //        }
        //        else {
        //            console.log("doesnt have class like");
        //            console.log(node.id);
        //            console.log(node.id.slice(0, -5));
        //            me.fireEvent('like', false, node.id.slice(0, -5), button);
        //        }
        //    }
        //});


    },

    /**
     * Set template for the list 
     * @method
     * @private
     */
    setTemplate: function () {

        var lang = EasyTreatyApp.config.getLanguage();

        var template = new Ext.XTemplate(
            '<div display="block">',
            '<div display="table-column-group" class="list-firstrow-div">',
                '<div  class="inlineblock user-img-div"><img class="list-user-img" src="test.png"></div>',
                 '<div class="inlineblock">',
                    '<div class="inlineblock docname"><p>{name}</p></div>',
                    '<div class="inlineblock"><img class="list-more-details" id ={id} src = "resources/icons/i_30_30.png"></div>',
                    //'<tpl if="this.isLoggedIn()==true">',
                    //    '<div>',
                    //    '<tpl if="values.isLiked==true">',
                    //        '<button class="list-like-img dislike" id={id}-like>',
                    //    '</tpl>',
                    //     '<tpl if="values.isLiked!=true">',
                    //        '<button class="list-like-img like" id={id}-like>',
                    //    '</tpl>',
                    //    '</div>',
                    //'</tpl>',
            '<br><br>',
                 '</div>',
            '</div>',
            '</div>',
            '<div display="block">',
            '<div display="table-column-group">',
                '<tpl if="values.international_phone_number!=null">',
                '<div class="inlineblock list-call-block">',
                   // '<tpl if="values.international_phone_number!=null">',
                        '<img class="list-call-img" src = "resources/icons/Phone_40_40.png"><button class="list-call"><a href="tel:{international_phone_number}">Call</a></button>',
                   // '</tpl>',
                '</div>',
                '</tpl>',
                '<div class="inlineblock list-direction-block">',
                    '<button class="list-direction" id={id}><img class="direction-img" src = "resources/icons/Arrow_40_40.png">{[this.getDirectionsLabel()]}</button>',
                '</div>',
            '</div>',
            '</div>'

          , {
              isLoggedIn: function () {
                  console.log("template function is logged in");
                  console.log(EasyTreatyApp.config.getLoggedIn());
                  return EasyTreatyApp.config.getLoggedIn();
              },
              getDirectionsLabel: function () {
                  return lang.GET_DIRECTIONS;
              }

          });

        this.getItemList().setItemTpl(template);
    },

    /*
    * Initialize
    */
    initialize: function () {
        this.enableBubble(['backtomap', 'like']);

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
    setListStore: function (store) {
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

    /*
    * Sets the top label
    * @method
    */
    setTheTitle: function (title) {
        this.getComponent(0).setData({ title: title });
    },


    /**
     * Returns the List
     * @method
     * @return {List} 
     */
    getItemList: function () {
        return this.getComponent(0);
    },

    /**
     * Add the top toolbar 
     * @method
     * @private
     */
    addToolBar: function () {
        var lang = EasyTreatyApp.config.getLanguage();
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

        toolbar.setTitle('<p style="color:#0d66f2;">' + lang.SAVED + '</p>');

        this.add(toolbar);

    },

    /**
     * Get the toolbar 
     * @method
     * @private
     */
    getToolBar: function () {
        return this.getComponent(1);
    },

    /**
     * Set language 
     * @method
     * @public
     */
    setLanguage: function () {

        var lang = EasyTreatyApp.config.getLanguage();
        this.getToolBar().setTitle('<p style="color:#0d66f2;">' + lang.SAVED + '</p>');
    }


});