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
       items: [{
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
               },
               {
                   xtype: 'button',
                   cls: 'like',
                   docked: 'right',
                   //hidden: true,
                   disabled:true
               },
               {
                   xtype: 'button',
                   text: 'View Comments',
                   docked:'right'
               }
           ]
       },
       {
           xtype:'container',
           layout: 'vbox',          
           docked: 'bottom',
          // hidden: true,          
           items: [
               {
                   xtype: 'textareafield',
                   placeHolder: 'Comment...',
                   maxRows: 4,
                   name: 'comment'
               },
               {
                   xtype: 'button',
                   text: 'Comment',
                   bubbleEvents:'tap'
               }
           ]
       }
       
       ]

   },
    
    constructor: function () {
        var me = this;
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
            '<tr>',
            '<td>{[this.getString("likecount")]}&nbsp;:</td><td>{likeCount}</td>',
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

                        case 'likecount': return lang.LIKE_COUNT;
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

        this.getViewCommentsButton().on('tap', function () {
            me.fireEvent('showcomments');
        });

        var commentPanel = this.getCommentPanel();
        
        commentPanel.on('tap', function () {
            me.fireEvent('comment',commentPanel.getComponent(0).getValue());
        });

        this.getLikeButton().on('tap', function () {
            me.fireEvent('like');
        });

        this.getLikeCount(1);

        this.callParent();

        this.setLanguage();
    },

    
    getLikeCount: function (id) {
        var me = this;
        Ext.Ajax.request({
            url: 'http://localhost:8888/getLikes',
            method: 'GET',
            params: {
                location: id
            },
            success: function (response, opts) {
                console.log("success");
                console.log(Ext.JSON.decode(response.responseText).count);
                me.getData().likeCount = Ext.JSON.decode(response.responseText).count;
                me.setData(me.getData());

            },
            failure: function (response, opts) {
                console.log("failure");
                console.log(response);
            }
        });
    },

    toggleLikeButtonState: function(value){
        this.getLikeButton().setDisabled(value);
    },

    toggleLikeComment: function(value){
        this.getLikeButton().setHidden(value);
        this.getCommentPanel().setHidden(value);
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

    getLikeButton: function () {
        return this.getComponent(0).getComponent(2);
    },

    getViewCommentsButton:function(){
        return this.getComponent(0).getComponent(3);
    },

    getCommentPanel: function(){
        return this.getComponent(1);
    },

    setLanguage: function () {
        var lang = EasyTreatyApp.config.getLanguage();

        this.getBackButton().setText(lang.BACK);
        this.getCommentPanel().getComponent(1).setText(lang.COMMENT);
        this.getViewCommentsButton().setText(lang.VIEW_COMMENTS);

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