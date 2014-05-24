/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.MapView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            menu: 'mainmenu',
            detailsView: 'detailsview'
        },
        control: {
            mapView: {
                showmenu: "showMenu",
                choicedone: "onChoice",
                itemselected: "onLocationSelect",
                moredetails: "onMoreDetails",
                getdirections: "onGetDirections",
                togglemaplist: "onMapListToggle"
            }
        }
        
    },

    onMapListToggle: function (hide) {
        var menu = this.getMenu();

        menu.getChangeLocationButton().setHidden(hide);
    },

    onMoreDetails: function(map,recordId){
        var record = this.getMapView().getStore().getById(recordId);

        this.onLocationSelect(record);
    },

    /**
     * Call the calcRoute() of MapPanel
     * @method
     * @private
     */
    onGetDirections: function (map, recordId) {
        console.log(" onGetDirectionsButtonTap");
        var record = this.getMapView().getStore().getById(recordId);

        map.calcRoute(map.getBaseLocation(), record.get('geometry').location, map.getMap());
    },

    /*
  * Executed when an item is selected in List view
  */
    onLocationSelect: function (record) {
        console.log("on location select");
       
        var detailsView = this.getDetailsView();

        if (detailsView == undefined) {
            detailsView = Ext.create('EasyTreatyApp.view.DetailsView');
        }

        detailsView.setData(record.getData());

        Ext.Viewport.add(detailsView);
        Ext.Viewport.setActiveItem(detailsView);
    },

    showMenu: function () {
        this.getMenu().toggle();
    },

    onChoice: function (choice) {
        var mapview = this.getMapView();
        var locationmap =mapview.getLocationMap();
        var base = locationmap.getBaseLocation();
        var type;
        switch (choice) {
            case 0: type = 'doctor';
                break;
            case 1: type = 'hospital';
                break;
            case 2: type = 'pharmacy';
                break;
        }

        mapview.getStore().populate(base, type, mapview.getSearchRadius(), locationmap);
    }
});