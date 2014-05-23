/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.MapView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapView: 'mapview',
            menu:'mainmenu'
        },
        control: {
            mapView: {
                showmenu: "showMenu",
                choicedone:"onChoice"
            }
        }
        
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
        mapview.getStore().populate(base, type, 5000000, locationmap);
    }
});