jQuery(function() {
    
	var $ = jQuery;
    
  $('body').addClass('postload')


    $(document).ready(function() {
	
	setTimeout(function() {
        $('#loading').fadeOut('slow', function() {
        });   
    }, 1000);
    
        // General styling        
		$('.wsite-form-radio-container, .wsite-com-product-option-dropdown, .wsite-com-product-option-radio').jqTransform();


		$('#navmobile, .no-header #wrapper').css({"padding-top" : $(".header-wrap").height() + "px"});

        // Sticky Nav Collapse		
        $(function(){	
    var headeron = $(document).scrollTop();
    var headeroff = $('.header-wrap').outerHeight();

    $(window).scroll(function() {
        var fadeheader = $(document).scrollTop();

        if (fadeheader > headeroff){$('.header-wrap').addClass('offscreen');} 
        else {$('.header-wrap').removeClass('offscreen');}

        if (fadeheader > headeron){$('.header-wrap').removeClass('onscreen');} 
        else {$('.header-wrap').addClass('onscreen');}				

     });
});
              	        
        // Add fullwidth class to gallery thumbs if less than 6

      	$('.imageGallery').each(function(){
      	  if ($(this).children('div').length <= 12) {
      	    $(this).children('div').addClass('fullwidth-mobile');
      	  }
      	});
          	
        // --------------------------------------------------------------------------------------//
        
        // Add current class to store gallery thumb
        
        $("#wsite-com-product-images-strip a:first").addClass("current");

        $("#wsite-com-product-images-strip a").click(function(){
          $(".current").removeClass("current");
          $(this).addClass("current");
        });
        
        // --------------------------------------------------------------------------------------//
        
        // Add swipe to fancybox mobile 

        var swipeGallery = function(){
          setTimeout(function(){
          var touchGallery = document.getElementsByClassName("fancybox-wrap")[0];
          var mc = new Hammer(touchGallery);
          mc.on("panleft panright", function(ev) {
            if (ev.type == "panleft") {
              $("a.fancybox-next").trigger("click");
            }
            else if (ev.type == "panright") {
              $("a.fancybox-prev").trigger("click");
            }
            swipeGallery();
          });
          }, 500);
        };
    		if ($(window).width() < 1024) {
          $("body").on( "click", "a.w-fancybox", function() {
            swipeGallery();
          });
      	}

        
        // --------------------------------------------------------------------------------------//
      
        // Watch for changes on non-mobile nav

        if ($(window).width() < 768) {

          var mainNav = '#nav',
              mobileNav = "#navmobile";

          $(mainNav).on('DOMSubtreeModified propertychange', function() {
            $(mainNav + " li a").each(function(){
              // Differentiating post-load nav elements by the presence of an id
              if ($(this).attr("id") && $(this).attr("id") != "wsite-nav-cart-a") {
                var navLinkId = $(this).attr("id");
                var navLinkParent = $(this).parent().detach();

                // Append to mobile nav if new element
                if (!$(mobileNav + " #"+navLinkId).length) {
                  $(mobileNav + " .wsite-menu-default").append(navLinkParent);
                  var newheight = $(mobileNav + " .wsite-menu-default").height();
                  $(".wsite-mobile-menu").height(newheight);
                }
              }
            });
          });          
        }
	


$(".accordion").each(function () {
        var $initialIndex = $(this).attr('data-initialIndex');
        if ($initialIndex == undefined) {
            $initialIndex = 0;
        }
        $(this).tabs("div.accordion-content", { tabs: '.accordion-toggle', effect: 'slide', initialIndex: $initialIndex });
    });

	
	// --------------------------------------------------------------------------------------//
          
		  $(window).ready(function() {
               $('.flexslider').flexslider();
          });
      
          $(document).ready(function () {
              $(".flex-direction-nav").hide();
              $(".slider-container").hover( function () {
              $(".flex-direction-nav").fadeToggle();
          });
			  
		  $('.testi-slider.flexslider').flexslider({
              animation: "fade"
          });
       });
	   
	   

		$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 0
        }, 1000);
        return false;
      }
    }
  });
});
	// -------------------------------------------------------------------------------------//
	
	//Wow
new WOW().init();

    // -------------------------------------------------------------------------------------//
	
   });

    
});

