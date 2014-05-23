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
               itemTpl: '{name}<br>{formatted_address}',
               cls:'option-list',
               flex:7
           }
       ]

   },

    /*
    * Initialize
    */
    initialize: function() {
        this.callParent();
        var me = this;
        this.getItemList().on(
           {
               itemsingletap: this.onItemTap,
               scope: this,
           });

        

    },
   
    onLocationAddition: function () {
        console.log("list set data");
        this.getItemList().setData(null);
        this.getItemList().setData(this.extractData(this.getStore().getRange()));

    },


    /**
        * Extracts data from records
        * @method
        * @private
        * @param [{Object}] records
        * @return [{Object}] data
        */
    extractData: function (records) {
        var data = [];
        Ext.each(records, function (record, index) {
            data.push(record.data);
        }, this);
        console.log(data);
        return data;
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
        this.fireEvent('itemselected', record.get('id'));
    }


});