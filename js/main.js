$(document).ready(function() {
  var $menu = $('.menu ul li');
  var $cntwrap = $('#container .cntwrap'); /* marginLeft로 animate() 시켜서 이동 */
  var tgIdx = 0;  //문서 로딩시 보여지는 섹션의 인덱스 번호
  var total = $('#container .cntwrap section').length;    //6 섹션의 전체 개수
  var timerResize = 0; //스크롤바가 생성되지 않으므로 resize, mousewheel만 제어
  var timerWheel = 0;
  var cntWidth = $('.cntwrap section').outerWidth(true); //윈도창의 가로크기(.cntwrap가로, 섹션가로, maginLeft animate에서 필요함)
  var cntWidth2;
  var cntPadLeft;
  var marginX; //$cntwrap을 애니메이트 시키기 위한 marginLeft 변수값
  //console.log(cntWidth, total);

  //1) 로딩이 완료된 경우 초기 설정 : 인디케이터 첫번째 li에 .on을 추가
  $menu.eq(0).addClass('on');

  //2) 윈도창에서 resize 이벤트
  $(window).on('resize', function () {
    clearTimeout(timerResize);

    timerResize = setTimeout(function () {
      //console.log(cntWidth);
      //.cntwrap, section : 가로크기와 padding-left 강제 지정
      cntPadLeft = ($(this).width() - $('#cnt1').outerWidth()) / 2;
      cntWidth2 = $('.cntwrap #profile').width();
      $cntwrap.css({width: cntWidth*(total-1)+cntWidth2, paddingLeft: cntPadLeft});

      //추가 : 현재보여지는 본문이 resize 되어 나타나지 않을 경우 위치 잡기
      $cntwrap.stop().animate({marginLeft: tgIdx*cntWidth*-1});
    }, 100);
  });
  $(window).trigger('resize');

  //3) 인디케이터 a 클릭 이벤트 : 클릭한 인디케이터 li.on, .cntwrap을 marginLeft로 animate()
  $menu.children().on('click', function (e) {
      e.preventDefault();

      //현재 애니메이트가 일어나고 있으면 함수 강제 종료
      if( $cntwrap.is('animated') ) return false;

    tgIdx = $(this).parent().index();
    //console.log(tgIdx); //0,1,2,3,4,5
    $(this).parent().addClass('on').siblings().removeClass('on');
    if (tgIdx == total-2) marginX = -(tgIdx+1)*cntWidth-cntPadLeft; //마지막 프로필 부분 : #cnt1부터 #cnt5까지와 가장 처음 .cntwrap의 paddingLeft
    else marginX = tgIdx*cntWidth*-1;
    $cntwrap.stop().animate({marginLeft: marginX});
    //$cntwrap.stop().animate({marginLeft: tgIdx*cntWidth*-1});
  });

  //3) .cntwrap 마우스휠 이벤트
  /* 
      if      휠내리기 -오른쪽방향 (delta변수값이 음수, tgIdx가 5보다 작을 경우) : tgIdx을 1씩 증가
      else if 휠올리기 -왼쪽방향 (delta변수값이 양수, tgIdx가 0보다 클 경우) : tgIdx을 1씩 감소
      ==> 인디케이터 li.on 변경 ,변경된 tgIdx로 animate(), 위치는 marginLeft 처리
  */  
  
  $(window).on('mousewheel DOMMouseScroll',function(e){
      clearTimeout(timerWheel);
      timerWheel = setTimeout(function(){
          //현재 애니메이트가 일어나고 있으면 함수 강제 종료
          if($cntwrap.is('animated')) return false;

          var delta = e.originalEvent.wheelDelta || e.originalEvent.detail*-1;

          if ( delta < 0 && tgIdx < total-1) {
            tgIdx++;
            if (tgIdx == total-1) marginX = -tgIdx*cntWidth-cntPadLeft; //마지막 프로필 부분 : #cnt1부터 #cnt5까지와 가장 처음 .cntwrap의 paddingLeft
            else marginX = tgIdx*cntWidth*-1;
          }
          else if (delta > 0 && tgIdx > 0) {
            tgIdx--;
            marginX = tgIdx*cntWidth*-1;
          }
          
          $cntwrap.stop().animate({marginLeft: marginX});
      },200);
  });

  //4) keydown이벤트
  $(document).on('keydown', function(e){
      if($cntwrap.is('animated')) return false;

      var key = e.keyCode;
      //console.log(key); // 오른쪽39/하단40, 왼쪽37/상단38 

      if ( (key == 39 || key ==40) && tgIdx < total-1) {
        tgIdx++;
        if (tgIdx == total-1) marginX = -tgIdx*cntWidth-cntPadLeft; //마지막 프로필 부분 : #cnt1부터 #cnt5까지와 가장 처음 .cntwrap의 paddingLeft
        else marginX = tgIdx*cntWidth*-1;
      }
      else if ((key == 37 || key ==38) && tgIdx > 0) {
        tgIdx--;
        marginX = tgIdx*cntWidth*-1;
      }
      
      $cntwrap.stop().animate({marginLeft: marginX});
  });

  //모달 열기 클릭 이벤트
  $('.open_btn').on('click', function (e) {
    e.preventDefault();
    var $openBtn = $(this);   //닫기버튼 클릭시 열어준 버튼으로 포커스 강제 이동
    var $mdCnt = $( $openBtn.attr('href') ); //#modal1, #modal2 문자타입이 아니라 선택자
    //console.log($mdCnt, typeof $mdCnt);
    var $closeBtn = $mdCnt.find('.close_btn');  //닫기 버튼
    var $first = $mdCnt.find('[data-link="first"]');    //처음 포커스가 이동할 대상
    var $last = $mdCnt.find('[data-link="last"]');      //마지막 포커스가 이동할 대상
    var timer = 0;    //resize 이벤트의 성능을 향상 시키기 
    var tgIdx2 = tgIdx;

    
    /* 
    1) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어
    aria-hidden="true" inert(비활성, 불활성)
    3) resize 이벤트로 열려질 모달의 위치 제어
    4) 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
    
    접근성을 위해 추가 : 닫기 버튼을 누르기 전까지 포커스는 모달 내부에 존재해야 함
    첫번째 링크에서 shift+tab을 누르면 가장 마지막으로 포커스 강제이동
    마지막 링크에서 shift(X)+tab을 누르면 가장 처음으로 포커스 강제이동
    */
   
   //1) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어
   $mdCnt.siblings().attr({'aria-hidden': true, inert: ''});

    //3) resize 이벤트로 열려질 모달의 위치 제어
    $(window).on('resize', function () {
      clearTimeout(timer);

      timer = setTimeout(function () {
        var y = ( $(window).height() - $mdCnt.outerHeight() ) / 2;
        var x = ( $(window).width() - $mdCnt.outerWidth() ) / 2;
        //console.log(x, y)
        $mdCnt.css({top: y, left: x});
      }, 100);
    });
    $(window).trigger('resize');
  //4) 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
  $mdCnt.css({visibility: 'visible'}).stop().animate({top:0},function(){
      $mdCnt.find('.close_btn').stop().fadeIn();
  });
  $first.focus();

  //첫번째 링크에서 shift+tab을 누르면 가장 마지막으로 포커스 강제이동
  $first.on('keydown',function(e){
      //console.log(e.keyCode); //tab : 9
      if(e.shiftKey && e.keyCode == 9){
          e.preventDefault(); //기본 기능을 먼저 제한
          $last.focus();
      }
  });
  //마지막 링크에서 shift(X)+tab을 누르면 가장 처음으로 포커스 강제이동
  $last.on('keydown',function(e){
      if(!e.shiftKey && e.keyCode == 9) {
          e.preventDefault();
          $first.focus();
      }
  });
  //닫기버튼클릭 : 모달컨텐츠 숨기기 (visibility), 모달 상세컨텐츠의 나머지 형제들을 스크린리더에서 접근할 수 있도록 되돌리기(aria-hidden,inert) ,열기 버튼으로 포커스 강제이동
  $closeBtn.on('click',function(){
      $mdCnt.find('.close_btn').hide();
      $mdCnt.stop().animate({top:'100%'},function(){
          $(this).css('visibility','hidden').stop().animate({scrollTop: 0}).siblings().removeAttr('aria-hidden inert');
      });
      $openBtn.focus();

      //모달 클릭전 상태로 되돌리기
      $cntwrap.css({marginLeft: tgIdx2*cntWidth*-1});
      tgIdx = tgIdx2;
  });


  //Esc 키를 누르면 모달 컨텐츠 닫기기
  $(window).on('keydown',function(e){
      //console.log(e.keyCode); //27
      if (e.keyCode == 27) $closeBtn.click();
  });

  }); 
});