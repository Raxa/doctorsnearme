/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.view.DetailsView', {
    extend:'Ext.Container',

    xtype: 'detailsview',
    
    config:
   {
       layout: 'vbox',
       styleHtmlContent: true,
       store: null,
       data: null,
      // cls: 'profile',
       border: 3,
       style: 'border-color: gray; border-style: solid;background-color:#d3d3d3;',
       scrollable:true,
       commentsVisible: false,
       liked: false,
       //after new design
       commentsStore:null,

       items: [
           {    //0
               xtype: 'toolbar',
               docked: 'top',
               style: 'border:2px solid #0d66f2;border-radius:0;',
               items: [
                   {
                       xtype: 'button',
                       //  text: 'Back',
                       ui: 'back'
                   }
               ]
           },
           {    //1
               xtype: 'container',
               layout: 'hbox',
               height: 100,
               padding: 0,
               //margin: 0,
               style: 'background-color:white;margin:8px 0 0 0;',
               items: [
                   {
                       xtype: 'image',
                       height: '100%',
                       width: 50,
                       centered:true,
                       src: 'resources/icons/empty.png'
                   },
                   {
                       xtype: 'image',
                       docked:'right',
                       height: '100%',
                       width: 40,
                       margin:5,
                       centered: true,
                       src: 'resources/icons/forward.png'
                   }
               ]
           },
           {    //2
               xtype: 'container',
               layout: 'fit',
               data: {},
               style: 'background-color:white;padding:20px;border:1px solid #d3d3d3;border-radius:0',
               tpl: '{name}<br>{formatted_address}'
           },
             {  //3
                 xtype: 'toolbar',
                 // top: '50%',
                 //  height: '100%',
                 height:80,
                 width: '100%',
                 style: 'border-top:1px solid #0d66f2;border-right:1px solid #0d66f2;border-bottom:1px solid #0d66f2;border-left:1px solid #0d66f2;border-radius:0;',
              //   docked:'bottom',
                 items: [
                     {
                         xtype: 'button',
                       //  text: '<div><img src = "resources/icons/Phone_40_40.png" style="height:30px;width:30px;"></br><a href="tel:' + phoneNumber + '"></div>',
                      //   width: '20%',
                         height:'100%'
                     },
                     {
                         xtype:'spacer',
                      //   width:'6%'
                     },
                     {
                         xtype: 'button',
                         text: '<img src = "resources/icons/Arrow_40_40.png" style="height:30px;width:30px;"></br>Direct Me',
                     //    width: '20%',
                         height:'100%'
                     },
                     {
                         xtype: 'spacer',
                      //   width: '6%'
                     },
                     {
                         xtype: 'button',
                        // text: '<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Save Me',
                      //   width: '20%',
                         height: '100%'
                     },
                     {
                         xtype: 'spacer',
                         //   width: '6%'
                         hidden: true
                     },
                     {
                         xtype: 'button',
                         cls: 'like',
                      //   width: '20%',
                         hidden:true
                     }
                 ]
             },
        {   //4
            xtype: 'container',
            layout: 'vbox',
          //  docked: 'bottom',
             hidden: true,   
            style: 'border-radius:0;margin:8px 0 8px 0;',
            items: [
                {
                    xtype: 'textareafield',
                    placeHolder: 'Comment...',
                    maxRows: 4,
                    name: 'comment',
                    style:'border-radius:0;'
                },
                {
                    xtype: 'button',
                    text: 'Review',
                    bubbleEvents: 'tap',
                    style: 'border-radius:0;'
                }
            ]
        },
        {   //5
            xtype:'label',
            html: 'Reviews',
            style: 'font-size:20px;padding:10px;border-bottom:0;border-left:1px solid #d3d3d3;border-right:1px solid #d3d3d3;margin:8px 8px 0 8px;color:grey;background-color:white;',
         //   height:20
        },
       {    //6
           xtype: 'container',
           layout: 'fit',
           //style: 'border:1px solid #d3d3d3;margin:8px auto auto auto;color:grey;',
           style: 'border-top:0;border-left:1px solid #d3d3d3;border-right:1px solid #d3d3d3;margin:0 auto auto auto;color:grey;',
           flex:1,
           items: [
              {
                  xtype: 'list',
                  itemTpl: '<p style="color:grey;">{timestamp}</br>{comment}<p>',
                  style: 'margin-top:0px;margin-left:8px;margin-right:8px;'
              }
           ]
       }
       
       ]

   },

    initialize: function(){
        this.callParent();

        //this.getTopToolbar().setTitle('<p style="color:#0d66f2;">' + this.getData().name+'</p>');

       // this.setDetails();

        var store = Ext.create('EasyTreatyApp.store.Comment');
        var me=this;
        store.on({
            load: me.onStoreLoad,
            scope: me
        });

        // this.setCommentsStore(store);

        this.getReviewList().setStore(store);
        
        this.setHandlers();

        
    },

    //either when creating details view for the first time or not
    onSwitchingToDetailsView: function () {

        var store = this.getReviewList().getStore();
        store.setTheProxy(this.getData().id);

        store.load();

        var phoneno = this.getData().international_phone_number;
        var callButton = this.getCallButton();
        this.getCallButton().setText('<div><img src = "resources/icons/Phone_40_40.png" style="height:30px;width:30px;"></br><a href="tel:' + phoneno + '">Call</div>');

        if (phoneno == null) {
            callButton.setDisabled(true);
        }
        else {
            callButton.setDisabled(false);
        }

        var isFavorite = this.getData().isFavorite;
        console.log(this.getData().name);
        console.log(this.getData().isFavorite);

        var saveBtn = this.getSaveButton();
        if (isFavorite == null || isFavorite == false) {
            saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Save Me');
            saveBtn.setCls('not-saved');
        }
        else {
            saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Unsave Me');
            saveBtn.setCls('saved');
        }

    },

    reloadCommentStore: function(){
        this.getReviewList().getStore().load();
    },

    onStoreLoad: function (store) {
        console.log("on store load");
      //  this.getReviewContainer().setMasked(false);
        store.each(function (record) {
            console.log(record);
        });

       // var data = this.collectData(store.getRange());
        var reviewlist = this.getReviewList();
     //   reviewlist.setData(data);
        reviewlist.refresh();
        
    },

    collectData: function (records) {
        var data = [];

        Ext.each(records, function (record, index) {
            data.push(record.data);
        }, this);

        return data;
    },

    getTopToolbar: function () {
        return this.getComponent(0);
    },

    getMiddleToolbar: function(){
        return this.getComponent(3);
    },

    getCallButton: function(){
        return this.getMiddleToolbar().getComponent(0);
    },

    getDirectionButton: function(){
        return this.getMiddleToolbar().getComponent(2);
    },

    getSaveButton: function(){
        return this.getMiddleToolbar().getComponent(4);
    },

    getLikeButton: function(){
        return this.getMiddleToolbar().getComponent(6);
    },

    getLikeSpacer: function () {
        return this.getMiddleToolbar().getComponent(5);
    },

    getBackButton: function(){
        return this.getTopToolbar().getComponent(0);
    },

    getDetailsContainer: function(){
        return this.getComponent(2);
    },

    getReviewContainer: function () {
        console.log("review container");
        return this.getComponent(6);
    },

    getReviewList:function(){
        return this.getReviewContainer().getComponent(0);
    },

    getCommentContainer: function(){
        return this.getComponent(4);
    },

    getCommentField:function(){
        return this.getCommentContainer().getComponent(0);
    },

    getReviewButton : function(){
        return this.getCommentContainer().getComponent(1);
    },

    setDetails: function () {
        this.getDetailsContainer().setData(this.getData());
    },

    setHandlers: function () {
        var me = this;
        console.log("inside set handlers");
        this.getBackButton().on('tap', function () {
            me.fireEvent('back');
        });

        this.getDirectionButton().on('tap', function () {
            console.log("on direction tap");
            me.fireEvent('getdirections',me.getData().id);
        });

        var saveBtn = this.getSaveButton();
           saveBtn.on('tap', function () {
               var saved = saveBtn.getCls() == 'saved' ? true : false;
               console.log("saved:" + saved);
               if (saved) {
                   saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Save Me');
                   saveBtn.setCls('not-saved');
                   me.getData().isFavorite = false;
               }
               else {
                   saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Unsave Me');
                   saveBtn.setCls('saved');
                   me.getData().isFavorite = true;
               }
                console.log("on save tap");
                me.fireEvent('togglefavorite', me.getData().id, !saved);
           });

           this.getLikeButton().on('tap', function () {
               console.log("clicked like");
               me.fireEvent('like', me.getData());
           });

           this.getReviewButton().on('tap', function () {
               me.fireEvent('comment', me.getCommentField(), me);
           });

    },

    //this is the data set at the creation of the details view or when going to details view from another view
    updateData: function () {
        console.log("inside update data");
        this.setDetails();
        this.getTopToolbar().setTitle('<p style="color:#0d66f2;">' + this.getData().name + '</p>');
        this.onSwitchingToDetailsView();
    },

    toggleLikeButtonState: function (value) {
        // this.getLikeButton().setDisabled(value);
        ////////////
        var likeButton = this.getLikeButton();
        if (value) {
            console.log("set class dislike");
            likeButton.setCls('dislike');
            this.setLiked(true);
        }
        else {
            console.log("set class like");
            likeButton.setCls('like');
            this.setLiked(false);
        }
    },

    toggleLikeComment: function (value) {
        this.getLikeButton().setHidden(value);
        this.getLikeSpacer().setHidden(value);
        this.getCommentContainer().setHidden(value);
    },
    
   

});