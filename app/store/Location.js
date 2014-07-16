/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Location',
        service:null
    },

    textSearch: function (latLng, types, radius, map, query) {
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
            } else {
                console.log("status:"); console.log(status);
            }

        });
    },

    radarSearch: function (latLng, type, radius, map, keywords) {
        
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
                    Ext.Array.forEach(results, function (place) {
                        me.addItem(place);
                    });
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
                record.set('name', place.name);
                record.set('formatted_address', place.formatted_address);
                record.set('international_phone_number', place.international_phone_number);
                record.set('reviews', place.reviews);
                record.set('opening_hours', place.opening_hours);
                record.set('types', place.types);

                var idString = record.get('id');

                lang = EasyTreatyApp.config.getLanguage();

                var name = place.name;
                var phoneNumber = place.international_phone_number;
                var idString = place.id;

                var userimg = '<img class="user-img" src="test.png">';

                var moredetails = '<img class="more-details" id =' + idString + ' src = "resources/icons/i_30_30.png">';
                var like = '<button class="like-img like" id=like-' + idString + '>';
                var call = "";
                if (phoneNumber != null) {
                    call = '<img class="call-img" src = "resources/icons/Phone_40_40.png"><button class="call"><a href="tel:' + phoneNumber + '">Call</a></button>';
                }
                var directions = '<button class="direction" id=' + idString + '><img class="direction-img" src = "resources/icons/Arrow_40_40.png">' + lang.GET_DIRECTIONS + '</button>';

                var infowindow = new google.maps.InfoWindow();

               // var tpl = '<table><tr><td>' + userimg + '</td><td>' + doctorname + '</td></tr></table>' + '<table><tr><td>' + call + '</td>' + '<td>' + directions + '</td>' + '</tr>' + '</table>';

                var firstRow = '<div  class="inlineblock">' + userimg + '</div>' +
                         '<div class="inlineblock">' +
                               '<div class="inlineblock"><p class="wordstyle">' + name + '</p></div>' +
                               '<div class="inlineblock">' + moredetails + '</div>' +
                               '<div>' + like + '</div>' +
                         '</div>';

                var secondRow = '<div class="inlineblock">' + call + '</div>' +
                               '<div class="inlineblock">' + directions + '</div>';
                var tpl = '<div display="table-column-group">' + firstRow + '</div>' + '<div display="table-column-group">' + secondRow + '</div>';

                infowindow.setContent(tpl);
                infowindow.open(map.getMap(), marker);
            }
            else {
                console.log("failed");
                console.log(status1);
            }
        });
    }


});