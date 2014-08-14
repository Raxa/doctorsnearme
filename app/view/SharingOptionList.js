Ext.define('DoctorsNearMe.view.SharingOptionsList', {
    extend: 'Ext.ActionSheet',
    xtype: 'sharelist',
    config: {
        width: '95%',
        left: '2.5%',
        right:'5%',
        items: [
        {
            xtype: 'label',
            html: 'Tell a friend about Raxa via...',
            ui: 'menu',
            cls: 'share-label'
        },
        {//1
            text: 'Email',
            ui: 'menu',
            style: 'background-color:#E8E8E8;',          
        },
        {//2
            text: 'Message',
            ui: 'menu',
            style: 'background-color:#E8E8E8;',
        },
        {//3
            text: 'Facebook',
            style: 'background-color:#E8E8E8;',
            ui: 'menu',
        },
        {//4
            text: 'Twitter',
            ui: 'menu',
            style: 'background-color:#E8E8E8;',
        },
        {//5
            text: 'Cancel',
            ui: 'menu',
            style: 'border-top:8px solid #D0D0D0;background-color:#E8E8E8;'
        }
        ]
    },

    initialize: function(){
        this.callParent();

        this.sethandlers();
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
    }
    
});