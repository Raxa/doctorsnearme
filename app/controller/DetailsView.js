/**
 * Authored by Amaya
 */
Ext.define('EasyTreatyApp.controller.DetailsView', {
    extend: 'Ext.app.Controller',
   // requires:'Ext.data.JsonP',

    config: {
        refs: {
            detailsView: 'detailsview',
            mapView: 'mapview',
            userProfile: 'userprofile'
        },
        control: {
            detailsView: {
                back: "backToMapView",
                showcomments: "showOrHideComments",
                comment: "comment",
                like: "like"
            },
            userProfile: {
                back: "backToMapView"
            }

        }
    },

    like: function (data) {
        var me = this;
        var detailsView = this.getDetailsView();
        var previouslyLiked = detailsView.getLiked();
        Ext.Ajax.request({
            // Ext.data.JsonP.request({
            url: 'http://localhost:8888/like',
            method: 'GET',
            params: {
                location: data.id,
                user: EasyTreatyApp.config.getUser().get('personUuid'),
                //like: 1
                like:previouslyLiked==true?0:1
            },
            success: function (response, opts) {

                console.log("success");
                console.log(response);
                if (previouslyLiked) {
                    detailsView.toggleLikeButtonState(false);
                    data.likeCount = data.likeCount - 1;
                } else {
                    detailsView.toggleLikeButtonState(true);
                    data.likeCount = data.likeCount + 1;
                }
                detailsView.setData(data);

            },
            failure: function (response, opts) {
                console.log("failure");
                console.log(response);
            }
        });
    },

    comment: function (commentField, detailsView) {
        console.log("inside comment");
        var me = this;
         Ext.Ajax.request({
       // Ext.data.JsonP.request({
            url: 'http://localhost:8888/comment',
            method: 'GET',
            params: {
                location:detailsView.getData().id,
                user: EasyTreatyApp.config.getUser().get('personUuid'),
                comment:commentField.getValue()
            },
            success: function (response, opts) {
                console.log("success");
                console.log(response.responseText);
                if (detailsView.getCommentsVisible()) {
                    me.hideComments(detailsView);
                    me.showComments(detailsView);
                }
                else {
                    me.showComments(detailsView);
                }
                commentField.setValue("");
            },
            failure: function (response, opts) {
                console.log("failure");
                console.log(response);
            }
        });
    },

    showOrHideComments: function (detailsView){//, button, oldCommentPanel) {
      //  console.log(button.getItemId());
        
        var commentsVisible = detailsView.getCommentsVisible();
        console.log(commentsVisible);
        if (commentsVisible) {

            this.hideComments(detailsView);
            
        }
        else {
            this.showComments(detailsView);
        }
    },

    hideComments: function (detailsView) {
        detailsView.getViewCommentsButton().setText("View Comments");
        detailsView.setCommentsVisible(false);
        detailsView.getOldCommentsPanel().removeAll(true, true);
        
    },

    showComments: function (detailsView) {
        var comments;

        detailsView.getViewCommentsButton().setText("Hide Comments");
        detailsView.setCommentsVisible(true);

        Ext.Ajax.request({
      //  Ext.data.JsonP.request({
            url: 'http://localhost:8888/getComments',
            method: 'GET',
           // method: 'POST',
            params:{
                location: detailsView.getData().id
            },
            success: function (response, opts) {
                console.log("success");
                console.log(Ext.JSON.decode(response.responseText).data);
                comments = Ext.JSON.decode(response.responseText).data;
                if (comments.length == 0) {
                    if (!EasyTreatyApp.config.getLoggedIn()) {
                        detailsView.addComment("No Comments Yet.. Be the first. Log in to comment");
                    } else {
                        detailsView.addComment("No Comments Yet.. Be the first.");
                    }                   
                } else {

                    Ext.Array.forEach(comments, function (item) {
                        detailsView.addComment(item.comment);
                    });
                }

            },
            failure: function (response, opts) {                
                console.log("failure");
                console.log(response);
            }
        });
    },
    
    backToMapView: function () {
            var mapview = this.getMapView();
            Ext.Viewport.setActiveItem(mapview);

            var detailsView = this.getDetailsView();
        
            this.hideComments(detailsView);
    }
})