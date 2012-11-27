App = Ember.Application.create();

App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
App.ApplicationController = Ember.Controller.extend();

App.SearchTextField = Ember.TextField.extend({
  insertNewline: function() {
    //App.tweetsC.loadTweets();
  }
});

//App.InstructionsController = Ember.Controller.extend();
App.InstructionsView = Ember.View.extend({
  templateName: 'instructions'
});

App.TweetsController = Ember.ArrayController.extend();
App.TweetsView = Ember.View.extend({
  templateName: 'tweets'
});

App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router){
        router.get('applicationController').connectOutlet('instructions');
      }
    })
  })
});

App.initialize();
