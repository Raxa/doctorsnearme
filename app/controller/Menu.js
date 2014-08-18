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

    /*
     * Executed when an option is selected from sharing option list
     * @method
     * @param {String} type
     * @private
     */
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
                window.plugins.socialsharing.shareViaFacebook('Try Doctors Near Me!', null, null, function () { console.log('share ok') }, function (errormsg) { alert(errormsg) });
                break;
            case 'TWITTER':
                window.plugins.socialsharing.shareViaTwitter('Try Doctors Near Me!', null, 'http://www.test.com')
                break;
        }
    },

    /*
     * Executed when user clicks tell a friend button on menu
     * @method
     * @private
     */
    share: function(){

        var sharelist= this.getShareList();
        if (sharelist == null) {
            sharelist = Ext.create('DoctorsNearMe.view.SharingOptionsList');
            Ext.Viewport.add(sharelist);
        }
        
        sharelist.show()
    },

    /*
     * Toggle split lines and horizontal lines on toolbar
     * @method
     * @private
     */
    onMenuToggle: function () {
        console.log("on menu toggle");
        if (this.getMapView()!=null)
        this.getMapView().toggleToolbarMoreImage();
    },

    /*
     * Executed when clicking on saved button
     * @method
     * @private
     */
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
        mapview.getSearchToolbar().setHidden(true);
        mapview.getSpecialtySelectField().setHidden(true);
        mapview.getLocator().setHidden(true);

        this.getSideMenu().toggle();

    },

    /*
     * Executed when a check box is checked on menu(hospital,doctors or pharmacy)
     * @method
     * @param {Integer} choice
     * @private
     */
    onChoice: function (choice) {
        console.log("inside onchoice menu controller");
        this.getMapView().setCurrentSearch(choice);
    },

    /*
     * Executed when a slider value changes
     * @method
     * @param {Integer} newRadius
     * @private
     */
    onSearchRadiusChange: function (newRadius) {
        console.log("on search radius change");
        this.getMapView().setSearchRadius(newRadius*1000);
    },

    /*
     * Executed when specialty choice changes
     * @method
     * @param [String] newSpecialtyArray
     * @private
     */
    onSpecialtyChange: function (newSpecialtyArray) {
        this.getMapView().setSpecialties(newSpecialtyArray);
    }
 

})