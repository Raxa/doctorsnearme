/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.ListView', {
    extend: 'Ext.Container',

    xtype: 'listview',

    config:
   {
       /**
         * cfg {Store} locStore To store locations data 
         */
       locStore: null,

       /**
        * cfg {Store} docStore To store doctors' data 
        */
       docStore: null,

       /**
        * cfg {Store} pharmacyStore To store pharmacies' data 
        */
       pharmacyStore: null,
       
       layout: 'vbox',
       styleHtmlContent: true,
       align: 'stretch',       
       cls: 'profile',
       items: [
           {
              xtype: 'label',
              tpl: '<h1 class="header">{title}</h1>',
              docked:'top',
              maxHeight: '20%',
              data: { title: 'Sorted' }
           },
           {
               xtype: 'list',
               itemTpl: '{name}<br>{address1}<br>{distance} km',
               cls:'option-list',
               flex:7
           },
           {
               xtype: 'toolbar',
               docked: 'bottom',
               items: [
                   {
                       xtype: 'label',
                       tpl: '<h1>{title}</h1>',
                       data: { title: 'Sort by: ' }
                   },
                   
                   {
                       xtype: 'button',
                       text: 'Distance',
                   },
                   {
                       xtype: 'button',
                       text: 'Cost'
                   },
                   {
                       xtype: 'button',
                       text: 'Back',
                       docked: 'right'
                   },
               ]
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
        
        this.getBackButton().on('tap', function () {
            me.fireEvent('back');
        });

        this.getDistanceButton().on('tap', function() {
            me.fireEvent('sortondistance', me, me.getItemList().getData());
        });

        this.setAllStores();
    },
    /**
        * Create the three stores and set stores
        * @method
        * @private
       */
    setAllStores: function () {
        var locStore = Ext.create('EasyTreatyApp.store.Location', {
            model: "EasyTreatyApp.model.Location",
        });

        this.setLocStore(locStore);

        var docStore = Ext.create('EasyTreatyApp.store.Doctor', {
            model: "EasyTreatyApp.model.Doctor",
        });

        this.setDocStore(docStore);

        var pharStore = Ext.create('EasyTreatyApp.store.Pharmacy', {
            model: "EasyTreatyApp.model.Pharmacy",
        });

        this.setPharmacyStore(pharStore);
    },
    

  /**
   * Sets the data of the list
   * @method
  */
    setListData: function (data) {
        this.getItemList().setData(data);
        this.getItemList().getStore().setData(data);
    },
    

    /**
     * Sets the store of the list
     * @method
    */
    setListStore: function (currentSearch) {
        
        switch(currentSearch) {
            case 0:
                this.getItemList().setStore(this.getLocStore());
                break;
            case 1:
                this.getItemList().setStore(this.getDocStore());
                break;
            case 2:
                this.getItemList().setStore(this.getPharmacyStore());
                break;
                
        }
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
        return this.getComponent(1);
    },
    
    /**
    * Executed when an item is tapped in the list
    * @method
   */
    onItemTap: function (list, index, target, record, e, eOpts) {
        console.log("item select");
        this.fireEvent('itemselected', record.get('id'));
    },
    
    /**
     * Returns the back button
     * @method
     * @private
     * @return {Button} 
     */
    getBackButton: function () {
        return this.getComponent(2).getComponent(3);
    },
    
    /**
     * Returns the Distance button
     * @method
     * @private
     * @return {Button} 
     */
    getDistanceButton: function () {
        return this.getComponent(2).getComponent(1);
    }


});