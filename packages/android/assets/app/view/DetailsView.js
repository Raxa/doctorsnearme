/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.DetailsView', {
    extend:'Ext.Container',

    xtype: 'detailsview',
    
    config:
   {
       layout: 'fit',
       styleHtmlContent: true,
       store: null,
       data: null,
       cls: 'profile',
       items: {
           xtype: 'toolbar',
           docked: 'bottom',
           items: [
               {
                   xtype: 'button',
                   text: 'Back',
                   docked: 'right'
               }
           ]
       },
       viaMap:true

   },
    
    constructor: function () {
        var template = new Ext.XTemplate(
            '<table>',
             '<th colspan="2">More Information</th>',
            '<tbody>',
            '<tr>',
            '<td>Name&nbsp;:</td><td>{name}</td>',
            '</tr>',
            '<tr>',
            '<td>Address&nbsp;:</td><td>{address}</td>',
            '</tr>',
            '<tr>',
            '<td>Distance&nbsp;:</td><td>{distance}Km</td>',
            '</tr>',
            '<tr>',
            '<td>Phone Number&nbsp;:</td><td>{phoneNumber}</td>',
            '</tr>',
            '</tbody>',
            '</table>'
        );
        this.setTpl(template);
        this.callParent(arguments);

    },
    
    /**
    * Initialize
    * @method
   */
    initialize: function () {
        var me = this;       

        this.getBackButton().on('tap', function () {
            me.fireEvent('back',me.getViaMap());
        });

        this.callParent();
    },
 
    /**
     * Returns the back button
     * @method
     * @private
     * @return {Button} 
     */
    getBackButton: function () {
        return this.getComponent(0).getComponent(0);
    }
    

});