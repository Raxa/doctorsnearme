/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.store.Location', {
    extend: 'Ext.data.Store',

    config: {
        model: 'EasyTreatyApp.model.Location',        
    },

    populate: function (latLng, type, radius, map) {
        console.log("inside store");
        this.removeAll();
        this.fireEvent('storecleared');
        var request = {
            location: latLng,
            radius: radius,
            types: [type]
        };

        var service = new google.maps.places.PlacesService(map.getMap());

        var me = this;

     //   var detailRequest;
        service.nearbySearch(request, function (results, status) {
            console.log("inside nearbysearch");
            console.log(results);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    
                    //detailRequest = {
                    //    reference: results[i].reference
                    //};
                    console.log(results.length);
                    console.log("refrence "+i+": "+results[i].reference)
                    service.getDetails(
                        {
                            reference: results[i].reference
                        }, function (place, status1) {
                        console.log("test...............");
                        if (status1 == google.maps.places.PlacesServiceStatus.OK) {

                            me.add(place);

                            me.fireEvent("locationadded");
                        }
                        else {
                            console.log("oh seems like failed.. yet..");
                            console.log("place:");
                            console.lg(place);
                        }
                    });
                }
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