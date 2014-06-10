/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/


Ext.application({
    name: 'EasyTreatyApp',

    requires: [
        'Ext.MessageBox',
        'EasyTreatyApp.config.Runtime',
        'EasyTreatyApp.math.Algorithms'
    ],

    views: ['LocationMap','MapView','Menu','ListView','DetailsView'],
    
    controllers:['MapView','DetailsView','Menu','Login','Language'],
    
    stores: ['Location','Memory'],
    
    models: ['Location','Memory'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        
        //var myMap = Ext.create('EasyTreatyApp.view.LocationMap');
        //Ext.Viewport.add(myMap);
        var menu = Ext.create('EasyTreatyApp.view.Menu');
        Ext.Viewport.add(menu);

        var mapView = Ext.create('EasyTreatyApp.view.MapView');
        Ext.Viewport.add(mapView);
        Ext.Viewport.setActiveItem(mapView);

        var favoritesStore = Ext.create('EasyTreatyApp.store.Memory', {
            storeId:'fav-store'
        });

        favoritesStore.load();

        var currentFavorites = EasyTreatyApp.config.getFavorites();
        favoritesStore.getRange().forEach(function (record) {
            currentFavorites.push(Ext.JSON.decode(record.get('query')));
        });
        
        console.log("current favorites");
        console.log(currentFavorites);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
