/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.LocationFilterView', {
    extend: 'EasyTreatyApp.view.FilterView',
    xtype: 'locfilterview',

    config: {
        items: [
            {
                xtype: 'label',
                html: '<h1 class="heading">Enter your criteria to search medical centers</h1>'
            },
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'textfield',
                        label: 'Disease',
                        name: 'disease',
                        labelWidth: '40%'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Max Cost',
                        name: 'maxcost',
                        labelWidth: '40%'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Min Cost',
                        name: 'mincost',
                        labelWidth: '40%'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Max</br>Distance',
                        name: 'distance',
                        labelWidth: '40%'
                    },
                    {
                        xtype: 'selectfield',
                        label: 'No of Results',
                        options: [
                        { text: '10', value: 'first' },
                        { text: '100', value: 'second' },
                        { text: 'All', value: 'third' }
                        ]
                    }
                ]
            }                        
        ]        
    },


    /**
     * getFilterValues
     * @method
     * @public
     * @return {Object} obj
     */
    getValues: function () {
        var fieldSet = this.down('fieldset');
        var items = fieldSet.getItems();
        console.log("select field");
        console.log(items.getAt(4).getRecord());
        var obj = {
            disease: items.getAt(0).getValue(),
            maxCost: items.getAt(1).getValue(),
            minCost: items.getAt(2).getValue(),
            maxDistance: items.getAt(3).getValue(),
            noOfResults: items.getAt(4).getRecord().get('text')
        };

        return obj;

    }

    

})