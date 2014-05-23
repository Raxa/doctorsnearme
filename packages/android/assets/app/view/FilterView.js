/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.FilterView', {
    extend: 'Ext.Container',
    xtype: 'filterview',
    requires: ['Ext.field.Select'],
    config: {
        layout: 'vbox',
        cls: 'loc-filter',
        scrollable: true,
    },
    
    resetFields: function() {
        var fieldSet = this.down('fieldset');
        var items = fieldSet.getItems();
        var noOfFields = items.length;

        for (var i = 0; i < noOfFields - 1; i++) {
            items.getAt(i).setValue('');
        }

    },
    
    addToolbar: function() {
        var toolbar = Ext.create('Ext.Toolbar', {
            docked: 'bottom'
        });
        
        var cancelBtn = Ext.create('Ext.Button', {
            text: 'Cancel',
            docked: 'left',
            padding: '5 5 5 5'
        });


        var searchBtn = Ext.create('Ext.Button', {
            text: 'Search',
            docked: 'right',
            padding: '5 5 5 5'
        });

        var me = this;
        searchBtn.on('tap', function (button, e, eOpts) {
            me.fireEvent('search', me, button);
        });
        cancelBtn.on('tap', function (button, e, eOpts) {
            me.fireEvent('cancel', me, button);
        });

        toolbar.add(cancelBtn);
        toolbar.add(searchBtn);


        this.add(toolbar);
    },
    
    initialize: function() {
        this.callParent();

        this.addToolbar();
    }
    
 

})