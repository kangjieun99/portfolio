$(document).ready(function() {

     $(document).on("mousemove", function(e){
         var mouseX = e.pageX;
         var mouseY = e.pageY;
 
         $('#follow').delay(1500).stop(true, false).animate({left:mouseX + 10, top:mouseY + 30},'slow','easeOutBack');
     });

     var scrollT;
     var timer = 0; //false를 의미함 ,로딩시 누적된 setTimeout이 없음을 의미함
     $(window).on('scroll',function(){
         //스크롤을 움직일 경우 setTimeout에 지정한 시간이 되지 않은 timer는 제거 - 누적을 최소화
         clearTimeout(timer);
 
         //0.1초(100/1000) 에 한번씩만 실행문이 동작됨
        timer = setTimeout(function(){
         scrollT = $(this).scrollTop();
 
         $('.fade').each(function(){
             if(scrollT > $(this).offset().top -400) $(this).addClass('on');
             else $(this).removeClass('on');
         });
        },100);
        console.log(timer);
     });
});