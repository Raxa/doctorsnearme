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
                   // text: 'My Health Profile',
                    ui: 'mainmenu',
                    hidden:true
                },  
                {
                    xtype: 'selectfield',
                   // label: 'Distance',
                    labelWidth:'45%',
                    ui: 'mainmenu',
                    autoSelect: false
                },
                {
                    xtype: 'selectfield',
                   // label: 'Specilty',
                    labelWidth: '45%',
                    ui: 'mainmenu'
                },
                {
                   // text: 'Change Location',
                    ui: 'mainmenu'
                },              
                {
                 //   text: 'Log In',
                    ui: 'mainmenu'
                },
                {
                   // text: 'About',
                    ui: 'mainmenu'
                },
                {
                    xtype: 'selectfield',
                   // label: 'Language',
                    labelWidth: '45%',
                    ui: 'mainmenu'
                },

        ]
    },

    setLanguage: function () {
        var lang = EasyTreatyApp.config.getLanguage();
        this.getProfileButton().setText(lang.HEALTH_PROFILE);

        this.getAboutButton().setText(lang.ABOUT);

        this.getChangeLocationButton().setText(lang.CHANGE_LOCATION);

        this.getDistanceSelectField().setLabel(lang.DISTANCE);

        this.getLanguageSelectField().setLabel(lang.LANGUAGE);

        this.getSpecialtySelectField().setLabel(lang.SPECIALTY);

        if (EasyTreatyApp.config.getLoggedIn()) {
            this.getLogInButton().setText(lang.LOG_OUT);
        }
        else {
            this.getLogInButton().setText(lang.LOG_IN);
        }       
    },

    /**
     * Initialize
     * @method
    */
    initialize: function() {
        this.callParent();

        this.setHandlerFunctions();

        this.setLanguage();

        this.setSelectFieldStores();
    },

    setSelectFieldStores: function(){
        this.getLanguageSelectField().setStore(Ext.create('EasyTreatyApp.store.Language'));

        this.getSpecialtySelectField().setStore(Ext.create('EasyTreatyApp.store.Specialization'));

        this.getDistanceSelectField().setStore(Ext.create('EasyTreatyApp.store.Radius'));
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

        this.getLanguageSelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            me.fireEvent('languagechange', newValue,oldValue);
            console.log(newValue);
        });

        this.getAboutButton().on('tap', function (button, e, eOpts) {
            Ext.Msg.alert("About Easy Treaty", "version 1.0");
        });
    },
    
    getLanguageSelectField: function(){
        return this.getComponent(6);
    },

    getSpecialtySelectField: function () {
        return this.getComponent(2);
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