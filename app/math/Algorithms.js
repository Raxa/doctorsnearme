/**
 * Authored by Amaya
 */
Ext.define('DoctorsNearMe.math.Algorithms', {
    singleton: true,
    
    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Returns distance between two points
     * @method
     * @public
     */
    distanceCalculator: function(lat1, lon1, lat2, lon2, unit) {
        var theta = lon1 - lon2;
        var dist = Math.sin(this.deg2rad(lat1)) * Math.sin(this.deg2rad(lat2)) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.cos(this.deg2rad(theta));
        dist = Math.acos(dist);
        dist = this.rad2deg(dist);
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = dist * 1.609344;
        } else if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return (dist);
    },


    /**
     * Converts dregrees to radian
     * @method
     * @public
     */
    deg2rad: function(deg) {
        return (deg * Math.PI / 180.0);
    },
 

    /**
     * Converts radians to degrees
     * @method
     * @public
     */
    rad2deg: function(rad) {
        return (rad * 180.0 / Math.PI);
    },
 

    /**
     * Filters array by given length
     * @method
     * @public
     */
    lengthFilter: function (array, limit) {

        if (array.length <= limit) {
            console.log("no slice");
            return array;
        } else {
            console.log("slice");
            console.log(array.slice(0, limit - 1));
            return array.slice(0, limit - 1);
        }
    },
  
 
    /**
     * Filters array by given value
     * @method
     * @public
     */
    valueFilter: function(array, max) {
        var result = [];

        Ext.Array.forEach(array, function(item) {
            if (item.distance <= max) {
                result.push(item);
            }
        });

        return result;
    },
    

    /**
     * Quick sort
     * @method
     * @public
     */
    quickSort:function (a, low, high){
 
	    if(high > low){
	        var index = this.getRandomInt(low,high);
	        //console.log(low,high,index);
	        var pivot  = a[index].distance;
	        //console.log("pivot",pivot);
	        a = this.partition(a,pivot);
	        //console.log(a);
	        this.quickSort(a,low,index-1);
	        this.quickSort(a,index+1,high);
	    }
 
        return a;
    },

 
    partition :function (a,pivot) {
	
    var i = 0;
    for( var j=0; j < a.length; j++ ){
        if( a[j].distance!= pivot && a[j].distance < pivot ){
            var temp = a[i];
            a[i] = a[j];
            a[j] = temp;
            i++;
        }
    }
    return a;
    },
 
    
    getRandomInt: function  (min, max) {
        //return Math.floor(Math.random() * (max - min + 1)) + min;
        //console.log("random: " + Math.floor((Math.random()*1000) % max));
        return Math.floor((Math.random()*1000) % max);
    },
    
  
    /**
     * Merge 
     * @method
     * @private
     */
    merge:function (left, right){
        var res  = [],
            lkey = 0,
            rkey = 0;
    while (lkey < left.length && rkey < right.length){
        if (left[lkey].distance < right[rkey].distance){
            res.push(left[lkey]);
            lkey++;
        } else {
            res.push(right[rkey]);
            rkey++;
        }
    }
    return res.concat(left.slice(lkey), right.slice(rkey));
},


    /**
     * Merge sort
     * @method
     * @public
     */
    mergeSort:function (input){
        var dividerElem,
            left,
            right;

        if (input.length < 2) {
            return input;
        }

        dividerElem = Math.floor(input.length / 2);
        left = input.slice(0, dividerElem),
        right = input.slice(dividerElem);

        return this.merge(this.mergeSort(left), this.mergeSort(right));
    }

}, function() {
    DoctorsNearMe.math = this;
})