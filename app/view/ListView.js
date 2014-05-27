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
        var template = new Ext.XTemplate(
           '{name}<br>{formatted_address}',
            '<tpl if="values.isFavorite==true">',
            //'</br><button class="star favorite"></button>',
            '</br><div class="color-star"></div>',
            '</tpl>'
       );
        this.getItemList().setItemTpl(template);
    },

    /*
    * Initialize
    */
    initialize: function() {
        this.callParent();
        this.setTemplate();
        var me = this;
        this.getItemList().on(
           {
               itemsingletap: this.onItemTap,
               scope: this,
           });

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
    }


});