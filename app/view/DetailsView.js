/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.DetailsView', {
    extend:'Ext.Container',

    xtype: 'detailsview',
    
    config:
   {
       layout: 'fit',
       styleHtmlContent: true,
       store: null,
       data: null,
       cls: 'profile',
       items: {
           xtype: 'toolbar',
           docked: 'top',
           items: [
               {
                   xtype: 'button',
                 //  text: 'Back',
                   docked: 'right'
               },
               {
                   iconCls: 'star',
                   docked: 'left'
               }
           ]
       }

   },
    
    constructor: function () {
        var template = new Ext.XTemplate(
            '<table>',
             '<th colspan="2">{[this.getString("moreinfo")]}</th>',
            '<tbody>',
            '<tr>',
            '<td>{[this.getString("name")]}&nbsp;:</td><td>{name}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("address")]}&nbsp;:</td><td>{formatted_address}</td>',
            '</tr>',
            '<tr>',
            '<td>{[this.getString("phoneno")]}&nbsp;:</td><td>{international_phone_number}</td>',
            '</tr>',
            '</tbody>',
            '</table>', {

                getString: function (string) {
                    var lang = EasyTreatyApp.config.getLanguage();
                    switch (string) {
                        case 'moreinfo': return lang.MORE_INFORMATION;
                            break;

                        case 'name': return lang.NAME;
                            break;

                        case 'address': return lang.ADDRESS;
                            break;

                        case 'phoneno': return lang.PHONE_NUMBER;
                            break;
                    }
                }
            }
        );
        this.setTpl(template);
        this.callParent(arguments);

    },
    
    /**
    * Initialize
    * @method
   */
    initialize: function () {
        var me = this;       

        this.getBackButton().on('tap', function () {
            me.fireEvent('back');
        });

        this.getFavoriteButton().on('tap', function () {
            var isFavorite = false;
            if (this.getIconCls() == 'star') {
                this.setIconCls('color-star')
                isFavorite = true;
            }
            else {
                this.setIconCls('star');
                isFavorite = false;
            }
            me.fireEvent('togglefavorite', me.getData().id, isFavorite);
        });

        this.callParent();

        this.setLanguage();
    },
 
    /**
     * Returns the back button
     * @method
     * @private
     * @return {Button} 
     */
    getBackButton: function () {
        return this.getComponent(0).getComponent(0);
    },

    getFavoriteButton: function () {
        return this.getComponent(0).getComponent(1);
    },

    setLanguage: function () {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getBackButton().setText(lang.BACK);

    },

    refreshTemplate: function () {
        var data = this.getData();
        var tpl = this.getTpl();

        this.setTpl(null);
        this.setData(null);

        this.setTpl(tpl);
        this.setData(data);
    }
    

});