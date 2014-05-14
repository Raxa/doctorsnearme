/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.ListView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            detailsView: 'detailsview',
            listView:'listview'
        },
        control: {
            listView: {
                back: "onBackButtonTap",
                itemselected: "onLocationSelect",
                sortondistance:"onDistanceSort"
            }

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
    },
    
    /*
    * Executed when an item is selected in List view
    */
    onLocationSelect: function (id) {
        console.log("on location select");
        var mapView = this.getMapView();
        var data = this.getRecordData(mapView, id);

        var phoneNumber = 'Not Available';

        var pn = data.phoneNumber;
        if (pn != null) {
            phoneNumber = pn;
        }

        var locObj = { name: data.name, address: data.address1, distance: data.distance, phoneNumber: phoneNumber };

        var detailsView = this.getDetailsView();

        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView');
        }

        detailsView.setData(locObj);
        detailsView.setViaMap(false);

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
    },
    
    /**
    * get store data accoring to the current search
    * @method
    * @private
    */
    getRecordData: function (mapView, id) {
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
    },

    /*
    * Executed when Distance button is tapped
    */
    onDistanceSort: function(listView,listData) {
        console.log("on distance sort");

        var sorted = EasyTreatyApp.math.mergeSort(listData);
        listView.setListData(sorted);
    }

})