/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.ProfileView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            userProfile: 'userprofile',
            detailsView: 'detailsview',
            listView:'listview'
        },
        control: {
            userProfile: {
                back: "onBackButtonTap"
            },
            detailsView: {
                //back: "onBackButtonTap"
                back: "switchAccordingly"
            }

        }
    },
    
    switchAccordingly: function(viaMap) {
        if (viaMap) {
            this.onBackButtonTap();
        } else {
            var listview = this.getListView();
            Ext.Viewport.add(listview);
            Ext.Viewport.setActiveItem(listview);
        }
    },

    /**
     * go back to MapView
     * @method
     * @private
     */
    onBackButtonTap: function () {
        var mapview = this.getMapView();

        if (mapview === null) {
            mapview = Ext.create('EasyTreatyApp.view.MapView');
        }

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    }

})