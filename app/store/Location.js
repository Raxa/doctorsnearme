/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Location',        
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

    populate: function (latLng, type, radius, map) {
        console.log("inside store");
       
        console.log(this.getRange());

        this.storeClear();

        var request = {
            location: latLng,
           // location: new google.maps.LatLng(9.877965, 77.025521),
            radius: radius,
            //radius: 50000,
            types: [type]
        };

        var service = new google.maps.places.PlacesService(map.getMap());

        var me = this;

        //   var detailRequest;
        service.nearbySearch(request, function (results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("no of results: " + results.length);
                me.getPlaceDetails(service, results, 0);
            }

        });
    },

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

    getPlaceDetails: function (service, results,i) {
        var me = this;

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
        if (i < results.length - 1) {
            Ext.Function.defer(function () {
                me.getPlaceDetails(service, results, i + 1)
                //}, 290, me);
            }, 290, me);
            return;

        }
        else {
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
        var service = new google.maps.places.PlacesService(map.getMap());

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
    },

    applySpecialtyFilter: function (specialty) {

        this.filterBy(function (record) {

            if (Ext.Array.contains(record.specialty,specialty)) {
                return true;
            }
        });
    }


});