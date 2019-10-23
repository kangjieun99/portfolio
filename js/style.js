$(document).ready(function() {

     $(document).on("mousemove", function(e){
         var mouseX = e.pageX;
         var mouseY = e.pageY;
 
         $('#follow').delay(1500).stop(true, false).animate({left:mouseX + 10, top:mouseY + 30},'slow','easeOutBack');
     });
});