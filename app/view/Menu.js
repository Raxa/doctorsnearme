/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.Menu', {
    extend: 'Ext.Container',
    xtype: 'mainmenu',
    config: {
        cls: 'mainmenu',
        docked: 'left',
		top: 0,
        left: 0,
        bottom: 0,
        zIndex: 0,
		width: 266,
        padding: '97 0 0 0',
        open: false,
        scrollable: 'vertical',
        defaultType: 'button',
        items: [
                {
                    text: 'My Health Profile',
                    ui: 'mainmenu',
                    hidden:true
                },  
                {
                    xtype: 'selectfield',
                    label: 'Distance',
                    labelWidth:'45%',
                    ui: 'mainmenu',
                    autoSelect: false,
                    options: [
                    { text: '1000', value: '100000' },
                    { text: '10000', value: '100000' },
                    { text: '100000', value: '100000' },
                    { text: '1000000', value: '1000000' }
                    ]
                },
                {
                    xtype: 'selectfield',
                    label: 'Specilty',
                    labelWidth: '45%',
                    ui: 'mainmenu',
                    options: [
                    { text: 'Cardiologist', value: 'first' },
                    { text: 'Dentist', value: 'second' },
                    { text: ' Immunologist', value: 'third' }
                    ]
                },
                {
                    text: 'Change Location',
                    ui: 'mainmenu'
                },              
                {
                    text: 'Log In',
                    ui: 'mainmenu'
                },
                {
                    text: 'About',
                    ui: 'mainmenu'
                }

        ]
    },

    /**
     * Initialize
     * @method
    */
    initialize: function() {
        this.callParent();

        this.setHandlerFunctions();


    },
    
    /**
     * Sets button handlers
     * @private
     * @method
    */
    setHandlerFunctions: function () {
        var me = this;

        this.getProfileButton().on('tap', function (button, e, eOpts) {
            me.fireEvent('showprofile');
        });

        this.getChangeLocationButton().on('tap', function (button, e, eOpts) {
            me.fireEvent('changelocation');
        });

        this.getLogInButton().on('tap', function (button, e, eOpts) {
            if (!EasyTreatyApp.config.getLoggedIn()) {
                me.toggle();
                me.fireEvent('loginpagerequested');
            }
            else {
                me.fireEvent('logout');
            }
            
        });

        this.getDistanceSelectField().on('change',function(selectField,newValue,oldValue, eOpts){
            me.fireEvent('searchradiuschange',parseInt(newValue));
            console.log(newValue);
        });

        this.getAboutButton().on('tap', function (button, e, eOpts) {
            Ext.Msg.alert("About Easy Treaty", "version 1.0");
        });
    },
    
    getDistanceSelectField: function(){
        return this.getComponent(1);
    },

    /**
     * Returns the About button
     * @private
     * @method
     * @return {Button}
    */
    getAboutButton: function () {
        return this.getComponent(5);
    },
    
    /**
     * Returns the Log In button
     * @private
     * @method
     * @return {Button}
    */
    getLogInButton: function() {
        return this.getComponent(4);
    },
    
    
    /**
     * Returns the Change Location button
     * @private
     * @method
     * @return {Button}
    */
    getChangeLocationButton: function () {
        return this.getComponent(3);
    },
    
    /**
     * Returns the Profile button
     * @private
     * @method
     * @return {Button}
    */
    getProfileButton: function () {
        return this.getComponent(0);
    },
    /**
     * Executed at log out
     * @public
     * @method
    */
    atLogOut: function() {
        var btn = this.getLogInButton();
        btn.setText("Log In");
        this.getProfileButton().doSetHidden(true);
    },
    
    setParent: function(parent) {
        this.callParent(arguments);
        this.maskCmp = parent.add({
            xtype   : 'component',
            cls     : 'mainmenu-mask',
            top     : 0,
            zIndex  : 5000,
            hidden  : true,
			width   : 9999,
			left    : this.getWidth(),
			bottom  : 0
        });
        
        this.maskCmp.element.on({
            scope   : this,
            touchend: 'onMaskRelease'
        });
    },
    
    onMaskRelease: function() {
        this.setOpen(false);
    },
    
    onDestroy: function() {
        this.maskCmp.destroy();
        delete this.maskCmp;
        
        this.callParent(arguments);
    },
    
    toggle: function () {
        console.log(this);
        this.setOpen(!this.getOpen());
    },
    
    updateOpen: function(open) {
        var targetEl,
            parentCt = this.up();
        
        if (!parentCt) {
            return;
        }
        
        targetEl = parentCt.innerElement;
        
        if (open) {
			targetEl.translate(this.getWidth(), 0, 0);
            this.maskCmp.show();
        }
        else {
            targetEl.translate(0, 0, 0);
            this.maskCmp.hide();
        }
    },

    getDistanceValue: function () {
        return parseInt(this.getDistanceSelectField().getRecord().get('value'));
    }

});