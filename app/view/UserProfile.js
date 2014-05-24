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

        this.getBackButton().on('tap', function () {
            console.log("profile back tap");
            me.fireEvent('back');
        });

        this.callParent();
    },


    constructor: function() {
        var template = new Ext.XTemplate(
            '<table>',
             '<th colspan="2">My Profile&nbsp;&nbsp;&nbsp;<img src="resources/css/images/profile.png"></th>',
            '<tbody>',
            '<tr>',
            '<td>First Name&nbsp;:</td><td>{firstName}</td>',
            '</tr>',
            '<tr>',
            '<td>Last Name&nbsp;:</td><td>{lastName}</td>',
            '</tr>',
            '<tr>',
            '<td>Gender&nbsp;:</td><td>{gender}</td>',
            '</tr>',
            '<tr>',
            '<td>Location&nbsp;:</td><td>{location}</td>',
            '</tr>',
            '<tr>',
            '<td>Patient Identifier&nbsp;:</td><td>{patientIdentifier}</td>',
            '</tr>',
            '</tbody>',
            '</table>'
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