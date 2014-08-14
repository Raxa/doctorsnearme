/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Location',
        service: null,
        storeId: 'location-store',
        searchCount:0
    },

    textSearch: function (latLng, types, radius, map, query) {
        this.setSearchCount(this.getSearchCount() + 1);
        var searchCount = this.getSearchCount();
        var service = new google.maps.places.PlacesService(map.getMap());
        var me = this;

        this.storeClear();
        service.textSearch({
            location: latLng,
            //radius: radius,
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
                me.getPlaceDetails(results, 0,searchCount);
            } else {
                console.log("status:"); console.log(status);
            }

        });
    },

    radarSearch: function (latLng, type, radius, map, keywords) {
        this.setSearchCount(this.getSearchCount() + 1);
        var searchCount = this.getSearchCount();
        this.storeClear();

        var request;
        var service = new google.maps.places.PlacesService(map.getMap());
        var me = this;

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
                    console.log(results[0]);
                    me.getPlaceDetails(results, 0, searchCount);
                } else {
                    console.log("status:"); console.log(status);
                }

            });
        } else {
            console.log("inside else");

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

                        //trying filling store early
                        me.getPlaceDetails(results, 0,searchCount);
                    }

                });
            });

        }
    },

    storeClear: function(){
        this.removeAll();
        console.log(this.getRange());
        this.fireEvent('storecleared');
    },

    addItem: function(record,isTextSearch){
        this.add(record);
        //  if (this.isFavorite(record.reference)) {
        if (this.isFavorite(record.place_id)) {
            //place.isFavorite=true;
            this.last().set('isFavorite', true);
            //this.findRecord('reference', record.reference).set('isFavorite', true);
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

    isLiked: function(record){
        var me = this;
        Ext.Ajax.request({
            // url: 'http://localhost:8888/checkLike',
            // url: 'http://192.168.122.1:8888/checkLike',
            url: DoctorsNearMe.config.getRatingServerDomain() + 'checkLike',
            method: 'GET',
            params: {
                // location: record.id,
                location: record.place_id,
                user: DoctorsNearMe.config.getUser().get('personUuid')
            },
            success: function (response, opts) {
                // Ext.Msg.alert("like success");
                console.log("success");
                console.log(response);
                // var like = Ext.JSON.decode(response.responseText).likes;
                var like = null;
                var data = Ext.JSON.decode(response.responseText).data[0];
                if (data != null) {
                    like = data.status;
                }
                console.log("like: " + like);

                if (like == 1) {
                    //record.set('isLiked', true);
                    record.isLiked = true;
                } else {
                    // record.set('isLiked', false);
                    record.isLiked = false;
                }

            },
            failure: function (response, opts) {
               // Ext.Msg.alert("like failure");
                console.log("failure");
                console.log(response);
            }
        });
    },

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

    getPlaceDetails: function (results, i,  searchCount) {
        console.log("new one"+searchCount);
        var me = this;
        
        var service = this.getService();
        service.getDetails(
            {
                placeId: results[i].place_id,
                //key: 'AIzaSyCz2FbWnJQh8hez_0fQ7J-QvE7jzCvWSgw&'
            }, function (place, status1) {
                if (status1 == google.maps.places.PlacesServiceStatus.OK) {
                    //console.log(place);
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
                    console.log("failed");
                    console.log(status1);
                }

            });
        if (i < results.length - 1 && searchCount == this.getSearchCount()) {
            //test
            Ext.Function.defer(function () {
                me.getPlaceDetails(results, i + 1,searchCount)
                //}, 290, me);
            }, 290, me);
            return;

        }
        else {               
            return;
        }
    },
    //OK Im using again
    //NOT USED NOW. THE EVENT INSIDE THIS IS NOW FIRED INSIDE setDetailsForTheRecord FUNCTION. IF YOU ARE GONNA USE THIS AGAIN PUT ANOTHER EVENT NAME
    //this was added to set details for the record before going to next location by the forward button in details view
    setDetails: function(record){
        var service = this.getService();
        var me = this;

        service.getDetails(
            {
                //reference: record.get('reference')
                placeId:record.get('place_id')
            }, function (place, status) {

                if (status == google.maps.places.PlacesServiceStatus.OK) {                 

                    //Put these here to make infowindow popup soon.
                    record.set('name', place.name);
                    record.set('formatted_address', place.formatted_address);
                    record.set('international_phone_number', place.international_phone_number);
                    record.set('reviews', place.reviews);
                    record.set('opening_hours', place.opening_hours);
                    record.set('types', place.types);

                    me.fireEvent('detailssetfordetailsview',record);

                }
                else {
                    console.log("failed");
                    console.log(status);
                }
            });
    },

    //USED IF THERE IS A RECORD THAT HASN'T BEEN SET DUE TO OVER QUERY LIMIT
    //use if you are going to make the request when clicking on a marker
    setDetailsForTheRecord: function (record,  marker) {
      //  var service = new google.maps.places.PlacesService(map.getMap());
        var service = this.getService();
        var me = this;

        service.getDetails(
            {
                //reference: record.get('reference')
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

    //this is called when logging in
    setLikeForRecords: function () {
        var me = this;
        this.getRange().forEach(function (record) {
            me.isLiked(record.getData());
        })
    },

    like: function (like,id,button,detailsView) {
        console.log("inside like");
        var me = this;
        var record;
        Ext.Ajax.request({
            // Ext.data.JsonP.request({
            // url: 'http://192.168.122.1:8888/like',
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
                // record = me.getById(id);
                record = me.findRecord('place_id', id);
                console.log(record);
                record.set('isLiked', like);

                // var likeButton = Ext.get(id + '-like');
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