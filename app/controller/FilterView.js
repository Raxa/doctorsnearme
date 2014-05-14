/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.FilterView', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            mapView: 'mapview',           
            filterView: 'filterview'
        },
        control: {
            
            filterView: {
                search: "onSearchButtonTap",
                
                cancel: "onCancelButtonTap"
            }
        }
    },

    /**
     * Set filter values and go to MapView
     * @method
     * @private
     */
    onSearchButtonTap: function (filterView, button) {
        console.log("controller search");
            var mapview = this.getMapView();

            var currentSearch = mapview.getCurrentSearch();
            console.log("current search: " + currentSearch);

        console.log(filterView);
        var values = filterView.getValues();
            console.log(values);

            var errors = this.validateInput(values,currentSearch);

            console.log(errors);
            
           
            if (!errors.isValid()) {
                var msg = "";

                Ext.Msg.alert("Input is not valid!", msg);
                return;
            }
        console.log("before");
            console.log(mapview.getFilterValues());
            mapview.setFilterValues(values);

        console.log("after");
        console.log(mapview.getFilterValues());
            Ext.Viewport.add(mapview);
            Ext.Viewport.setActiveItem(mapview);

        

    },
    
    /**
     * Validate form values 
     * @method
     * @private
     * @param {Object} values
     * @param {Integer} currentSearch
     * @return {Object} errors
     */
    validateInput: function (values, currentSearch) {
        var model;
        switch(currentSearch) {
        
        case 0:
            model = Ext.create("EasyTreatyApp.model.LocationFilter", values);
                break;
        case 1:
            model = Ext.create("EasyTreatyApp.model.DoctorFilter", values);
                break;
        case 2:
            model = Ext.create("EasyTreatyApp.model.PharmacyFilter", values);
                break;            
    }
        var errors = model.validate();
        return errors;
    },
    

    /**
     * go to MapView
     * @method
     * @private
     */
    onCancelButtonTap: function () {
        console.log("controller cancel");
        var mapview = this.getMapView();

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
    }
        
})