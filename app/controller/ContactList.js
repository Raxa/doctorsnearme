/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.ContactList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            contactList:'contactlist',
            mapView: 'mapview',
            thankPanel:'thanks'
        },
        control: {
            contactList: {
                cancel: "backToMapView",
                share:"share"
            }

        }
    },

    /**
     * Called when user click on cancel button in contact list 
     * @method
     * @private
     */
    backToMapView: function () {
        var mapview = this.getMapView();
        Ext.Viewport.setActiveItem(mapview);

    },

    share: function (selectedEmailsArray) {
        console.log("inside send mail");

        var me = this;
        var panel = me.getThankPanel();
        if (panel == null) {
            panel = Ext.create('DoctorsNearMe.view.ThanksForSharing');
            Ext.Viewport.add(panel);
        }
        
        var record;
        Ext.Ajax.request({
            url: DoctorsNearMe.config.getRatingServerDomain() + 'sendEmail',
            method: 'GET',
            params: {
                emails: Ext.JSON.encode(selectedEmailsArray)
            },
            success: function (response, opts) {               
            },
            failure: function (response, opts) {
                console.log("failure");
                console.log(response);
            }
        });

        Ext.Viewport.setActiveItem(me.getMapView());
        panel.dissapear();
    }
})