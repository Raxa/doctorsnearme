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
                    text: 'Add filters',
                    ui: 'mainmenu'

                },
                {
                    text: 'Sort',
                    ui:'mainmenu'
                },
                {
                    text: 'Change Location',
                    ui: 'mainmenu'
                },
                {
                    text: 'Traffic Layer On',
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
        this.getProfileButton().on('tap', function(button, e, eOpts) {
            me.fireEvent('showprofile');
        });
        
        this.getFiltersButton().on('tap', function (button, e, eOpts) {
            me.fireEvent('addfilters');
        });
        
        this.getChangeLocationButton().on('tap', function (button, e, eOpts) {
            me.fireEvent('changelocation');
        });
        
        this.getTrafficButton().on('tap', function (button, e, eOpts) {
            switch (button.getText()) {
                case 'Traffic Layer On':
                    button.setText('Traffic Layer Off');
                    me.fireEvent('traficon',button,true);
                    break;
                case 'Traffic Layer Off':
                    button.setText('Traffic Layer On');
                    me.fireEvent('traficoff', button,false);
                    break;
            }
        });
        
        this.getLogInButton().on('tap', function (button, e, eOpts) {
            switch(button.getText()) {
                case 'Log In': 
                    me.fireEvent('login');
                    break;
                case 'Log out':
                    me.fireEvent('logout', me);
                    break;
            }
           
        });
        
        this.getAboutButton().on('tap', function (button, e, eOpts) {
            Ext.Msg.alert("About Easy Treaty", "version 1.0");
        });

        this.getSortButton().on('tap', function(button, e, eOpts) {
            me.fireEvent('sort');
        });
    },
    
    /**
     * Returns the Sort button
     * @private
     * @method
     * @return {Button}
    */
    getSortButton: function () {
        return this.getComponent(2);
    },
    
    /**
     * Returns the About button
     * @private
     * @method
     * @return {Button}
    */
    getAboutButton: function () {
        return this.getComponent(6);
    },
    
    /**
     * Returns the Log In button
     * @private
     * @method
     * @return {Button}
    */
    getLogInButton: function() {
        return this.getComponent(5);
    },
    
    /**
     * Returns the Traffic button
     * @private
     * @method
     * @return {Button}
    */
    getTrafficButton: function () {
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
     * Returns the Filters button
     * @private
     * @method
     * @return {Button}
    */
    getFiltersButton: function () {
        return this.getComponent(1);
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
    }
});