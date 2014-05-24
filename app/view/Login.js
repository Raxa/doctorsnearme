/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.Login', {
    extend: 'Ext.Container',
    xtype: 'loginview',
    requires: ['Ext.Img', 'Ext.form.FieldSet', 'Ext.field.Email', 'Ext.field.Password', 'Ext.field.Checkbox'],
    config: {
        layout: 'vbox',
        cls:'login',
        items: [
            {
                xtype: 'image',
                src: 'resources/icons/logo.png',
                style: 'width:200px;height:100px;background-size:contain',
                margin:'10 auto'
            },
            {
                 xtype: 'label',
                 tpl: '<h1 class="header">{title}</h1>',
                 data: { title: 'Log In' },
                 maxHeight: '20%'
            },
            {
                xtype: 'fieldset',
                cls:'item',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'username',
                        placeHolder: 'username',
                        required: true
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: 'password',
                        name: 'password',
                        required: true
                    }
                ]
            },
            {
                xtype: 'button',
                text:'Log In',
                padding: '8px',
                width: '50%',
                margin: '0 auto',
                cls: 'button-look'

            },
            {
                xtype: 'fieldset',
                width: '80%', 
                margin: '10 auto',
                styleHtmlContent:true,
                items: [
                    {
                        xtype: 'checkboxfield',
                        name: 'checkin',
                        label:'Keep me logged in',
                        labelAlign: 'right',
                        labelWidth: '80%',
                        labelCls: 'item'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Cancel',
                padding: '8px',
                width: '50%',
                margin: '5 auto',
                cls: 'button-look'
            }
        ]
    },
    
    initialize: function () {
        var loginButton = this.getComponent(3);
        var cancelButton = this.getComponent(5);
        var me = this;
        loginButton.on('tap', function() {
            me.fireEvent('login');
        });

        cancelButton.on('tap', function() {
            me.fireEvent('cancel');
        });

        this.callParent();
    }

});