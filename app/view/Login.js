/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.Login', {
    extend: 'Ext.Container',
    xtype: 'loginview',
    requires: ['Ext.Img', 'Ext.form.FieldSet', 'Ext.field.Email', 'Ext.field.Password', 'Ext.field.Checkbox'],
    config: {
        layout: 'vbox',
        scrollable:'vertical',
        cls: 'login',
        style:'background-color:#FFCCFF;',
        items: [
            {
                xtype: 'button',
                cls:'signup-btn',
                text: '<span class="signup-label">Sign up</span>'
            },            
            {
                xtype: 'container',
                cls:'signin-fieldset-container',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'username',
                        required: true,
                        label: 'Username or email',
                        labelAlign:'top',
                        labelCls: 'username-pwd'
                    },
                    {
                        xtype: 'passwordfield',
                        label: 'Password',
                        labelAlign: 'top',
                        name: 'password',
                        required: true,
                        labelCls: 'username-pwd'
                    }
                ]
            },
            {//forgot login
                xtype: 'label',
                html: 'Forgot Login/pass?',
                cls: 'forgot-login'
            },
            
            {
                xtype: 'button',
                text: '<span class="signin-label">Sign In</span>',
                cls:'signin-btn'
            },
            {
                xtype: 'button',
                width: '40%',
                cls:'cancel-btn',
                text:'<span class="cancel-label">CANCEL</span>'
            }
            
        ]
    },
    
    getLoginButton: function(){
        return this.getComponent(3);
    },

    getCancelButton: function(){
        return this.getComponent(4);
    },

    getFieldSet: function(){
        return this.getComponent(1);
    },

    getUsernameField: function(){
        return this.getFieldSet().getComponent(0);
    },

    getPasswordField: function(){
        return this.getFieldSet().getComponent(1);
    },

    getForgotLoginField: function(){

    },

    initialize: function () {

        var loginButton = this.getLoginButton();
        var cancelButton = this.getCancelButton();
        var me = this;
        loginButton.on('tap', function() {
            me.fireEvent('login');
        });

        cancelButton.on('tap', function() {
            me.fireEvent('cancel');
        });

        this.callParent();
     //   this.setLanguage();
    },

    /**
     * Get the values of the username and password field 
     * @method
     * @public
     */
    getTheValues: function () {
        var fieldSet = this.getFieldSet();

        var userName = this.getUsernameField().getValue();
        var password = this.getPasswordField().getValue();

        return { userName: userName, password: password };
    },

    /**
     * Set language 
     * @method
     * @public
     */
    setLanguage: function () {
        var lang = EasyTreatyApp.config.getLanguage();
    }

});