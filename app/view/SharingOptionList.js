/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.SharingOptionsList', {
    extend: 'Ext.ActionSheet',
    requires:['Ext.Label'],
    xtype: 'sharelist',
    config: {
        width: '95%',
        left: '2.5%',
        right: '2.5%',
        style:'border:0;border-radius:3px;',
        items: [
        {//0
            xtype: 'label',
            ui: 'menu',
            cls: 'share-label'
        },
        {//1
           // Email',
            ui: 'menu',
            style: 'background-color:#D4D3E8;border-color:#CCCCCC'
        },
        {//2
           // Message
            ui: 'menu',
            style: 'background-color:#D4D3E8;border-color:#CCCCCC'
        },
        {//3
           // Facebook
            style: 'background-color:#D4D3E8;border-color:#CCCCCC',
            ui: 'menu'
        },
        {//4
           //Twitter
            ui: 'menu',
            style: 'background-color:#D4D3E8;border-color:#CCCCCC'
        },
        {//5
          //  Cancel
            ui: 'menu',
            style: 'border-top:8px solid #D0D0D0;background-color:#D4D3E8;padding-top:8px;padding-bottom:8px;border-color:#999999',
            height:'50px'
        }
        ]
    },

    initialize: function(){
        this.callParent();

        this.sethandlers();

        this.setLanguage();
    },

    getTopLabel: function(){
        return this.getComponent(0);
    },

    getEmailButton:function(){
        return this.getComponent(1);
    },

    getMessageButton: function(){
        return this.getComponent(2);
    },

    getFacebookButton: function(){
        return this.getComponent(3);
    },

    getTwitterButton: function(){
        return this.getComponent(4);
    },

    getCancelButton: function(){
        return this.getComponent(5);
    },

    sethandlers: function () {
        var me = this;
        this.getEmailButton().on('tap', function () {
            me.fireEvent('share', 'EMAIL');
            me.hide();
        });

        this.getMessageButton().on('tap', function () {
            me.fireEvent('share', 'MESSAGE');
            me.hide();
        });

        this.getFacebookButton().on('tap', function () {
            me.fireEvent('share', 'FACEBOOK');
            me.hide();
        });

        this.getTwitterButton().on('tap', function () {
            me.fireEvent('share', 'TWITTER');
            me.hide();
        });

        this.getCancelButton().on('tap', function () {
            console.log("on cancel tap");
            me.hide();
        });
    },

    shareHandler: function (type) {
        this.fireEvent('share', type);
    },

    setLanguage: function () {
        var lang = DoctorsNearMe.config.getLanguage();

        this.getTopLabel().setHtml(lang.SHARE_VIA);
        this.getEmailButton().setText(lang.EMAIL);
        this.getMessageButton().setText(lang.MESSAGE);
        this.getFacebookButton().setText(lang.FACEBOOK);
        this.getTwitterButton().setText(lang.TWITTER);
        this.getCancelButton().setText(lang.SIMPLE_CANCEL);
    }
    
});