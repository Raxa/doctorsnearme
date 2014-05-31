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
                    //text: 'Back',
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

        this.setLanguage();
    },


    constructor: function() {
        var template = new Ext.XTemplate(
            '<table>',
             '<th colspan="2">{[this.getString("profile")]}&nbsp;&nbsp;&nbsp;<img src="resources/css/images/profile.png"></th>',
            '<tbody>',
            '<tr>',
            '<td>{[this.getString("firstname")]}&nbsp;:</td><td>{firstName}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("lastname")]}&nbsp;:</td><td>{lastName}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("gender")]}&nbsp;:</td><td>{gender}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("location")]}&nbsp;:</td><td>{location}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("patientid")]}&nbsp;:</td><td>{patientIdentifier}</td>',
            '</tr>',
            '</tbody>',
            '</table>', {

                getString: function (string) {
                    var lang = EasyTreatyApp.config.getLanguage();
                    switch (string) {
                        case 'profile': return lang.HEALTH_PROFILE;
                            break;

                        case 'firstname': return lang.FIRST_NAME;
                            break;

                        case 'lastname': return lang.ADDRESS;
                            break;

                        case 'gender': return lang.GENDER;
                            break;

                        case 'location': return lang.LOCATION;
                            break;

                        case 'patientid': return lang.PATIENT_ID;
                            break;
                    }
                }
            }
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
    },

    setLanguage: function () {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getBackButton().setText(lang.BACK);
    },

    refreshTemplate: function () {
        var data = this.getData();
        var tpl = this.getTpl();

        this.setTpl(null);
        this.setData(null);

        this.setTpl(tpl);
        this.setData(data);
    }
    

})