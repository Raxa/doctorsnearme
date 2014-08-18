/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Location',
        /**
         * cfg {PlacesService} Google places service 
         */
        service: null,
        storeId: 'location-store',

        /**
         * cfg {Integer} This is to keep track of how many times search happened. If user performs a search
         *  while a set of detailed requests are going on inside callback function this is incremented and
         * the older requests set will terminate 
         */
        searchCount:0
    },

    /*
    * Free text search. Uses Google places free text search option
    * @method
    */
    textSearch: function (latLng, types, radius, map, query) {
        this.setSearchCount(this.getSearchCount() + 1);
        var searchCount = this.getSearchCount();
        var service = new google.maps.places.PlacesService(map.getMap());
        var me = this;

        this.storeClear();
        service.textSearch({
            location: latLng,
            radius:100000,
            types: types,
            query:query
        }, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("no of results: " + results.length);
                Ext.Array.forEach(results, function (place) {
                    //second parameter is to say this is text search. this is needed to put the proper marker icon
                    me.addItem(place, true);
                });
                //details are filled in the background 
                me.getPlaceDetails(results, 0,searchCount);
            } else {
                //console.log("status:"); console.log(status);
            }

        });
    },

    /*
    * Radar search. Uses Google places radar search option
    * @method
    */
    radarSearch: function (latLng, type, radius, map, keywords) {
        this.setSearchCount(this.getSearchCount() + 1);
        var searchCount = this.getSearchCount();
        this.storeClear();

        var request;
        var service = new google.maps.places.PlacesService(map.getMap());
        var me = this;

        //if its pharmacy no need of specialty filters therefore no keywords
        if (type == 'pharmacy' || keywords.length == 0) {
            console.log("pharmacy or zero keywords");
            service.radarSearch({
                location: latLng,
                radius: radius,
                types: [type]
            }, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    console.log("no of results: " + results.length);
                    Ext.Array.forEach(results, function (place) {
                        me.addItem(place);
                    });
                    //details are filled in the background 
                    me.getPlaceDetails(results, 0, searchCount);
                } else {
                   // console.log("status:"); console.log(status);
                }

            });
        } else {
            console.log("inside else");
            //if its not pharmacy a search should happen for each keyword
            Ext.Array.forEach(keywords, function (keyword) {

                service.radarSearch({
                    location: latLng,
                    radius: radius,
                    types: [type],
                    keyword: keyword
                }, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log("no of results: " + results.length);
                        Ext.Array.forEach(results, function (place) {
                            me.addItem(place);
                        });

                        //details are filled in the background 
                        me.getPlaceDetails(results, 0,searchCount);
                    }

                });
            });

        }
    },

    /*
    * Clear the store
    * @method
    */
    storeClear: function(){
        this.removeAll();
        console.log(this.getRange());
        this.fireEvent('storecleared');
    },

    /*
    * Add an item to the store. 
    * @method
    */
    addItem: function(record,isTextSearch){
        this.add(record);

        if (this.isFavorite(record.place_id)) {

            this.last().set('isFavorite', true);

        }

        if (DoctorsNearMe.config.getLoggedIn()) {
            this.isLiked(record);
        }

        this.fireEvent("locationadded",isTextSearch);
    },

    addFavoriteItem: function(record){
        this.add(record);
        this.fireEvent("locationadded");
    },

    /*
    * Sends a request to the ratingsServer to see if this place has been liked
    * @method
    */
    isLiked: function(record){
        var me = this;
        Ext.Ajax.request({

            url: DoctorsNearMe.config.getRatingServerDomain() + 'checkLike',
            method: 'GET',
            params: {
                // location: record.id,
                location: record.place_id,
                user: DoctorsNearMe.config.getUser().get('personUuid')
            },
            success: function (response, opts) {

                console.log("success");
                console.log(response);

                var like = null;
                var data = Ext.JSON.decode(response.responseText).data[0];
                if (data != null) {
                    like = data.status;
                }
                console.log("like: " + like);

                if (like == 1) {

                    record.isLiked = true;
                } else {

                    record.isLiked = false;
                }

            },
            failure: function (response, opts) {

               // console.log("failure");
            }
        });
    },

    /*
    * Check inside the favorites to see if this item is a favorite
    * @method
    */
    isFavorite:function(reference){
        var currentFav = DoctorsNearMe.config.getFavorites();

        var newArray = Ext.Array.filter(currentFav, function (item) {

            if (item.place_id == reference) {

                return true;
            }
        });

        if (newArray.length != 0) {
            console.log("length not zero");
            return true;
        }
    },

    /*
    * Runs in background after a search happens, to fill the details of the items in the store.
    * Recursively runs itself with a time delay to avoid overquery limit
    * @method
    */
    getPlaceDetails: function (results, i,  searchCount) {
        console.log("new one"+searchCount);
        var me = this;
        
        var service = this.getService();
        service.getDetails(
            {
                placeId: results[i].place_id

            }, function (place, status1) {
                if (status1 == google.maps.places.PlacesServiceStatus.OK) {

                    var record = me.findRecord('place_id', results[i].place_id);
                    if (record != null) {
                        record.set('name', place.name);
                        record.set('formatted_address', place.formatted_address);
                        record.set('international_phone_number', place.international_phone_number);
                        record.set('reviews', place.reviews);
                        record.set('opening_hours', place.opening_hours);
                        record.set('types', place.types);
                    }

                }
                else {
                   // console.log("failed");
                }

            });
        if (i < results.length - 1 && searchCount == this.getSearchCount()) {

            Ext.Function.defer(function () {
                me.getPlaceDetails(results, i + 1, searchCount)

            }, 290, me);
            return;

        }
        else {               
            return;
        }
    },

    /*
    * Used when filling record separately which had been missed due to OVER_QUERY_LIMIT but needed later
    * @method
    */
    setDetailsForTheRecord: function (record, marker) {

        var service = this.getService();
        var me = this;

        service.getDetails(
            {
                placeId: record.get('place_id')
            }, function (place, status) {
            
                if (status == google.maps.places.PlacesServiceStatus.OK) {

                record.set('name', place.name);
                record.set('formatted_address', place.formatted_address);
                record.set('international_phone_number', place.international_phone_number);
                record.set('reviews', place.reviews);
                record.set('opening_hours', place.opening_hours);
                record.set('types', place.types);

                me.fireEvent('detailsset', record, marker);

            }
            else {
                console.log("failed");
                console.log(status);
            }
        });
    },

    /*
    * Called when logging in, to set liked status
    * @method
    */
    setLikeForRecords: function () {
        var me = this;
        this.getRange().forEach(function (record) {
            me.isLiked(record.getData());
        })
    },

    /*
    * Called when a user likes a place
    * @method
    */
    like: function (like,id,button,detailsView) {
        console.log("inside like");
        var me = this;
        var record;
        Ext.Ajax.request({
            url: DoctorsNearMe.config.getRatingServerDomain() + 'like',
            method: 'GET',
            params: {
                location: id,
                user: DoctorsNearMe.config.getUser().get('personUuid'),
                //like: 1
                like: like==true?1:0
            },
            success: function (response, opts) {
                console.log("like success");
                record = me.findRecord('place_id', id);
                console.log(record);
                record.set('isLiked', like);

                var likeButton = Ext.get(record.get('id') + '-like');
                if (like) {
                    if (detailsView != null) {
                        detailsView.toggleLikeButtonState(like);
                    }
                    if (likeButton != null) {
                        likeButton.removeCls("like");
                        likeButton.addCls("dislike");
                    }
                }
                else {
                    if (detailsView != null) {
                        detailsView.toggleLikeButtonState(like);
                    }
                    if (likeButton != null) {
                        likeButton.removeCls("dislike");
                        likeButton.addCls("like");
                    }

                }                              
                console.log("success");
                console.log(response);
            },
            failure: function (response, opts) {
                console.log("failure");
                console.log(response);
            }
        });
    }


});