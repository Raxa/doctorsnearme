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
                back: "backToMapView",
                showcomments:"showComments"
            },
            userProfile: {
                back: "backToMapView"
            }

        }
    },

    showComments: function(){
        Ext.Ajax.request({
            url: 'http://localhost:8888/getComments',
            method: 'GET',
            params:{
                location:1
            },
            success: function (response, opts) {
                console.log("success");
                console.log(response);

            },
            failure: function (response, opts) {                
                console.log("failure");
                console.log(response);
            }
        });
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