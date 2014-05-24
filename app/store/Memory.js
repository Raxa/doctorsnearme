Ext.define('EasyTreatyApp.store.Memory', {
    extend: 'Ext.data.Store',

    config: {
        model: 'MaktoMobile.model.Memory',
    },
    
    /**
     * Store the passed token in local storage through the passed proxy
     * @method
     * @param {String} token
     * @param {String} proxyId
     */
    storeTokenInLocalStorage: function (token, proxyId) {

        var proxy = Ext.create('Ext.data.proxy.LocalStorage', {
            type: 'localstorage',
            id: proxyId
        });

        this.setProxy(proxy);
        this.add({ query: token });
        console.log(token);
        this.sync();
    }

});