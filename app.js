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
    
    stores: ['Location', 'Memory', 'Comment'],
    
    models: ['Location', 'Memory', 'Comment'],

    icon: {
        '57': 'resources/icons/AppIcon.png',
        '72': 'resources/icons/AppIcon~ipad.png',
        '114': 'resources/icons/AppIcon@2x.png',
        '144': 'resources/icons/AppIcon~ipad@2x.png'
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

    launch: function () {

        Ext.Viewport.innerElement.addCls('viewport-inner');

        // Destroy the #appLoadingIndicator element
      
        Ext.fly('splash').destroy();
        Ext.fly('bluespin').destroy();

        Ext.require('Ext.device.Connection');

        if (Ext.device.Connection.getType() == 'NONE') {
            Ext.Msg.alert("Please Connect to internet");
        }
        

       //create slide menu
       var menu = Ext.create('EasyTreatyApp.view.Menu');
       Ext.Viewport.add(menu);

        //create mapview
        var mapView = Ext.create('EasyTreatyApp.view.MapView');
        Ext.Viewport.add(mapView);
        Ext.Viewport.setActiveItem(mapView);

        //create favorites store
        var favoritesStore = Ext.create('EasyTreatyApp.store.Memory', {
            storeId:'fav-store'
        });

        //load from local storage
        favoritesStore.load();

        //store favorites from local storage in a runtime variable
        var currentFavorites = EasyTreatyApp.config.getFavorites();
        favoritesStore.getRange().forEach(function (record) {
            currentFavorites.push(Ext.JSON.decode(record.get('query')));
        });
        
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
