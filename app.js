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
    name: 'DoctorsNearMe',

    requires: [
        'Ext.MessageBox',
        'DoctorsNearMe.config.Runtime',
        'DoctorsNearMe.math.Algorithms'
    ],

    views: ['LocationMap','MapView','Menu','ListView','DetailsView'],
    
    controllers:['MapView','DetailsView','Menu','Login','Language'],
    
    stores: ['Location', 'Memory', 'Comment','Language','Specialization'],
    
    models: ['Location', 'Memory', 'Comment'],

    icon: {
        '57': 'resources/icons/AppIcon.png',
        '72': 'resources/icons/AppIcon~ipad.png',
        '114': 'resources/icons/AppIcon@2x.png',
        '144': 'resources/icons/AppIcon~ipad@2x.png'
    },

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png',
        '640x1096': 'resources/startup/640x1096.png'
    },

    isIconPrecomposed: true,

    launch: function () {

        Ext.Viewport.innerElement.addCls('viewport-inner');

        // Destroy the #appLoadingIndicator element
      
     /*   Ext.Function.defer(function () {
            Ext.fly('splash').destroy();
            Ext.fly('bluespin').destroy();

            DoctorsNearMe.config.setLanguage(EN);

            //create slide menu
            var menu = Ext.create('DoctorsNearMe.view.Menu');
            Ext.Viewport.add(menu);

            //create mapview
            var mapView = Ext.create('DoctorsNearMe.view.MapView');
            Ext.Viewport.add(mapView);
            Ext.Viewport.setActiveItem(mapView);

            //create favorites store
            var favoritesStore = Ext.create('DoctorsNearMe.store.Memory', {
                storeId: 'fav-store'
            });

            //load from local storage
            favoritesStore.load();

            //store favorites from local storage in a runtime variable
            var currentFavorites = DoctorsNearMe.config.getFavorites();
            favoritesStore.getRange().forEach(function (record) {
                currentFavorites.push(Ext.JSON.decode(record.get('query')));
            });
        }, 500);*/

            DoctorsNearMe.config.startApp();
        
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
