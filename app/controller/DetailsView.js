/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.DetailsView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            detailsView: 'detailsview',
            mapView: 'mapview',
            userProfile: 'userprofile'
        },
        control: {
            detailsView: {
                back: "backToMapView"
            },
            userProfile: {
                back: "backToMapView"
            }

        }
    },
    
    backToMapView: function () {
            var mapview = this.getMapView();
            Ext.Viewport.setActiveItem(mapview);
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