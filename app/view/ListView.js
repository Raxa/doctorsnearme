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
       cls: 'profile',
       store:null,
       items: [
           {
               xtype: 'list',
               // itemTpl: '{name}<br>{formatted_address}<br>{isFavorite}',
               cls:'option-list',
               flex:7
           }
       ]

   },

    setTemplate: function(){
        /*var template = new Ext.XTemplate(
           '{name}<br>{formatted_address}',
            '<tpl if="values.isFavorite==true">',
            //'</br><button class="star favorite"></button>',
            '</br><div class="color-star"></div>',
            '</tpl>'
       );
        this.getItemList().setItemTpl(template);*/


        var lang = EasyTreatyApp.config.getLanguage();

        var userimg = '<img class="user-img" src="test.png">';

        var moredetails = '<img class="more-details" id ={id} src = "resources/icons/i_30_30.png">';
        var like = '<img class="like-img" src = "resources/icons/Tellafriend.png">';
        var doctorname = '<div>' + '<p style="padding:2px;word-wrap:break-word;">' + '{name}' + '</p>' + moredetails + like + '</div>';
        var call = "";
        
            call = '<img class="call-img" src = "resources/icons/Phone_40_40.png"><button class="call"><a href="tel:' + '{international_phone_number}' + '">Call</a></button>';
        
        var directions = '<button class="direction" id=' +'{id}' + '><img class="direction-img" src = "resources/icons/Arrow_40_40.png">' + lang.GET_DIRECTIONS + '</button>';

        var infowindow = new google.maps.InfoWindow();

        var tpl = '<table><tr><td>' + userimg + '</td><td>' + doctorname + '</td></tr></table>' + '<table><tr><td>' + call + '</td>' + '<td>' + directions + '</td>' + '</tr>' + '</table>';
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
        this.getItemList().on(
           {
               itemsingletap: this.onItemTap,
               scope: this,
           });

        this.addToolBar();

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

        toolbar.setTitle(lang.SAVED);

        this.add(toolbar);
        
    }


});