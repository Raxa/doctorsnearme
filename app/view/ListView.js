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
       //cls: 'profile',
       store:null,
       items: [
           {
               xtype: 'list',
               // itemTpl: '{name}<br>{formatted_address}<br>{isFavorite}',
               cls:'favorite-list',
               flex: 7,
               disableSelection:true
           }
       ]

   },

    setHandlers: function(){
        var me = this;
        this.addListener({
            element: 'element',
            delegate: 'button.list-direction',
            tap: function (event, node, options, eOpts) {
                console.log("get directions");
                me.fireEvent('getdirections', node.id);
            }
        });

        this.addListener({
            element: 'element',
            //delegate: 'button.more-details',
            delegate: 'img.list-more-details',
            tap: function (event, node, options, eOpts) {
                me.fireEvent('moredetails', node.id);
            }
        });


    },

    setTemplate: function(){

        var lang = EasyTreatyApp.config.getLanguage();

        var userimg = '<img class="list-user-img" src="test.png">';

        var moredetails = '<img class="list-more-details" id ={id} src = "resources/icons/i_30_30.png">';
        var like = '<img class="list-like-img" src = "resources/icons/Tellafriend.png">';
        var doctorname = '<div  class="inlineblock">' + userimg + '</div>' +
                         '<div class="inlineblock">' +
                               '<div class="inlineblock docname"><p class="wordstyle">' + '{name}' + '</p></div>' +
                               '<div class="inlineblock">' + moredetails + '</div>' +
                              // '<br>' +
                               '<div>' + like + '</div>' +
                         '</div>';
        var call = "";
        
            call = '<img class="call-img" src = "resources/icons/Phone_40_40.png"><button class="list-call"><a href="tel:' + '{international_phone_number}' + '">Call</a></button>';
        
        var directions = '<button class="list-direction" id=' +'{id}' + '><img class="direction-img" src = "resources/icons/Arrow_40_40.png">' + lang.GET_DIRECTIONS + '</button>';

        //var tpl = '<table><tr><td>' + userimg + '</td><td>' + doctorname + '</td></tr></table>' + '<table><tr><td>' + call + '</td>' + '<td>' + directions + '</td>' + '</tr>' + '</table>';
        var tpl = '<div>'+'<div display="table-column-group" class="list-first-row">' + doctorname + '</div>' + '<div display="table-column-group">' + call + directions + '</div>'+'</div>';

        this.getItemList().setItemTpl(tpl);
    },

    /*
    * Initialize
    */
    initialize: function () {
        this.enableBubble(['backtomap']);

        this.callParent();
        this.setTemplate();
        var me = this;
        //this.getItemList().on(
        //   {
        //       itemsingletap: this.onItemTap,
        //       scope: this,
        //   });

        this.addToolBar();
        this.setHandlers();
    },

    setListStore: function(store){
        this.getItemList().setStore(store);
    },

    fillList: function () {
        this.getItemList().refresh();
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
    * Executed when an item is tapped in the list
    * @method
   */
    onItemTap: function (list, index, target, record, e, eOpts) {
        console.log("item select");
        this.parent.fireEvent('itemselected', record);
        //this.getItemList().setData(null);
    },

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

        toolbar.setTitle('<p style="color:#0d66f2;">' + lang.SAVED+'</p>');

        this.add(toolbar);
        
    }


});