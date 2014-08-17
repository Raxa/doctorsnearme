/**
 * Authored by Amaya
 */

Ext.define('DoctorsNearMe.view.Menu', {
    extend: 'Ext.Container',

    requires: [
       'DoctorsNearMe.ux.Multiselect', 'Ext.form.FieldSet', 'Ext.field.Radio', 'Ext.field.Slider'
    ],

    xtype: 'mainmenu',
    config: {

        cls: 'menu',
        docked: 'right',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        width: 260,
        padding: '50 10 0 10',
        open: false,
        scrollable: 'vertical',
        defaultType: 'button',
        border: 1,
        style: 'border-color: gray; border-style: solid;',

        items: [
                {
                    //0
                    hidden: true,
                    padding: '5 0 5 0',
                    docked:'top',
                    ui: 'menu',
                    cls:'name'
                },
                 {
                     //6
                     ui: 'menu',
                     padding: '5 0 5 0',
                     cls: 'menu-login',
                     docked: 'top'
                 },
                {
                    xtype: 'fieldset',
                    layout: 'vbox',
                    cls:'radio-set',
                    items: [
                          {
                              //2
                              xtype: 'radiofield',
                              name: 'search',
                              value: 'hospital',
                              labelWidth: '75%',
                              padding: '5 0 5 0',
                              checked: true
                             
                          },
                        {
                            //3
                            xtype: 'radiofield',
                            name: 'search',
                            value: 'doctor',
                            labelWidth: '75%',
                            padding: '5 0 5 0'
                        },
                        {
                            //4
                            xtype: 'radiofield',
                            name: 'search',
                            value: 'pharmacy',
                            labelWidth: '75%',
                            padding: '5 0 5 0'
                        }

                    ]
                },
                {
                    //3
                    xtype: 'sliderfield',
                    value: 2,
                    minValue: 1,
                    maxValue: 1000,
                    labelWidth: '45%',
                    labelAlign:'top',
                    maxWidth:'100%'
                },
                {
                    //4
                    xtype: 'textfield',
                    labelAlign: 'right',
                    label: 'km',
                    readOnly: true,
                    value: '2',
                    padding: '5 0 15 30%',
                    inputCls: 'distance'
                },
                {
                    //5
                    xtype: 'selectfield',
                    labelWidth: '45%',
                    usePicker: false,
                    padding: '5 0 5 0'
                },
                  {
                      //1
                      //saved
                      ui: 'menu',
                      padding: '5 0 5 0',
                      style: 'border-bottom:1px solid gray;border-radius:0;margin-left:0;marign-right:0;',
                      docked: 'top'
                  },
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            xtype: 'button',
                            docked: 'left',
                            ui:'menu'
                        },
                        {
                            xtype: 'button',
                            docked: 'right',
                            ui:'menu',
                            text: 'Rate us'
                        }
                    ]

                }

        ]
    },

    setLanguage: function () {
        var lang = DoctorsNearMe.config.getLanguage();
        this.getProfileButton().setText(lang.HEALTH_PROFILE);

        this.getSavedButton().setText('<img class="menu-heart" src = "resources/icons/Heart_40_40.png" width=20px height=20px align=left style="margin-right:20px;margin-left:10px;margin-bottom:10px;"><p align=left>' + lang.SAVED + '<img class="menu-forward" src = "resources/icons/code3.png" width=15px height=20px align=right></p>');

        this.getDistanceSelectField().setLabel(lang.DISTANCE);

        this.getLanguageSelectField().setLabel(lang.LANGUAGE);

        this.getHospitalField().setLabel('<img src = "resources/icons/hospital-icon.png" width=35px height=35px style="margin-right:20px;vertical-align:middle">' + '<span class="menu-place">'+lang.MEDICAL_CENTERS+'</span>');
        this.getDoctorField().setLabel('<img src = "resources/icons/Doctors.png" width=35px height=35px style="margin-right:20px;vertical-align:middle">' + '<span class="menu-place">' + lang.DOCTORS + '</span>');
        this.getPharmacyField().setLabel('<img src = "resources/icons/Pharmacies.png" width=35px height=35px style="margin-right:20px;vertical-align:middle">' + '<span class="menu-place">' + lang.PHARMACIES + '</span>');

        if (DoctorsNearMe.config.getLoggedIn()) {
            this.getLogInButton().setText(lang.LOG_OUT);
        }
        else {
            this.getLogInButton().setText(lang.LOG_IN);
        }

        this.getTellaFriendButton().setText('<img src = "resources/icons/Tellafriend1.png" width=20px height=20px align=left style="vertical-align:middle;"><span style="font-size:0.6em;vertical-align:middle;color:black;">&nbsp;' + lang.SHARE + '</span>');

        this.getRateUsButton().setHtml('<img src = "resources/icons/Heart_40_40_1.png" width=20px height=20px align=left style="vertical-align:middle;"><a href="market://details?id=com.raxa.EMR" style="font-size:0.6em;vertical-align:middle;text-decoration: none;color:black;">&nbsp;' + lang.RATE_US + '</a>');

    },

    /**
     * Initialize
     * @method
    */
    initialize: function () {
        this.callParent();

        this.setHandlerFunctions();

        this.setLanguage();

        this.setSelectFieldStores();
       
    },

    unCheckRadioButtons: function () {
        this.getHospitalField().uncheck();
        this.getDoctorField().uncheck();
        this.getPharmacyField().uncheck();
    },

    setSelectFieldStores: function () {
        this.getLanguageSelectField().setStore(Ext.create('DoctorsNearMe.store.Language'));
    },
   

    /**
     * Sets button handlers
     * @private
     * @method
    */
    setHandlerFunctions: function () {
        var me = this;

        this.getSavedButton().on('tap', function (button, e, eOpts) {
            me.fireEvent('showfavorites');
        });

        this.getLogInButton().on('tap', function (button, e, eOpts) {
            if (!DoctorsNearMe.config.getLoggedIn()) {
                me.toggle();
                me.fireEvent('loginpagerequested');
            }
            else {
                me.fireEvent('logout');
            }

        });

        this.getDistanceSelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            me.fireEvent('searchradiuschange', this.getValue()[0]);
            me.getDistaceField().setValue(this.getValue()[0]);
            console.log(this.getValue()[0]);
        });

        this.getLanguageSelectField().on('change', function (selectField, newValue, oldValue, eOpts) {
            me.fireEvent('languagechange', newValue, oldValue);
            console.log(newValue);
        });


        this.getTellaFriendButton().on('tap', function (button, e, eOpts) {
            me.toggle();
            me.fireEvent('share');
          
        });

        this.getHospitalField().on('change', function (selectField, newValue, oldValue, eOpts) {
            if (newValue) {
                me.fireEvent('choice', 0);
            }

            console.log(newValue);
        });

        this.getDoctorField().on('change', function (selectField, newValue, oldValue, eOpts) {
            if (newValue) {
                me.fireEvent('choice', 1);
            }
            console.log(newValue);
        });

        this.getPharmacyField().on('change', function (selectField, newValue, oldValue, eOpts) {
            if (newValue) {
                me.fireEvent('choice', 2);
            }

            console.log(newValue);
        });


    },

    getLanguageSelectField: function () {
        return this.getComponent(5);
    },

    getDistaceField: function () {
        return this.getComponent(4);
    },

    getDistanceSelectField: function () {
        return this.getComponent(3);
    },

    /**
     * Returns the About button
     * @private
     * @method
     * @return {Button}
    */
    getMenuToolbar: function () {
        return this.getComponent(7);
    },

    getTellaFriendButton:function(){
        return this.getMenuToolbar().getComponent(0);
    },

    getRateUsButton: function(){
        return this.getMenuToolbar().getComponent(1);
    },
    /**
     * Returns the Log In button
     * @private
     * @method
     * @return {Button}
    */
    getLogInButton: function () {
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

    getSavedButton: function () {
        return this.getComponent(6);
    },
    /**
     * Executed at log out
     * @public
     * @method
    */
    atLogOut: function () {
        var btn = this.getLogInButton();
        btn.setText("Log In");
        this.getProfileButton().doSetHidden(true);
    },

    setParent: function (parent) {
        this.callParent(arguments);
        this.maskCmp = parent.add({
            xtype: 'component',
            cls: 'mainmenu-mask',
            top: 0,
            zIndex: 5000,
            hidden: true,
            width: 9999,
            right: this.getWidth(),
            bottom: 0
        });

        this.maskCmp.element.on({
            scope: this,
            touchend: 'onMaskRelease'
        });
    },

    onMaskRelease: function () {
        this.setOpen(false);
    },

    onDestroy: function () {
        this.maskCmp.destroy();
        delete this.maskCmp;

        this.callParent(arguments);
    },

    toggle: function () {
        this.setOpen(!this.getOpen());

    },

    updateOpen: function (open) {

        console.log("menu toggled");
        this.fireEvent('menutoggled');
        var targetEl,
            parentCt = this.up();

        if (!parentCt) {
            return;
        }

        targetEl = parentCt.innerElement;

        if (open) {
            targetEl.translate(-this.getWidth(), 0, 0);
            this.maskCmp.show();
        }
        else {
            targetEl.translate(0, 0, 0);
            this.maskCmp.hide();
        }
    },

    getDistanceValue: function () {
        return parseInt(this.getDistanceSelectField().getRecord().get('value'));
    },

    getFieldSet: function(){
        return this.getComponent(2);
    },

    getHospitalField: function () {
        return this.getFieldSet().getComponent(0);
    },

    getDoctorField: function () {
        return this.getFieldSet().getComponent(1);
    },

    getPharmacyField: function () {
        return this.getFieldSet().getComponent(2);
    }

});