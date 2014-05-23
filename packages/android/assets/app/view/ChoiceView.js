/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.ChoiceView', {
    extend: 'Ext.Container',
    requires: ['Ext.dataview.List', 'Ext.Label','Ext.Img'],
    xtype: 'choiceview',
    
    config: {
        layout: 'vbox',
        align : 'stretch',
        cls:'choice-view',
        defaults: {
            flex: 1
        },
        items: [
            {
                xtype: 'image',
                src: 'resources/icons/logo.png',
                style: 'width:200px;height:100px;background-size:contain;',
                margin: '10 auto'
            },
            {
                 xtype: 'label',
                 tpl: '<h1 class="app-name">{title}</h1>',
                 data: { title: 'Easy Treaty' },
                 maxHeight: '20%'
            },
            {
                xtype: 'list',
                margin: '5% 25% 5% 25%',
                flex: 7,
                scrollable: null,
                itemTpl: '<div class="item"><img src="resources/css/images/search.png"><br>{title}</div>',
                data: [                    
                    { title: 'Medical Centers' },
                    { title: 'Doctors' },
                    { title: 'Pharmacies' }
                ],
               cls:'option-list'
            }

        ]
    },
 

    /**
     * Initialize
     * @method
    */
    initialize:function() {
        this.callParent(arguments);

        //this.getComponent(2).on(
        this.getOptionList().on(
            {                
                itemsingletap: this.onItemTap,
                scope:this,
            });
    },
    
    /**
     * Returns the option list
     * @method
     * @return {List}
    */
    getOptionList: function() {
        return this.getComponent(2);
    },
    
    /**
     * Executed when an item is tapped in the list
     * @method
    */
    onItemTap: function (list, index, target, record, e, eOpts) {
        this.fireEvent('choicedone',index);
    }
    

})