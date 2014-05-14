/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.Map', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            detailsView: 'detailsview'
        },
        control: {
            mapView: {
                moredetails: "onMoreDetailsButtonTap",
                
                getdirections: "onGetDirectionsButtonTap"
            }
        }
        
    },

    /**
     * Call the calcRoute() of MapPanel
     * @method
     * @private
     */
    onGetDirectionsButtonTap: function(mapView,mapPanel, id) {
        console.log(" onGetDirectionsButtonTap");
        var data = this.getRecordData(mapView, id);
        var latLng = new google.maps.LatLng(data.latitude, data.longitude);

        mapPanel.calcRoute(mapPanel.getRelativeLocation(), latLng, mapPanel.down('map').getMap());
    },
   
    /**
     * go to DetailsView
     * @method
     * @private
     */
    onMoreDetailsButtonTap: function (mapView, id) {

        var data = this.getRecordData(mapView, id);

        var phoneNumber = 'Not Available';

        var pn = data.phoneNumber;
        if (pn != null) {
            phoneNumber = pn;
        }

        var locObj = { name: data.name, address: data.address1, distance: data.distance ,phoneNumber:phoneNumber};

        var detailsView = this.getDetailsView();
        
        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView');
        }

        detailsView.setData(locObj);
        detailsView.setViaMap(true);

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
    },
    
    /**
     * get store data accoring to the current search
     * @method
     * @private
     */
    getRecordData: function(mapView, id) {
        var storeToUse;
        var currentSearch = mapView.getCurrentSearch();

        switch (currentSearch) {
            case 0:
                storeToUse = mapView.getLocStore();
                break;
            case 1:
                storeToUse = mapView.getDocStore();
                break;
            case 2:
                storeToUse = mapView.getPharmacyStore();
                break;
        }

        var record = storeToUse.getById(id);
        console.log("record.getData");
        console.log(record.getData());
        return record.getData();
    }
    
});