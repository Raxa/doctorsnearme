/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Location',

        //test
        service: null,
        searchCount: 0
        //test
    },

    //populate: function (latLng, type, radius, map) {
    //    console.log("inside store");
    //    this.removeAll();
    //    this.fireEvent('storecleared');
    //    var request = {
    //        location: latLng,
    //        radius: radius,
    //        types: [type]
    //    };

    //    var service = new google.maps.places.PlacesService(map.getMap());

    //    var me = this;

    // //   var detailRequest;
    //    service.nearbySearch(request, function (results, status) {
    //        console.log("inside nearbysearch");
    //        console.log(results);

    //        if (status == google.maps.places.PlacesServiceStatus.OK) {
    //            for (var i = 0; i < results.length; i++) {
                    
    //                //detailRequest = {
    //                //    reference: results[i].reference
    //                //};
    //                console.log(results.length);
    //                console.log("refrence " + i + ": " + results[i].reference);
    //                service.getDetails(
    //                    {
    //                        reference: results[i].reference,
    //                        key:'AIzaSyCz2FbWnJQh8hez_0fQ7J-QvE7jzCvWSgw&'
    //                    }, function (place, status1) {
    //                    console.log("test...............");
    //                    if (status1 == google.maps.places.PlacesServiceStatus.OK) {

    //                        me.add(place);
    //                        console.log("done");
    //                        me.fireEvent("locationadded");
    //                    }
    //                    else {
    //                        console.log("failed");
    //                        console.log(status1);
    //                    }
    //                });
    //            }

    //           // me.fireEvent("locationadded");
    //        }

    //    });
    //},


    populate: function (latLng, type, radius, map, keywords) {
        //test
        this.setSearchCount(this.getSearchCount() + 1);
        var searchCount = this.getSearchCount();
        //test
        console.log("inside store");
        console.log(keywords);
        console.log(this.getRange());
        console.log("map:");
        console.log(map);
        console.log("type:" + type);
        console.log("radius:" + radius);
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
                    me.getPlaceDetails(service, results, 0,searchCount);
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
                        me.getPlaceDetails(service, results, 0);
                    }

                });
            });
           
        }

      
        //   var detailRequest;
        //service.nearbySearch(request, function (results, status) {
        //  service.textSearch(request, function (results, status) {
      
    },

    /*populate: function (latLng, type, radius, map,keywords) {
        console.log("inside store");
        console.log(keywords);
        console.log(this.getRange());

        this.storeClear();

        var request;
        if (type == 'pharmacy' || keywords.length==0) {
            request = {
                location: latLng,
                radius: radius,
                types: [type]
            };
        } else {
            console.log("inside else");
            request = {
                location: latLng,
                // location: new google.maps.LatLng(9.877965, 77.025521),
                radius: radius,
                //radius: 500,
                types: [type],
                keyword: keywords
               // query:'cardiology doctor'
            };
        }

        var service = new google.maps.places.PlacesService(map.getMap());

        var me = this;

        //   var detailRequest;
        //service.nearbySearch(request, function (results, status) {
       //  service.textSearch(request, function (results, status) {
        service.radarSearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("no of results: " + results.length);
                me.getPlaceDetails(service, results, 0);
            }

        });
    },*/

    storeClear: function(){
        this.removeAll();
        console.log(this.getRange());
        this.fireEvent('storecleared');
    },

    addItem: function(record){
        this.add(record);
        if (this.isFavorite(record.reference)) {
            //place.isFavorite=true;
            console.log("favorite found");
            this.last().set('isFavorite', true);
            //this.findRecord('reference', record.reference).set('isFavorite', true);
            console.log(this.last());
        }
        this.fireEvent("locationadded");
    },

    addFavoriteItem: function(record){
        this.add(record);
        this.fireEvent("locationadded");
    },

    getPlaceDetails: function (service, results,i,searchCount) {
        var me = this;
        //test
       
        //test
        console.log("test...............");
        service.getDetails(
            {
                reference: results[i].reference,
                //key: 'AIzaSyCz2FbWnJQh8hez_0fQ7J-QvE7jzCvWSgw&'
            }, function (place, status1) {
            if (status1 == google.maps.places.PlacesServiceStatus.OK) {

                me.addItem(place);
               
            }
            else {
                console.log("failed");
                console.log(status1);
            }
            
            });
        // if (i < results.length - 1) {
        //test
        console.log("SearchCount: " + searchCount);
        if (i < results.length - 1 && searchCount==this.getSearchCount()) {
        //test
            Ext.Function.defer(function () {
                me.getPlaceDetails(service, results, i + 1,searchCount)
                //}, 290, me);
            }, 290, me);
            return;

        }
        else {
            console.log("returned..:" + this.getSearchCount());
            return;
        }
    },

    isFavorite:function(reference){
        var currentFav = EasyTreatyApp.config.getFavorites();
        console.log("inside is favorite");
        console.log(reference);
        var newArray = Ext.Array.filter(currentFav, function (item) {
            console.log(item.reference);
            if (item.reference == reference) {
                console.log("equal!!!!!!!!!!!!");
                return true;
            }
        });

        if (newArray.length != 0) {
            console.log("length not zero");
            return true;
        }
    },
    //use if you are going to make the request when clicking on a marker
    setDetailsForTheRecord: function (map, record, infowindow, marker) {
      //  var service = new google.maps.places.PlacesService(map.getMap());
        var service = this.getService();
        var me = this;

        service.getDetails(
            {
                reference: record.get('reference')
            }, function (place, status) {
            
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                record.set('formatted_address', place.formatted_address);
                record.set('international_phone_number', place.international_phone_number);
                record.set('reviews', place.reviews);
                record.set('opening_hours', place.opening_hours);
                record.set('types', place.types);

                var idString = record.get('id');

                var tpl = record.get('name') + '</br>' + record.get('formatted_address') + '</br><button class="direction" id=' + idString + '>Get Directions</button><button class="more-details" id=' + idString + '>More Details</button>';
                tpl = tpl + '</br><button class="call" type="button"><a href="tel:' + record.get('international_phone_number') + '">Call</a></button>' + record.get('international_phone_number');

                infowindow.setContent('<div class="info-window">' + tpl + '</div>')
                infowindow.open(map.getMap(), marker);
            }
            else {
                console.log("failed");
                console.log(status1);
            }
        });
    }


});