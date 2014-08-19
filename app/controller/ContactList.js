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
                shareviaemail: "shareViaEmail",
                shareviamessage:"shareViaMessage"
            }

        }
    },

    /**
     * Called when user click on cancel button in contact list 
     * @method
     */
    backToMapView: function () {
        var mapview = this.getMapView();
        Ext.Viewport.setActiveItem(mapview);

    },

    /**
     * Called when user click on message button in contact list 
     * @method
     */
    shareViaMessage: function (selectedPhoneNumbersArray) {
        this.backToMapView();
        if (selectedPhoneNumbersArray.length > 0) {

            var panel = this.getThankPanel();
            if (panel == null) {
                panel = Ext.create('DoctorsNearMe.view.ThanksForSharing');
                Ext.Viewport.add(panel);
            }
            var numbers = selectedPhoneNumbersArray.join(",");
            
            window.plugins.socialsharing.shareViaSMS('Doctors Near Me', numbers, function (msg) { console.log('ok: ' + msg) }, function (msg) { alert('error: ' + msg) })

            panel.dissapear();
        }
   },

    /**
     * Called when user click on email button in contact list 
     * @method
     */
    shareViaEmail: function (selectedEmailsArray) {
        console.log("inside send mail");
        if (selectedEmailsArray.length > 0) {
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

            //Ext.Viewport.setActiveItem(me.getMapView());
            
            panel.dissapear();
        }
        this.backToMapView();
    }
})