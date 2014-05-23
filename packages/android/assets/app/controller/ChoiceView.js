/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.ChoiceView', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            choiceView: 'choiceview',  
            mapView: 'mapview',
            locFilterView: 'locfilterview',
            docFilterView: 'docfilterview',
            pharFilterView:'pharfilterview',
            mapPanel: 'mappanel'
        },
        
        control: {
            choiceView: {
                choicedone: "onChoice"
            },
            mapPanel: {
                initialsearchchoicemarkerset: "onInitialSearchChoiceMarkerSet"
            },
            mapView: {
                choicedone: "onChoice"
            }
        }
    },
    
    /**
     * go to Map View
     * @method
     * @private
     */
    onChoice: function (selectedIndex) {
        
        var mapview = this.getMapView();

        if (mapview == null) {
            mapview = Ext.create('EasyTreatyApp.view.MapView', {
                currentSearch: selectedIndex
            });
        } else {
            mapview.setCurrentSearch(selectedIndex);
            mapview.getTopToolBar().setTitle(mapview.getToolbarTitle());
            mapview.setFilterValues({ noOfResults: 'All' });
            this.clearFilters();
        }
        

        Ext.Viewport.add(mapview);
        Ext.Viewport.setActiveItem(mapview);
        

    },
  
    
    /**
     * Clear form values in filter views
     * @method
     * @private
     */
    clearFilters: function() {
        var loc = this.getLocFilterView();
        var doc = this.getDocFilterView();
        var phar = this.getPharFilterView();

        loc.resetFields();
        doc.resetFields();
        phar.resetFields();

    },
 
    /**
     * Set filter values at the initial search choice marker setting
     * @method
     * @private
     */
    onInitialSearchChoiceMarkerSet: function () {
        this.getMapView().setFilterValues({ noOfResults: 'All' });
    }
})