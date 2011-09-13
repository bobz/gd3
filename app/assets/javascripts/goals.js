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


  // ERB-style delimiters are not suitable
  // Apply Mustache-style delimiters:
  //    {% statements %} for executing arbitrary JavaScript code
  //    {{ var }}        for interpolating values
  _.templateSettings = {
	  evaluate    : /\{%([\s\S]+?)%\}/g,
	  interpolate : /\{\{([\s\S]+?)\}\}/g
  };

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#goalapp"),

	activeGoal: null,
	
	inputFieldTemplate: _.template($('#input-field-template').html()),

	setActiveGoal: function(goal)
	{
	  if (null != this.activeGoal)
	  {
	    this.activeGoal.unbind('change');
	  }

	  this.activeGoal = goal;

	  if (null != this.activeGoal)
	  {
	    this.activeGoal.bind('change', this.render, this);
      }
	},

    events: {
	  "click input[type=button]"            : "selection",
      "dblclick div.content" : "edit",
      "keyup .text-input"      : "updateOnEnter"
	},

    initialize: function() {
      Goals.fetch();
	  this.render();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
	  if( null != this.activeGoal)
	  {
	    //var mygoaltitle = $('#goaltitle');
        //
		this.$('#input-fields').html(
          this.inputFieldTemplate({
		  fieldName:   'title',
		  fieldValue:       this.activeGoal.get('title')
		  }) + 
          this.inputFieldTemplate({
		  fieldName:   'description',
		  fieldValue:       this.activeGoal.get('description')
		  }) 
          
          );
	  
	  }
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function(e) {
	  console.info("Editing");
	  var curTar = e.currentTarget;
	  var li = $(e.currentTarget).parent().parent();
      li.addClass("editing");
      li.find('.text-input').focus();
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
	  var KEYCODE_ENTER = 13;
	  var KEYCODE_ESC = 27;

      if (e.which == KEYCODE_ENTER) this.close(e);
      if (e.which == KEYCODE_ESC) this.cancel(e);
    },

    // Close the `"editing"` mode, saving changes to the goal.
    close: function(e) {
      var cT = e.currentTarget;
	  var textfield=$(e.currentTarget);
      var id=e.currentTarget.id;
      var property = null;
      if (id.match(  /input\[(.*)\]/))
      {
        property = RegExp.$1;
        var hash = {};
        hash[property] = textfield.val();
        this.activeGoal.save(hash);
      }
      else
      {
        alert("error parsing: " + id);
      }
      var li=textfield.parent().parent()
	  li.removeClass("editing");
    },

    // Close the `"editing"` mode, saving changes to the goal.
    cancel: function(e) {
	  var textfield=$(e.currentTarget);
      var li=textfield.parent().parent();
	  li.removeClass("editing");
	  this.render();
    },

    // Add all items in the **Goals** collection at once.
    addAll: function() {

    },

    // Generate the attributes for a new Goal item.
    newAttributes: function() {
        
    },

    selection: function(event){
      console.info("selection of " + event.currentTarget.id);
	  this.setActiveGoal( Goals.get(event.currentTarget.id));
	  this.render();
	},
	

  });
  // Finally, we kick things off by creating the **App**.
  window.App = new AppView;
  console.info("created app");

});
