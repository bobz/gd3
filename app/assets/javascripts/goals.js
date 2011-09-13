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


  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#goalapp"),

	activeGoal: null,

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
	  if( null == this.activeGoal)
	  {
	    $(':text').val('');
	    $(':text').attr('disabled', true);
		$('#input-fields').hide();
	  }
	  else
	  {
	    console.info("enabling inputs");
	    //var mygoaltitle = $('#goaltitle');
		$('#input-fields').show();
	    $(':text').removeAttr('disabled');
	    $("#input\\[title\\]").val(this.activeGoal.get('title'));
	    $('#goaldesctext').val(this.activeGoal.get('description'));
	  
	    $("#field\\[title\\] .field_display .content").html(this.activeGoal.get('title'));
	  
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
	  var textfield=$(e.currentTarget);
      this.activeGoal.save({title: textfield.val()});
      var li=textfield.parent().parent()
	  li.removeClass("editing");
    },

    // Close the `"editing"` mode, saving changes to the goal.
    cancel: function(e) {
	  var textfield=$(e.currentTarget);
      var li=textfield.parent().parent()
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
