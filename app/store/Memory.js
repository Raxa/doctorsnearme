Ext.define('DoctorsNearMe.store.Memory', {
    extend: 'Ext.data.Store',

    config: {
        model: 'DoctorsNearMe.model.Memory',

        proxy: {
            type: 'localstorage',
            id: 'fav-locations'
        }
    },
    
    /**
     * Store the passed token in local storage through the passed proxy
     * @method
     * @param {String} token
     * @param {String} proxyId
     */
    storeTokenInLocalStorage: function (token) {
        console.log("store the token");

        this.load();

        this.add({ query: token });

        this.sync();
    },

    removeTokenFromLocalStorage: function (token) {
        console.log("remove the token");
        this.load();
        
        this.removeAt(this.findExact('query', token));

        this.sync();
    }

});