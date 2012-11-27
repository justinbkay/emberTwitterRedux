App = Ember.Application.create();

App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
App.ApplicationController = Ember.Controller.extend();

App.SearchTextField = Ember.TextField.extend({
  insertNewline: function() {
    this.get('controller.target').send('showLoading');
  }
});

//App.InstructionsController = Ember.Controller.extend();
App.InstructionsView = Ember.View.extend({
  templateName: 'instructions'
});

App.LoadingView = Ember.View.extend({
  templateName: 'loading'
});

App.TweetsController = Ember.ArrayController.extend();
App.TweetsView = Ember.View.extend({
  templateName: 'tweets'
});

App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      showLoading: Ember.Route.transitionTo('loading'),
      //connectOutlets: function(router){
        //router.get('applicationController').connectOutlet('instructions');
      //},

      //child states
      initialState: 'instructions',

      instructions: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          router.get('applicationController').connectOutlet('instructions');
        }
      }),

      loading: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          router.get('applicationController').connectOutlet('loading');
        }
      })
    })
  })
});

App.initialize();
