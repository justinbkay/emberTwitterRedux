App = Ember.Application.create();

App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
App.ApplicationController = Ember.Controller.extend();

App.SearchTextField = Ember.TextField.extend({
  insertNewline: function() {
    this.get('controller.target').send('showLoading');
    // load the tweets
    App.Tweet.loadTweets(this.value);
  }
});

App.Tweet = Ember.Object.extend({
  profilePic: null,
  username: null,
  date: null,
  text: null
});

//App.InstructionsController = Ember.Controller.extend();
App.InstructionsView = Ember.View.extend({
  templateName: 'instructions'
});

App.LoadingView = Ember.View.extend({
  templateName: 'loading'
});

App.NoresultsView = Ember.View.extend({
  templateName: 'noresults'
});

App.TweetsController = Ember.ArrayController.extend({
});
App.TweetsView = Ember.View.extend({
  templateName: 'tweets'
});

App.Tweet.reopenClass({
  loadedTweets: [],

  loadTweets: function(term) {
    if ( term ) {
      var url = 'http://search.twitter.com/search.json?q=%@&rpp=15&include_entities=true&result_type=recent&callback=?'.fmt(encodeURIComponent(term));
      this.loadedTweets = [];
      $.ajax({
        url: url,
        dataType: 'JSON',
        context: this,
        success: this.loadTweetsSucceeded,
        complete: this.loadTweetsCompleted
      });
    }
    return this.loadedTweets;
  },

  loadTweetsCompleted: function(xhr) {
    if(xhr.status == 400 || xhr.status == 420) {
      this.set('limit', true);
    }
  },

  loadTweetsSucceeded: function(data) {
    var tweets = data.results;
    tweets.forEach(function(tweetData) {
      var d = new Date(tweetData.created_at);
      var ago = $.timeago(d);
      var tweet = App.Tweet.create({
        profilePic: tweetData.profile_image_url,
        username: tweetData.from_user,
        date: ago,
        text: tweetData.text
      });
      this.loadedTweets.addObject(tweet);
    }, this);

    if (this.loadedTweets.length === 0) {
      App.router.send('showNoresults');
    } else {
      App.router.send('showTweets');
    }
  }

});

App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      showLoading: Ember.Route.transitionTo('loading'),
      showNoresults: Ember.Route.transitionTo('noResults'),

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
        },
        showTweets: function(router) {
          router.get('applicationController').connectOutlet('tweets', App.Tweet.loadedTweets);
        },
        showNoresults: function(router) {
          router.get('applicationController').connectOutlet('noresults');
        }
      })

    })
  })
});

App.initialize();
