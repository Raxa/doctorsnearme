/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Location',
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
            radius: radius,
            types: types,
            query:query
        }, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("no of results: " + results.length);
                Ext.Array.forEach(results, function (place) {
                    me.addItem(place);
                });
                me.getPlaceDetails(results, 0, searchCount);
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
                    me.getPlaceDetails(results, 0,type,searchCount);
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
                        me.getPlaceDetails(results, 0,type);
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

    addItem: function (record) {
        
        this.add(record);
        //  if (this.isFavorite(record.reference)) {
        if (this.isFavorite(record.place_id)) {
            //place.isFavorite=true;
            this.last().set('isFavorite', true);
            //this.findRecord('reference', record.reference).set('isFavorite', true);
        }

        if (EasyTreatyApp.config.getLoggedIn()) {
            this.isLiked(record);
        }

        this.fireEvent("locationadded");        
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
            url: EasyTreatyApp.config.getRatingServerDomain() + 'checkLike',
            method: 'GET',
            params: {
                // location: record.id,
                location: record.place_id,
                user: EasyTreatyApp.config.getUser().get('personUuid')
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
                Ext.Msg.alert("like failure");
                console.log("failure");
                console.log(response);
            }
        });
    },

    isFavorite:function(reference){
        var currentFav = EasyTreatyApp.config.getFavorites();

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

    getPlaceDetails: function (results, i,type,searchCount) {
        var me = this;
        
        var service = this.getService();
        service.getDetails(
            {
                placeId: results[i].place_id,
                //key: 'AIzaSyCz2FbWnJQh8hez_0fQ7J-QvE7jzCvWSgw&'
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
                    console.log("failed");
                    console.log(status1);
                }

            });
        if (i < results.length - 1 && searchCount == this.getSearchCount()) {
            //test
            Ext.Function.defer(function () {
                me.getPlaceDetails(results, i + 1,type)
                //}, 290, me);
            }, 290, me);
            return;

        }
        else {
            if (type == 'doctor') {
                me.checkForRaxaDoctors();
            }               
            return;
        }
    },

    checkForRaxaDoctors: function () {
        console.log("inside check for raxa doctors");
        var raxaStore = Ext.data.StoreManager.lookup('raxadoctor-store');
        var lat, lng, me = this;

        console.log("count in eaxa doctor store:"+raxaStore.getAllCount());
        raxaStore.getRange().forEach(function (record) {

            if (me.getCount() > 0) {
                console.log("count > 0");
                me.findByName(record);
            }

        });


    },

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

                    me.fireEvent('detailsset',record);

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
                console.log(status1);
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
            url: EasyTreatyApp.config.getRatingServerDomain() + 'like',
            method: 'GET',
            params: {
                location: id,
                user: EasyTreatyApp.config.getUser().get('personUuid'),
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
    },

   //not used because search happens by sending city so all the results are not loaded.
   /* filterByDistance: function (lat, lng) {
        var recLat, recLng, distance,minDistance = 1;
        this.filterBy(function (record, id) {
            recLat = record.get('geometry').location.k;
            recLng = record.get('geometry').location.B;
            console.log(record);
            console.log(lat + " " + lng);
            console.log(recLat+" "+recLng);
            distance = EasyTreatyApp.math.distanceCalculator(lat, lng, recLat, recLng, 'K');
            console.log("distance: "+distance);
            if (distance < minDistance) {
                return true;
            }
        });
    },*/

    findByName: function (record) {
        
        var name, splittedArray, designation;
        var raxaDoctorName = record.get('name'),raxaUuid= record.get('uuid')
        //split by space
        var splitted = raxaDoctorName.split(" ", 5);
        console.log(raxaDoctorName);
        var firstName = splitted[1];
        var lastName = splitted[splitted.length - 1];
        var value = this.findBy(function (record, id) {
            name = record.get('name');
            //name can be null if by any chance record is not filled
            if (name != null) {
                splittedArray = name.split(" ", 5);
                if (splittedArray.length >= 3 && splitted.length>=3) {
                    designation = splittedArray[0].toUpperCase();
                    console.log("designation:" + designation);
                    if (designation == 'DR.' || designation == 'DR') {
                        console.log("designation is DR");
                        if (splittedArray[1].toUpperCase() == firstName.toUpperCase() && splittedArray[splittedArray.length - 1].toUpperCase() == lastName.toUpperCase()) {
                            record.set('isRaxaDoctor', true);
                            record.set('raxa_uuid', raxaUuid);
                            return true;
                        }
                    }
                }
               
            }
            
        });

        console.log("value:" + value);
        var newRecord;

        //if no merge happened
        if (value == -1) {
            console.log("value is -1");
            newRecord = {
                id: record.get('id'),
                name: record.get('name'),
                formatted_address: record.get('address1'),
                geometry: {location:new google.maps.LatLng(record.get('latitude'), record.get('longitude'))},
                international_phone_number: null,
                reviews: null,
                opening_hours: null,
                types: 'doctor',
                specialty: null,
                isFavorite: false,
                likeCount: 0,
                isLiked: false,
                place_id: record.get('uuid'),
                isRaxaDoctor: true,
                raxa_uuid: record.get('uuid')
            };

            console.log(newRecord);

            this.addItem(newRecord);
        }


    }



});