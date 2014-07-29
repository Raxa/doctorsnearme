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

       /**
        * cfg {Object} location data for the view 
        */
       data: null,

       border: 3,
       style: 'border-color: gray; border-style: solid;background-color:#d3d3d3;',
       scrollable: true,

       /**
        * cfg {Store} Store for comments for the review list
        */
       commentsStore:null,
       liked:false,
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
                 height:80,
                 width: '100%',
                 style: 'border-top:1px solid #0d66f2;border-right:1px solid #0d66f2;border-bottom:1px solid #0d66f2;border-left:1px solid #0d66f2;border-radius:0;',
              //   docked:'bottom',
                 items: [
                     {
                         xtype: 'button',
                         height:'100%'
                     },
                     {
                         xtype:'spacer'
                     },
                     {
                         xtype: 'button',
                         text: '<img src = "resources/icons/Arrow_40_40.png" style="height:30px;width:30px;"></br>Direct Me',
                         height:'100%'
                     },
                     {
                         xtype: 'spacer'
                     },
                     {
                         //save me
                         xtype: 'button',
                         height: '100%'
                     },
                     {
                         xtype: 'spacer',
                         hidden: true
                     },
                     {
                         xtype: 'button',
                         cls: 'like',
                         hidden:true
                     }
                 ]
             },
        {   //4
            xtype: 'container',
            layout: 'vbox',
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
            style: 'font-size:20px;padding:10px;border-bottom:0;border-left:1px solid #d3d3d3;border-right:1px solid #d3d3d3;margin:8px 8px 0 8px;color:grey;background-color:white;'
        },
       {    //6
           xtype: 'container',
           layout: 'fit',
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

    /**
     * Initialize
     * @method
    */
    initialize: function(){
        this.callParent();

        //create store for comments
        var store = Ext.create('EasyTreatyApp.store.Comment');
        var me=this;
        store.on({
            load: me.onStoreLoad,
            scope: me
        });

        //set the comment store for the list
        this.getReviewList().setStore(store);
        
        this.setHandlers();

        
    },

    /**
     * Called either when creating details view for the first time or not
     * @method
     */
    onSwitchingToDetailsView: function () {

        var store = this.getReviewList().getStore();

        //set proxy for the store according to the place_id
        store.setTheProxy(this.getData().place_id);

        //load comment store
        store.load();

        //set the phone number for the call button
        var phoneno = this.getData().international_phone_number;
        var callButton = this.getCallButton();
        this.getCallButton().setText('<div><img src = "resources/icons/Phone_40_40.png" style="height:30px;width:30px;"></br><a href="tel:' + phoneno + '">Call</div>');

        if (phoneno == null) {
            callButton.setDisabled(true);
        }
        else {
            callButton.setDisabled(false);
        }

        //is the location a favorite?
        var isFavorite = this.getData().isFavorite;

        //get saved button
        var saveBtn = this.getSaveButton();

        //if not favorite is not already saved in local storage so set the class not-saved
        if (isFavorite == null || isFavorite == false) {
            saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Save Me');
            saveBtn.setCls('not-saved');
        }
        //else ite is already saved in local storage so set the class saved
        else {
            saveBtn.setText('<img src = "resources/icons/Heart_40_40.png" style="height:30px;width:30px;"></br>Unsave Me');
            saveBtn.setCls('saved');
        }

    },

    /**
     * Reloads the comments store. Is called in DetailsView Controller when a new comment is added by user
     * @method
     * @public
     */
    reloadCommentStore: function(){
        this.getReviewList().getStore().load();
    },

    /**
     * Called when comments store is loaded. 
     * @method
     * @private
     */
    onStoreLoad: function (store) {
        console.log("on store load");

        var reviewlist = this.getReviewList();

        // refresh the review list to show loaded items
        reviewlist.refresh();
        
        if (store.getCount() == 0) {
            this.getReviewLabel().setHtml("Be the first to review");
        }
        else {
            this.getReviewLabel().setHtml("Reviews");
        }
    },

    /**
     * To extract data from store. 
     * @method
     * @private
     */
    collectData: function (records) {
        var data = [];

        Ext.each(records, function (record, index) {
            data.push(record.data);
        }, this);

        return data;
    },


    /**
     * Get the top tool bar component 
     * @method
     * @private
     * @return {Ext.Toolbar}
     */
    getTopToolbar: function () {
        return this.getComponent(0);
    },

    /**
     * Get the middle tool bar component 
     * @method
     * @private
     * @return {Ext.Toolbar}
     */
    getMiddleToolbar: function(){
        return this.getComponent(3);
    },

    /**
     * Get the call button 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getCallButton: function(){
        return this.getMiddleToolbar().getComponent(0);
    },

    /**
     * Get the Direction button 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getDirectionButton: function(){
        return this.getMiddleToolbar().getComponent(2);
    },

    /**
     * Get the Save button 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getSaveButton: function(){
        return this.getMiddleToolbar().getComponent(4);
    },

    /**
     * Get the Like button 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getLikeButton: function(){
        return this.getMiddleToolbar().getComponent(6);
    },

    /**
     * Get the Spacer after Like button 
     * @method
     * @private
     * @return {Ext.Spacer}
     */
    getLikeSpacer: function () {
        return this.getMiddleToolbar().getComponent(5);
    },

    /**
     * Get the Back button 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getBackButton: function(){
        return this.getTopToolbar().getComponent(0);
    },

    /**
     * Get the container for location details 
     * @method
     * @private
     * @return {Ext.Container}
     */
    getDetailsContainer: function(){
        return this.getComponent(2);
    },

    /**
     * Get the label above reviews container
     * @method
     * @private
     * @return {Ext.Container}
     */
    getReviewLabel: function(){
        return this.getComponent(5);
    },

    /**
     * Get the container for reviews
     * @method
     * @private
     * @return {Ext.Container}
     */
    getReviewContainer: function () {
        console.log("review container");
        return this.getComponent(6);
    },

    /**
     * Get the Review List 
     * @method
     * @private
     * @return {Ext.List}
     */
    getReviewList:function(){
        return this.getReviewContainer().getComponent(0);
    },

    /**
     * Get the contianer of user comment 
     * @method
     * @private
     * @return {Ext.Container}
     */
    getCommentContainer: function(){
        return this.getComponent(4);
    },

    /**
     * Get the text field in comment container
     * @method
     * @private
     * @return {Ext.Textfield}
     */
    getCommentField:function(){
        return this.getCommentContainer().getComponent(0);
    },

    /**
     * Get the Review Button in user comment container 
     * @method
     * @private
     * @return {Ext.Button}
     */
    getReviewButton : function(){
        return this.getCommentContainer().getComponent(1);
    },

    /**
     * Get the container for the location image 
     * @method
     * @private
     * @return {Ext.Container}
     */
    getImageContainer: function(){
        return this.getComponent(1);
    },

    /**
     * Get the forward icon by clicking which user can go thorugh locations in the store
     * @method
     * @private
     * @return {Ext.Image}
     */
    getForwardButton: function(){
        return this.getImageContainer().getComponent(1);
    },

    /**
     * Is called inside updateData function when data of this view is updated
     * @method
     * @private
     */
    setDetails: function () {
        this.getDetailsContainer().setData(this.getData());
    },

    /**
     * Set handlers
     * @method
     * @private
     */
    setHandlers: function () {
        var me = this;
        
        //set back button handler
        this.getBackButton().on('tap', function () {
            me.fireEvent('back');
        });


        //set direction button handler
        this.getDirectionButton().on('tap', function () {
            console.log("on direction tap");
            me.fireEvent('getdirections',me.getData().id);
        });

        //set save button handler
        var saveBtn = this.getSaveButton();
        saveBtn.on('tap', function () {

            //class for save button is set considering if this location is a favorite or not. So by checking the class
            //we can decide what to do when user taps this button
               var saved = saveBtn.getCls() == 'saved' ? true : false;

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

                me.fireEvent('togglefavorite', me.getData().place_id, !saved);
           });

        //set handler for like button. 
        //Whenever details view is newly created or set as active item if user is logged in toggleLikeButtonStatus function is called
        //after checking if the relevant record is liked. That sets either like class or dislike class. 
        //So by checking the class can fire event accordingly
            this.getLikeButton().on('tap', function () {

               if (me.getLikeButton().getCls()=='like') {
                   me.fireEvent('like', true, me);
               }
               else {
                   me.fireEvent('like',false, me);
               }
           });

        //set handler for review button
           this.getReviewButton().on('tap', function () {
               me.fireEvent('comment', me.getCommentField(), me);
           });

        //set handler for forward icon
           this.getForwardButton().on('tap', function () {
               me.fireEvent('forward',me.getData().id);
           });

    },

    /**
     * Called when updating data config
     * @method
     * @private
     */
    updateData: function () {

        //data is updated at the creation of details view or being set as the active item. when that happens need 
        //set details accordingly
        this.setDetails();

        //when updating data set title accordingly
        this.getTopToolbar().setTitle('<p style="color:#0d66f2;">' + this.getData().name + '</p>');

        //when updating data need to set proxy to the comment store and load relevant comments,
        //set proper statuses for the save, like, call buttons
        this.onSwitchingToDetailsView();
    },

    /**
     * Called when going to detailsView(newly creation or setting as active item)
     * @method
     * @public
     * @param {Boolean} value
     */
    toggleLikeButtonState: function (value) {

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

    /**
     * Toggle the visiblity of like button and comment container
     * @method
     * @public
     * @param {Boolean} value
     */
    toggleLikeComment: function (value) {
        this.getLikeButton().setHidden(value);
        this.getLikeSpacer().setHidden(value);
        this.getCommentContainer().setHidden(value);
    }
    
   

});