jQuery(document).ready(function($) {

	'use strict';
    //***************************
    // Sticky Header Function
    //***************************
	  jQuery(window).scroll(function() {
	      if (jQuery(this).scrollTop() > 170){  
	          jQuery('body').addClass("consultant-sticky");
	      }
	      else{
	          jQuery('body').removeClass("consultant-sticky");
	      }
	  });

    //***************************
    // BannerOne Functions
    //***************************
      jQuery('.factory-banner-one').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          infinite: true,
          dots: false,
          arrows: false,
          fade: true,
          responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 400,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        });
    //***************************
    // ProjectSlider Functions
    //***************************
      jQuery('.factory-project-slider').slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          infinite: true,
          dots: false,
          prevArrow: "<span class='slick-arrow-left'><i class='icon-arrows42'></i></span>",
          nextArrow: "<span class='slick-arrow-right'><i class='icon-arrows42'></i></span>",
          responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 400,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        });
    //***************************
    // PartnerSlider Functions
    //***************************
      jQuery('.factory-partner-slider').slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          infinite: true,
          dots: false,
          prevArrow: "<span class='slick-arrow-left'><i class='icon-arrows42'></i></span>",
          nextArrow: "<span class='slick-arrow-right'><i class='icon-arrows42'></i></span>",
          responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 400,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        });
    //***************************
    // Twitter Slider Functions
    //***************************
      jQuery('.factory-twitter-slider').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          infinite: true,
          dots: true,
          arrows: false,
          responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 400,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        });

    //***************************
    // Parent AddClass Function
    //***************************
    jQuery(".factory-dropdown-menu,.factory-megamenu").parent("li").addClass("subdropdown-addicon");
    

    //***************************
    // Fancybox Function
    //***************************
    jQuery(".fancybox").fancybox({
      openEffect  : 'elastic',
      closeEffect : 'elastic',
    });

    // Tooltip Functions
    jQuery('[data-toggle="tooltip"]').tooltip();
    
    // Masonry Functions
    jQuery('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        fitWidth: true
      }
    });
    //***************************
    // CartToggle Function
    //***************************
    jQuery('a.factory-cart-btn').on("click", function(){
          jQuery('.factory-cart-box').slideToggle('slow');
          return false;
      });
      jQuery('html').on("click", function() { jQuery(".factory-cart-box").fadeOut(); });
    jQuery('.factory-user-section').on("click", function(event){ event.stopPropagation(); });

    //***************************
    // SearchToggle Function
    //***************************
    jQuery('a.factory-search-btn').on("click", function(){
          jQuery('.factory-search-popup').fadeToggle('slow');
          return false;
      });
    jQuery('a.factory-search-btn').on("click", function() { jQuery(this).toggleClass("factory-close-icon"); });

    //***************************
    // FilterAble Function
    //***************************
    var $grid = $('.consultant-classic-project').isotope({
      itemSelector: '.element-item',
      layoutMode: 'fitRows'
    });
    // filter functions
    var filterFns = {
      // show if number is greater than 50
      numberGreaterThan50: function() {
        var number = $(this).find('.number').text();
        return parseInt( number, 10 ) > 50;
      },
      // show if name ends with -ium
      ium: function() {
        var name = $(this).find('.name').text();
        return name.match( /ium$/ );
      }
    };
    // bind filter button click
    $('.consultant-project-filterable').on( 'click', 'a', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
    });
    // change is-checked class on buttons
    $('.consultant-project-filterable').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'a', function() {
        $buttonGroup.find('.project-active').removeClass('project-active');
        $( this ).addClass('project-active');
      });
    });

    //***************************
    // Progressbar Function
    //***************************
    jQuery('.progressbar1').progressBar({
            percentage : false,
            animation : true,
    });
    //***************************
    // Counter Function
    //***************************
    jQuery('#word-count1').jQuerySimpleCounter({
      end:200,
      duration: 10000
    });
    jQuery('#word-count2').jQuerySimpleCounter({
      end:900,
      duration: 8000
    });
    jQuery('#word-count3').jQuerySimpleCounter({
      end:80,
      duration: 8000
    });
    jQuery('#word-count4').jQuerySimpleCounter({
      end:170,
      duration: 8000
    });

});




//***************************
// Map Function
//***************************

if ($('#map').length > 0) {

  google.maps.event.addDomListener(window, 'load', init);
        
    function init() {
          // Basic options for a simple Google Map
          // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
          var mapOptions = {
              // How zoomed in you want the map to start at (always required)
              zoom: 11,

              // The latitude and longitude to center the map (always required)
              center: new google.maps.LatLng(40.6700, -73.9400), // New York

              // How you would like to style the map. 
              // This is where you would paste any style found on Snazzy Maps.
              styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#443d3d"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#f3f0e9"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e6f3d6"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#b49b78"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#e5dbcd"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eaf6f8"}]}]
          };

          // Get the HTML DOM element that will contain your map 
          // We are using a div with id="map" seen below in the <body>
          var mapElement = document.getElementById('map');

          // Create the Google Map using our element and options defined above
          var map = new google.maps.Map(mapElement, mapOptions);

          // Let's also add a marker while we're at it
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(40.6700, -73.9400),
              map: map,
              title: 'Snazzy!'
          });
  }

};