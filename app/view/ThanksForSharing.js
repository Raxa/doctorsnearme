/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.view.ThanksForSharing', {
    extend: 'Ext.Panel',

    xtype: 'thanks',

    config: {

        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
        centered: true,
        styleHtmlContent: true,
        style: 'border:2px solid #1081FB;margin:1px;padding:4px;background-color:white'
    },

    initialize: function(){
        this.callParent();

        this.setHtml('<span style="color:#1081FB;background-color:transparent"><b>' + DoctorsNearMe.config.getLanguage().THANKS + '</b></span>');
    },

    /*
    * Disspear after 1 second
    * @method
    * @public
    */
    dissapear: function () {
        var me = this;
        Ext.Function.defer(function () {
            me.setHidden(true);
        },1000)
    }
});