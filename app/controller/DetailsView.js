/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.controller.DetailsView', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            detailsView: 'detailsview',
            mapView: 'mapview',
            userProfile: 'userprofile',
            listView:'listview'
        },
        control: {
            detailsView: {
                back: "backToMapView",
                comment: "comment",
                like: "like",
                togglefavorite: "onFavoriteToggle"
            },
            userProfile: {
                back: "backToMapView"
            }

        }
    },

    /**
     * Called when user clicks save button in details view 
     * @method
     * @private
     */
    onFavoriteToggle: function (recordId, isFavorite) {
        var store = Ext.data.StoreManager.lookup('fav-store');

        var record = this.getMapView().getStore().findRecord('place_id', recordId);

        var string;

        //if the place is marked favorite, get it from store and mark it as favorite
        //then store it in lcal storage
        if (isFavorite) {
            record.set('isFavorite', true);

            string = Ext.JSON.encode(record.getData());
            store.storeTokenInLocalStorage(string);
            DoctorsNearMe.config.getFavorites().push(record.getData());
        }
            //if not set it to false if it is in store(the mapview store)
        else {

            if (record != null) {
                record.set('isFavorite', false);
            }
            
            var theItem;
            var newFav= Ext.Array.filter(DoctorsNearMe.config.getFavorites(), function (item) {
                if (item.place_id != recordId) {
                    return true;
                } 
            });

            diffArray = Ext.Array.difference(DoctorsNearMe.config.getFavorites(), newFav);
            if (diffArray != null && diffArray.length > 0) {
                theItem = diffArray[0];
                var string = Ext.JSON.encode(theItem);
                store.removeTokenFromLocalStorage(string);
            }
            

            DoctorsNearMe.config.setFavorites(newFav);
        }

       var listStore = this.getListView().getItemList().getStore()
       listStore.removeAll();
        Ext.Array.forEach(DoctorsNearMe.config.getFavorites(), function (item) {
            listStore.add(item);
        })

        this.getListView().fillList();
    },

    /**
     * Called when user clicks on like button in details view 
     * @method
     * @private
     */
    like: function (like,detailsView) {
        this.getMapView().getStore().like(like, detailsView.getData().place_id, null, detailsView);

    },

    /**
     * Called when user put a comment and click on review button
     * @method
     * @private
     */
    comment: function (commentField, detailsView) {
        console.log("inside comment");
        var me = this;
        var comment = commentField.getValue();

        if (comment.replace(/\s/g, '').length) {
            Ext.Ajax.request({
                // Ext.data.JsonP.request({
                // url: 'http://192.168.122.1:8888/comment',
                url:DoctorsNearMe.config.getRatingServerDomain()+'comment',
                method: 'GET',
                params: {
                    //  location: detailsView.getData().id,
                    location: detailsView.getData().place_id,
                    user: DoctorsNearMe.config.getUser().get('personUuid'),
                    comment: commentField.getValue(),
                    userName: DoctorsNearMe.config.getUser().get('display')
                },
                success: function (response, opts) {
                    console.log("success");
                    console.log(response.responseText);
                    commentField.setValue("");
                    detailsView.reloadCommentStore();
                },
                failure: function (response, opts) {
                    console.log("failure");
                    console.log(response);
                }
            });
        } 
        
    },

    /**
     * Called when user click on back button in details view 
     * @method
     * @private
     */
    backToMapView: function () {
            var mapview = this.getMapView();
            Ext.Viewport.setActiveItem(mapview);
       
    }
})