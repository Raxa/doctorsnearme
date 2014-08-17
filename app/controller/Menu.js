/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.Menu', {
    extend: 'Ext.app.Controller',
    
    config: {
        
        refs:
        {
            sideMenu: 'mainmenu',
            mapView: 'mapview',
            userProfile: 'userprofile',
            listView: 'listview',
            contactList: 'contactlist',
            shareList:'sharelist'
        },
        
        control: {            
            sideMenu: {
                searchradiuschange: "onSearchRadiusChange",
                specialtychange: "onSpecialtyChange",
                choice: "onChoice",
                showfavorites: "onShowFavorites",
                menutoggled: "onMenuToggle",
                share:"share"
            },
            shareList: {
                share:"tellFriends"
            }
        }
    },

    tellFriends:function(type){
        switch (type) {
            case 'EMAIL':
                var contactList = this.getContactList();
                contactList.setActiveType('E');
                Ext.Viewport.setActiveItem(contactList);
                break;
            case 'MESSAGE':
                var contactList = this.getContactList();
                contactList.setActiveType('M');
                Ext.Viewport.setActiveItem(contactList);
                break;
            case 'FACEBOOK':
               // Ext.Msg.alert("facebook");
                window.plugins.socialsharing.shareViaFacebook('Try Doctors Near Me!', null, null, function () { console.log('share ok') }, function (errormsg) { alert(errormsg) });
                break;
            case 'TWITTER':
                window.plugins.socialsharing.shareViaTwitter('Try Doctors Near Me!', null, 'http://www.test.com')
                break;
        }
    },

    share: function(){
        //  Ext.Viewport.setActiveItem(this.getContactList());

        var sharelist= this.getShareList();
        if (sharelist == null) {
            sharelist = Ext.create('DoctorsNearMe.view.SharingOptionsList');
            Ext.Viewport.add(sharelist);
        }
        
        sharelist.show()
    },

    onMenuToggle: function () {
        console.log("on menu toggle");
        if (this.getMapView()!=null)
        this.getMapView().toggleToolbarMoreImage();
    },

    onShowFavorites: function () {
        console.log("on show favorites");
        var store = Ext.data.StoreManager.lookup('fav-store');

        store.load();

        var mapview = this.getMapView();
        var listview = this.getListView();
        var favStore = listview.getItemList().getStore();

        var location;
        store.getRange().forEach(function (record) {
            location = Ext.JSON.decode(record.get('query'));
            console.log("decoded...");
            console.log(location);
            favStore.add(location);
        });

        listview.fillList();

        mapview.setActiveItem(1);
        //  mapview.getSearchField().setHidden(true);
        mapview.getSearchToolbar().setHidden(true);
        mapview.getSpecialtySelectField().setHidden(true);
        mapview.getLocator().setHidden(true);

        this.getSideMenu().toggle();

    },

    onChoice: function (choice) {
        console.log("inside onchoice menu controller");
        this.getMapView().setCurrentSearch(choice);
    },

    onSearchRadiusChange: function (newRadius) {
        console.log("on search radius change");
        this.getMapView().setSearchRadius(newRadius*1000);
    },

    onSpecialtyChange: function (newSpecialtyArray) {
        this.getMapView().setSpecialties(newSpecialtyArray);
    }
 

})