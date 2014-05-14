/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.UserProfile', {
    extend: 'Ext.Container',
    
    xtype: 'userprofile',
    config:
    {
        layout: 'fit',
        styleHtmlContent: true,
        html: 'test',
        store:null,
        data: null,
        cls: 'profile',
        items: {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    docked: 'right',
                    padding: '5 5 5 5'
                }
            ]
        }
                
    },

    /**
     * Initialize
     * @method
    */
    initialize: function () {
        var me = this;
        
        var store = Ext.create('EasyTreatyApp.store.User', {
            model: "EasyTreatyApp.model.User",
        });

        this.setStore(store);

        this.getStore().on({
            load: this.onStoreLoad,
            scope: this
        });

        this.getBackButton().on('tap', function() {
            me.fireEvent('back');
        });

        this.callParent();
    },
  
    /**
     * Executed when store is loaded
     * @private
     * @method
    */
    onStoreLoad: function () {
        var records = this.getStore().getRange();
        this.setData(this.extractData(records)[0]);
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

        return data;
    },

    constructor: function() {
        var template = new Ext.XTemplate(
            '<table>',
             '<th colspan="2">My Profile&nbsp;&nbsp;&nbsp;<img src="resources/css/images/profile.png"></th>',
            '<tbody>',
            '<tr>',
            '<td>Name&nbsp;:</td><td>{name}</td>',
            '</tr>',
            '<tr>',
            '<td>Age&nbsp;:</td><td>{age}</td>',
            '</tr>',
            '<tr>',
            '<td>Address&nbsp;:</td><td>{address}</td>',
            '</tr>',
            '<tr>',
            '<td>Weight&nbsp;:</td><td>{weight}</td>',
            '</tr>',
            '<tr>',
            '<td>Remarks&nbsp;:</td>',
            '<tpl for="remarks">',
            '<tpl if="xindex==1">',
            '<td>{.}</td>',
            '</tr>',
            '</tpl>',
            '<tr>',
            '<tpl if="xindex!=1">',
            '<td>&nbsp;</td>',
            '<td>{.}</td>',
            '</tpl>',
            '</tr>',
            '</tpl>',
            '</tbody>',
            '</table>',
            //'test: <input type="text" x-webkit-speech>'
            '<div class="x-container x-field-text x-field x-label-align-left x-field-labeled x-form-label-nowrap x-empty" id="ext-textfield-1">' +
'<div class="x-form-label" id="ext-element-134" style="width: 30% !important;">' +
'<span id="ext-element-135">Provider Name</span>' +
'</div>' +
'<div class="x-component-outer" id="ext-element-133">' +
'<div class="x-field-input" id="ext-input-3">' +
'<input class="x-input-el x-form-field x-input-text" type="text" x-webkit-speech id="ext-element-136" name="provname" placeholder="Enter provider name">' +
'<div class="x-clear-icon" id="ext-element-138">' +
'</div>' +
'<div class="x-field-mask" style="display: none !important;" id="ext-element-137">' +
'</div></div></div></div>'
        );
        this.setTpl(template);
        this.callParent(arguments);

    },

    /**
     * Returns the back button
     * @method
     * @private
     * @return {Button} 
     */
    getBackButton: function() {
        return this.getComponent(0).getComponent(0);
    }
    

})