// publishing UI javascript
$(function(){
  if ($('[include-html]').length !== 0) {
    includeHTML(); // HTML include (퍼블리싱 확인용)
  }
  cmmnui();
  loginForm();
  // 210425 추가
  if ($('.list-table__bodyscroll', '.unit').length !== 0) {
    $(window).on('resize', unitBodyscrollHeight).resize();
  }
});

// 210517 해상도별 카피라이트 위치 조정
$(window).on('load', function(){
  $(window).on('resize', function(){
    var $winW = $(window).width();
    var $bodyH = parseInt($('body').height());
    var $lyRightH = parseInt($('.ly-right').prop('scrollHeight'));
    var $copy = $('.copylight');
    // console.log(`$bodyH:${$bodyH}`, `$lyRightH:${$lyRightH}`);

    if (0 < $winW && 1900 > $winW) {
      if ($bodyH === $lyRightH) {
        $copy.addClass('modify');
      } else {
        $copy.removeClass('modify');
      }
    } else if (1901 < $winW) {
      if ($bodyH === $lyRightH || $bodyH < $lyRightH) {
        $copy.addClass('modify');
      } else {
        $copy.removeClass('modify');
      }
    }
  }).resize();
});

// 공통 UI
function cmmnui () {

  // 모달 팝업
  $('.btn__modal--open').on('click', function () {
    $(this).modal({
      closeExisting: false,
      clickClose: false
    });
    return false;
  });

  // gnb 210427 수정
  setTimeout(function () { // setTimeout()은 퍼블리싱 확인용으로 개발에서는 적용하지 마세요.
    var $gnbSelector = '.gnb-list > li';
    $(document).on('mouseenter', $gnbSelector, function () {
      if ($(this).find('.gnb-list__item').length !== 0) {
        $(this).children('.gnb-list__item').stop().slideDown(200);
        $('.datepicker-container').addClass('zindex0');
      } else {
        return;
      }
    });
    $(document).on('mouseleave', $gnbSelector, function () {
      $(this).children('.gnb-list__item').stop().slideUp(200);
      $('.datepicker-container').removeClass('zindex0');
    });
  }, 100);

  // 200824 datepicker 추가
  $('[data-toggle="datepicker"]').datepicker({
    language: 'ko-KR',
    format: 'yyyy-mm-dd',
    autoHide: true,
    zIndex: 10
  });

  // 200826 input autocomplete 비활성화
  (function(){
    var inputTxt = $('[type="text"], [type="number"]');
    var inputCalendar = $('.input-calendar');
    inputTxt.not(inputCalendar).attr('autocomplete', 'off');
  })();

  // 200920 멀티셀렉트박스 드롭다운 효과 추가
  $('.multi-selectbox__btn').on('click', function(){
    $(this).next().slideToggle(200);
  });
  $('.multi-selectbox__confirm').on('click', function(){
    $('.multi-selectbox__btn').trigger('click');
  });
}

// 로그인 폼 영역 포커스
function loginForm () {
  var $txtInput = $('.loginbox__input input')
  $txtInput.on('focus', function(){
    $(this).parent().addClass('active');
  });
  $txtInput.on('blur', function(){
    $(this).parent().removeClass('active');
  });
}

// unit요소 안에 bodyscroll요소의 높이값 셋팅 (210425 추가)
function unitBodyscrollHeight () {
  var $tblEl = $('.list-table__inner');
  var $ancestorH;
  $tblEl.closest('.unit').addClass('is-bodyscroll');
  $ancestorH = $tblEl.closest('.is-bodyscroll').height();
  $tblEl.css('height', $ancestorH - 80); // 210508 수정
}

// lnb (210427 수정) 
var lnb = {};
lnb.init = function () {
  if ($('.lnb').length !== 0) {
    $('.lnb__list li').each(function(){
      if ($(this).find('>ul').length > 0) {
        return;
      }
      $(this).addClass('no-depth');
    });

    // 210505 수정
    $(document).on('click', '.lnb__list li .btn-collapse', function(e){ // 210501 클릭 이벤트 셀렉트 수정
      e.stopPropagation();
      var $this = $(this);
      var $depthTarget = $this.next(); //ul

      if ($depthTarget.css('display') == 'none') {
        $this.parent().addClass('active');
        $depthTarget.slideDown(200);
      } else {
        $depthTarget.slideUp(200);
        $this.parent().removeClass('active');
      }
    });
  }
}

lnb.select = function (clickedEl){
  lnb.removeSelect();
  $target = $(clickedEl);
  $target.addClass('selected');
}

lnb.removeSelect = function (){
  $('.lnb__list li a').each(function(i, e){
  $(this).removeClass('selected');
  });
}

// 210428 추가 : 현재 페이지에 대한 lnb 메뉴 활성화
lnb.currentActive = function (clickedEl){
  $target = $(clickedEl);
  $target.addClass('selected').parents('li:not(.no-depth)').addClass('active').children('ul').show(); // 210506 수정
  //$target.addClass('selected').closest('ul').prev('.btn-collapse').trigger('click');
}

// 지점관리 lnb - 210506 추가
var lnbBranch = {};
lnbBranch.init = function () {
  if ($('.lnb').length !== 0) {
    $('.lnb__list li').each(function(){
      if ($(this).find('>ul').length > 0) {
        return;
      }
      $(this).addClass('no-depth');
    });

    $(document).on('click', '.lnb__list li .btn-collapse', function(e){
      e.stopPropagation();
      var $this = $(this);
      var $depthTarget = $this.next(); //ul
      var $siblings = $this.parent().siblings(); //li 형제 요소들
      
      $this.parent('li').find('ul li').removeClass('active');
      $siblings.removeClass('active');
      $siblings.find('ul').slideUp(200);

      if ($depthTarget.css('display') == 'none') {
        $this.parent().addClass('active');
        $depthTarget.slideDown(200);
        $siblings.find('.btn-collapse').removeClass('selected');
      } else {
        $depthTarget.slideUp(200);
        $this.parent().removeClass('active');
        $depthTarget.find('ul').slideUp(200);
      }
    });
  }
}

// 지점관리 - 현재 페이지에 대한 lnb 메뉴 활성화
lnbBranch.currentActive = function (clickedEl){
  $target = $(clickedEl);
  $target.addClass('selected').parents('li:not(.no-depth)').addClass('active').children('ul').show();
}