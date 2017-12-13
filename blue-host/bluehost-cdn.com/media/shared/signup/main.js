document.validate_set_all_hook   = function (e) { document.getElementById('general_error').innerHTML = 'Please correct the errors below.' };
document.validate_clear_all_hook = function (e) { document.getElementById('general_error').innerHTML = '' }
var more = 0; // looking at more
var parent_ele_popup = undefined; // stores the parent ele of lightbox.
function toggle_more_payment() {
  if(more) {
    $(".toggle").hide();
    $(".more_less").text('More payment options');
  } else {
    $(".toggle").show();
    $(".more_less").text('Fewer payment options');
  }
  more = !more;
}
function toggle_plan_types() {
    $('#plan_types').toggleClass('hidden');
}
function signup_ajax() {
  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  if($('#email').val() != ''&& pattern.test($('#email').val())) {
    discard = $.get('/web-hosting/signup/ajax/signup', {
      'first' : $('#firstname').val(),
      'last'  : $('#lastname').val(),
      'email' : $('#email').val(),
      'fc_id' : $('#cust_id').val()
    },function(data){},'json');
  }
}
$(document).on('click','[data-google-checkout-behavior]',function() {
var data = $(this).data('google-checkout-behavior');
    if(data['event']){
        dataLayer.push(data);
    }
});
function toggle_more(anchor) {
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(searchClass,node,tag) {
        var classElements = new Array();
        if (node == null) { node = document; }
        if (tag == null) { tag = '*'; }
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if ( pattern.test(els[i].className) ) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }
  }
  var els = document.getElementsByClassName('hidden_alternates');
  var cur;
  for (var i = 0; i< els.length; i++) {
    cur = els[i].style.display;
    els[i].style.display = (cur == 'none') ? '' : 'none';
  }
  anchor.innerHTML = "Show " + ((cur == 'none') ? 'fewer' : 'more') + " suggestions...";
  //ie only fixup for max-height bug
  var container = document.getElementById('domain_container');
  if (container && container.offsetHeight > 500) {
    container.style.height = '30em';
  }
  else if (container && container.offsetHeight > 300 && cur == ''){
    container.style.height = '';
  }
}

function toggle_details() {
    overlay_show();
    var body = $('<div class="containment"><a class="close_overlay"></a><div class="wrapper"></div></div>');
    body.appendTo('body');
    var pro_d = $('#callout_details').html();
    $('.containment .wrapper').html(pro_d);
    $('.containment').css('width','483px');
    $('.containment').center();
    $('.containment').show();
    $('.close_overlay').click(function() {
        $('.containment').remove();
        $('.ui-widget-overlay').fadeOut();
    });
}

function toggleSSLDisplay(){
    var showStuff = false;
    if (!$('#term').val()) {
        $( "input[name='term']" ).each(function(){
            var el = $(this);
            var val = el.val();
            var term = val.match(/.+-(\d+)/)[1];
            if( el.prop('checked') && ( term === '12' ) && !val.match(/pro/)){
                showStuff = true;
            }
        });
    }
    else {
        var termVal = $('#term').val();
        var term = termVal.match(/.+-(\d+)/)[1];
        if( term === '12' && !termVal.match(/pro/) ) {
            showStuff = true;
        }
    }
    var sslRef = $('#sslcertificate');
    if(showStuff){
        sslRef.parent().show();
        $('#sslcertificate_moreinfo').show();
    }
    else {
        sslRef.attr('checked',false);
        sslRef.parent().hide();
        $('#sslcertificate_moreinfo').hide();
    }
}
$(document).on('change',"input[name='term']", function() {
    toggleSSLDisplay();
});
$(document).on('change','#term',function(){
    toggleSSLDisplay();
});
$(document).on('change','#plan',function() {
    var match = $('#plan').val().match(/:(\w+)-(\d+)/);
    var plan = match[1], term = match[2];
    $('.nplansel').each(function() {
        var this_match = $(this).attr('for').match(/:(\w+)-(\d+)/);
        var this_plan = this_match[1], this_term = this_match[2];
        if ( this_plan === plan ) {
            if (this_term === term ) {
                $('[name=term][type=radio]:checked').prop('checked', false);
                $(this).find('input').prop('checked', true);
            }
            $(this).removeClass('hidden');
        } else {
            $(this).addClass('hidden');
        }
    });
    compute_totals();
    toggleSSLDisplay();
    toggle_plan_types();
});

$(document).ready(function(){
    var domain = $('[name=domain]').val();
    var domain_regex = new RegExp('(?:@|[.]|^)' + domain.replace(/\./g,'\\.') + '$');
    var emailWarnText = $('#email_conf').html()
    $('#email_conf').html('');
    $('#email').on('keyup', function(){
        var val = $(this).val();
        if( val.match(domain_regex) ) {
            $('#email_conf').html(emailWarnText.replace(/{{domain}}/,domain).replace(/{{address}}/,val));
        }
        else {
            $('#email_conf').html('');
        }
    });
    toggleSSLDisplay();
    jQuery.fn.center = function () {
        this.css("position","absolute");
        this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
        this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
        return this;
    }
    var $overlay = $('<div class="ui-widget-overlay"></div>').hide().appendTo('body');
    $('.wide_block').delegate('a.overlay','click',(function(e){e.preventDefault();}));
    $('.auto_fill').click(function(){test_fill($(this).attr('index'))});
    $('.auto_submit').click(function(){document.submission = 1; test_fill($(this).attr('index')); $('#signup_form').submit();});
    $('.jsonly').show();
    if(typeof compute_totals === 'function'){
        compute_totals();
    }
});
function overlay_show() {
    var overlay = $('.ui-widget-overlay');
    overlay.fadeIn();
    overlay.click(function() {
        overlay.fadeOut();
        $('.containment').remove();
    });
}
function create_overlay(href, title, form_ele, width, height) {
    width = width || 650;
    height = height || 500;
    $.lightbox(href + '/content_only', '>', title, width, height);
    parent_ele_popup = form_ele;
}

function close_overlay() {
    parent_ele_popup = undefined;
    $('.lightbox_container')[0].remove();
    $('.lightbox_bg')[0].style.display = 'none';
    $('html, body').css({overflow: 'auto', height: 'auto'});
}

$(document).on('click', '#keep, #turnOff', function(e) {
    var keep_lightbox = e.currentTarget.id === 'keep';

    $(parent_ele_popup).prop('checked', keep_lightbox);
    compute_totals(parent_ele_popup);
    close_overlay();
});
