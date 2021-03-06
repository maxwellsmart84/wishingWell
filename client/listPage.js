
var page = {
    // url: "https://tiny-tiny.herokuapp.com/collections/bucketList",
    // url: '/globalBucket',
  init:function(){
    page.initStyling();
    page.initEvents();
  },
  initStyling:function(){
    page.getItem();

	  $('#slideshow').cycle({
	    fx: 'fade',
	    pager: '#smallnav',
	    pause:   1,
	    speed: 2500,
	    timeout:  5500
	  });

  },
  initEvents:function(){

  // EDIT Bucket Item-------------
  $('section').on('click', '.listItem', function (event){
  event.preventDefault();
  console.log(event.target);
  $(this).closest('.listItem').replaceWith('<input type="text" class="updateListItem" placeholder="Edit Bucket List Item" name="updateListItem"</input>');
  $('.updateListItem').parent().siblings('.editItem').addClass('show');
  });

  $('.inputs').on('click', '#editedItem', function (event) {
  event.preventDefault();
  var itemId = $('.updateListItem').closest('article').data('itemid');
  var editedListItem = {
    title: $('.updateListItem').val(),
    complete: false
  }
  page.updateItem(itemId, editedListItem);

  });

  $('.container').on('click', ".completeItem", function (event){
    event.preventDefault();
    var parentElement = $(this).parent().parent().parent();
    var itemID = parentElement.data("itemid");
    console.log(itemID);
    $.ajax({
      url: "/isDone",
      type: 'POST',
      data: itemID,
      success: function(data) {
        console.log("update success!", data);
      },

      failure: function(err) {
        console.log("update failure", err);
      }
    });

  });

  $('body').on('click', "#getRandom", function(event){
      console.log(event.target);
      event.preventDefault();
      $.ajax({
        url: "/randomBucket",
        type: 'GET',
        success: function (bucket2) {
          console.log(bucket2);
          var bucketData2= JSON.parse(bucket2);
          console.log(bucketData2);
          var template = _.template(templates.bucket);
          var bucketItm = "";
          bucketData2.forEach(function(item, idx, arr){
            bucketItm += template(item);
          });
          console.log('bucketItm is...', bucketItm);
          $('section').html(bucketItm);

        },
        failure: function (err) {
          console.log("DID NOT GET ITEM", err);
        }
      });
  });

  //CREATE NEW BUCKET ITEM------------
  $('.createItem').on('submit', function(event){
      event.preventDefault();
        var newItem = {
          newTitle: $(this).find('input[name="newTitle"]').val(),
          isDone: false,

        };
      page.createItem(newItem);
  });


  //DELETE BUCKET//
    $('section').on('click', '.deleteItem', function (event){
      event.preventDefault();
      var taskId = $(this).closest('article').data('itemid');
      page.deleteItem(taskId);
    });
  //strikethrough when click the check
    $('section').on('click', '.completeItem', function(event){
      event.preventDefault();
      $(this).parent().siblings('h4').toggleClass('complete')

    });

},

getItem: function() {
    $.ajax({
      url: '/globalBucket',
      // url: page.url,
      type: 'GET',
      success: function (bucket) {
        console.log(bucket);
        bucketData= JSON.parse(bucket);
        console.log(bucketData);
        var template = _.template(templates.bucket);
        var bucketItm = "";
        bucketData.forEach(function(item, idx, arr){
          bucketItm += template(item);
        });
        console.log('bucketItm is...', bucketItm);
        $('section').html(bucketItm);

      },
      error: function (err) {
        console.log("DID NOT GET ITEM", err);
      }
    });
  },

  getRandomBucket: function() {
      $.ajax({
        url: "/randomBucket",
        type: 'GET',
        success: function (bucket) {
          console.log(bucket);
          bucketData= JSON.parse(bucket);
          console.log(bucketData);
          var template = _.template(templates.bucket);
          var bucketItm = "";
          bucketData.forEach(function(item, idx, arr){
            bucketItm += template(item);
          });
          console.log('bucketItm is...', bucketItm);
          $('section').html(bucketItm);

        },
        failure: function (err) {
          console.log("DID NOT GET ITEM", err);
        }
      });
    },

createItem: function(newItem) {
  $.ajax({
    url: "/insertBucket",
    data: newItem,
    type: 'POST',
    success: function (data) {
      console.log("SUCCESSFULLY CREATED NEW BUCKET", data);
      page.getItem();
    },
    error: function (err) {
      console.log("DID NOT CREATE NEW BUCKET", err);
    }
  });
  $('input').val('');

  },
  // console.log("NEW bucket", newBucket)

  deleteItem: function(itemId) {
    $.ajax({
      url: 'removeBucket' + "/" + itemId,
      type: 'DELETE',
      success: function (data) {
        console.log("Delete success!", data);
        page.getItem();
      },
      error: function (err) {
        console.log("delete failed",err);
      }
    });
  },
  updateItem: function(itemId, editedItem) {
    $.ajax({
      url: "/userBucket",
      type: 'PUT',
      data: "done=true",
      success: function(data) {
        console.log("update success!", data);
        page.getItem();

      },

      error: function(err) {
        console.log("update Error", err);
      }
    });
  }
}
$(document).ready(function () {
   page.init();
});
