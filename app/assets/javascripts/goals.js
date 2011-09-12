// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Goal Model
  // ----------

  // Our basic **Goal** model has `content`, `order`, and `done` attributes.
  window.Goal = Backbone.Model.extend({

    // Default attributes for the goal.
    defaults: {
      title: "Default title...",
	  description: "Default desc..."
    },

    // Ensure that each goal created has `content`.
    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults.title});
      }
      if (!this.get("description")) {
        this.set({"description": this.defaults.description});
      }
    },

    url : function() {
      return this.id ? '/goals/' + this.id : '/goals';
    },

//    clear: function() {
//      this.destroy();
//      this.view.remove();
//    }

  });

  // Goal Collection
  // ---------------

  // The collection of goals is backed by *localStorage* instead of a remote
  // server.
  window.GoalList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Goal,

    url :'/goals',

  });

  // Create our global collection of **Goals**.
  window.Goals = new GoalList;


  // Goal Item View
  // --------------

  // The DOM element for a goal item...
  window.GoalView = Backbone.View.extend({


    el: $("#input-fields"),

    // The DOM events specific to an item.
    events: {
      "dblclick div.goal-content" : "edit",
      "click span.goal-destroy"   : "clear",
      "keypress .goal-input"      : "updateOnEnter"

    },

    // The GoalView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Goal** and a **GoalView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the goal item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the goal item.
    setContent: function() {
      var content = this.model.get('content');
      this.$('.goal-content').text(content);
      this.input = this.$('.goal-input');
      this.input.bind('blur', _.bind(this.close, this));
      this.input.val(content);
    },


    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the goal.
    close: function() {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#goalapp"),

	activeGoal: null,

    events: {
	  "click input[type=button]"            : "selection"
	},

    initialize: function() {
      Goals.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
	  if( null == this.activeGoal)
	  {
	    $(':text').val('');
	    $(':text').attr('disabled', true);
	  }
	  else
	  {
	    console.info("enabling inputs");
	    //var mygoaltitle = $('#goaltitle');
	    $(':text').removeAttr('disabled');
	    $('#goaltitletext').val(this.activeGoal.get('title'));
		var a = this.activeGoal.get('description');
		var b = $('#goaldesctext');
	    $('#goaldesctext').val(this.activeGoal.get('description'));
	  
	  
	  }
    },

    // Add all items in the **Goals** collection at once.
    addAll: function() {

    },

    // Generate the attributes for a new Goal item.
    newAttributes: function() {
        
    },

    selection: function(event){
      console.info("selection of " + event.currentTarget.id);
	  this.activeGoal = Goals.get(event.currentTarget.id);
	  this.render();
	},
	

  });
  // Finally, we kick things off by creating the **App**.
  window.App = new AppView;
  console.info("created app");

});