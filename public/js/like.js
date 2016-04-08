$('.like').click(function(){
 var like_obj = $(this);
 var likeable_id = $(this).attr('likeable-id');
 var likeable_type = $(this).data('type');
 $.ajax({
   url: '/likes',
   method: 'POST',
   data: { 'likeable_id' : likeable_id, 'likeable_type' : likeable_type },
   success: function() {
     like_obj.hide();
     like_obj.parent().find('.unlike').show(); 

     var counter = $("div[liked-id='"+likeable_id+"'] span");
     console.log(counter);
     var count = parseInt(counter.text()) + 1;
     counter.empty();
     counter.append(count+ " likes");
   }
 });
});

$('.unlike').click(function(){
 var like_obj = $(this);
 var likeable_id = $(this).attr('likeable-id');
 var likeable_type = $(this).data('type');
 $.ajax({
   url: '/likes/' + likeable_id,
   method: 'DELETE',
   data: { 'likeable_id' : likeable_id, 'likeable_type' : likeable_type },
   success: function() {
     like_obj.hide();
     like_obj.parent().find('.like').show(); 

     var counter = $("div[liked-id='"+likeable_id+"'] span");
     var count = parseInt(counter.text()) - 1;
     console.log(counter);
     counter.empty();
     counter.append(count+ " likes");
   }
 });

});