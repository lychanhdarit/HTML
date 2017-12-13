/*------------------------------------------------------------------
[Master Scripts]

Project:    Medina template
Version:    1.4.3

[Components]

	- Preloader
	- equalHeight
	- Retina ready
	- Full screen section
	- Fixed header wrap
	- Animation
	- Equal block height
	- Open mobile side
	- Mobile menu
	- Masonry gallery
	- Comments reply
	
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[ Preloader ]
*/
jQuery(window).on('load', function () {
    var $preloader = jQuery('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(350).fadeOut('slow');
});

jQuery( document ).ready(function() {
	"use strict";
	
	/*------------------------------------------------------------------
	[ equalHeight ]
	*/
	function equalHeight(group) {
        if(jQuery(window).width() >= '768') {
			var tallest = 0;
	       	jQuery(group).each(function() {
	            var thisHeight = jQuery(this).css('height', "").height();
	            if(thisHeight > tallest) {
	                tallest = thisHeight;
	            }
	        });
	        jQuery(group).height(tallest);
	    } else {
	    	jQuery(group).height('auto');
	    }
    }

    /*------------------------------------------------------------------
	[ Retina ready ]
	*/

	if (window.devicePixelRatio > 1) {
		var lowresImages = jQuery('.retina-img');

		lowresImages.each(function(i) {
			var lowres = jQuery(this).attr('src');
			var highres = lowres.replace(".", "@2x.");
			jQuery(this).attr('src', highres);
		});
	}

    /*------------------------------------------------------------------
	[ Full screen section ]
	*/

	jQuery(window).on("load resize", function(){
		jQuery('.full-screen:not(.fixed-height)').css('height', jQuery(window).outerHeight()-jQuery('.header').outerHeight());
		jQuery('.banner-block:not(.fixed-height)').each(function(){
			jQuery(this).find('.item').css('height', jQuery(this).height());
		});
		jQuery('main.fw-main-row').css('min-height', jQuery(window).outerHeight()-jQuery('.header').outerHeight()-jQuery('.footer').outerHeight());
	});

    /*------------------------------------------------------------------
	[ Fixed header wrap ]
	*/

	jQuery(window).on("load resize scroll", function(){
		if(jQuery(window).width() > '990') {
			if ( jQuery(document).scrollTop() > jQuery('.top-header').outerHeight() ) {
				jQuery('.header-wrap').addClass('fixed');
			} else {
				jQuery('.header-wrap').removeClass('fixed');
			}
		} else {
			jQuery('.header-wrap').removeClass('fixed');
		}
		jQuery('.header').css('height', jQuery('.top-header').outerHeight()+jQuery('.header-wrap').height()-1);
	});

    /*------------------------------------------------------------------
	[ Animation ]
	*/

	jQuery(window).on("load scroll", function(){
		jQuery('.animateNumber').each(function(){
			var num = jQuery(this).attr('data-num');
			
			var top = jQuery(document).scrollTop()+(jQuery(window).height());
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top && !jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').animateNumber({ number: num },2000);
			}
		});
		jQuery('.animateProcent').each(function(){
			var num = jQuery(this).attr('data-num');
			var percent_number_step = jQuery.animateNumber.numberStepFactories.append('%');
			var top = jQuery(document).scrollTop()+(jQuery(window).height());
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top && !jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').animateNumber({ number: num, numberStep: percent_number_step },2000);
				jQuery(this).css('width', num+'%');
			}
		});
	});

    /*------------------------------------------------------------------
	[ Equal block height ]
	*/

	jQuery(window).on("load resize", function(){
		equalHeight(jQuery('.footer [class^="fw-col-"]'));
		equalHeight(jQuery('.icon-box-col'));
        equalHeight(jQuery('.doctor-col'));
        jQuery('.price-list-t2').each(function(){
            equalHeight(jQuery(this).find('.price-list-t2-item'));
        });
	});

    /*------------------------------------------------------------------
    [ Open mobile side ]
    */

    jQuery('.mobile-side-button').on("click", function(){
        if (jQuery(this).hasClass('active')) {
            jQuery(this).removeClass('active').parent().find('.mobile-side').removeClass('active');
        } else {
            jQuery(this).addClass('active').parent().find('.mobile-side').addClass('active');
        };
    });

    /*------------------------------------------------------------------
    [ Open sidebar ]
    */

    jQuery('.side-div').on("click", function(){
        jQuery(this).addClass('active');
        jQuery('.sidebar-wrap').addClass('active');
    });
    jQuery('.sidebar-wrap .close').on("click", function(){
        jQuery(this).removeClass('active');
        jQuery('.sidebar-wrap').removeClass('active');
    });

    /*------------------------------------------------------------------
	[ Mobile menu ]
	*/

	jQuery(window).on("load resize", function(){
		if(jQuery(window).width() <= '990') {
			jQuery('.mobile-navigation .menu-item-has-children > a,.mobile-navigation .page_item_has_children > a').on("click", function(){
				if(!jQuery(this).hasClass('active')) {
					jQuery(this).addClass('active').parent().children('.sub-menu,.children').slideDown().siblings().children('.sub-menu,.children').slideUp();
					return false;
				}
			});
		} else {
			jQuery('.mobile-side').removeClass('active');
		}
	});

    /*------------------------------------------------------------------
	[ Masonry gallery ]
	*/

	jQuery(window).on("load", function(){
		if(jQuery('.gallery-masonry').length > 0){
			jQuery('.gallery-masonry').isotope({
				itemSelector: '.gallery-item',
				masonry: {
					columnWidth: '.gallery-item'
				}
			});
		}
	});

	/*------------------------------------------------------------------
	[ Comments reply ]
	*/

	jQuery('.replytocom').on('click', function(){
		var id_parent = jQuery(this).attr('data-id');
		jQuery('#comment_parent').val(id_parent);
		jQuery('#commentform-area').appendTo(jQuery(this).parents('.comment-item'));
		return false;
	});

	/*------------------------------------------------------------------
	[ Quantity ]
	*/

	jQuery('.quantity .quantity-minus').on("click", function(){
		var val = jQuery(this).parent().parent().find('.input-text').val();
		if(val > 1) {
			val = parseInt(val) - 1;
			jQuery(this).parent().parent().find('.input-text').val(val);
			jQuery('.update_cart').removeAttr('disabled')
		}
		return false;
	});

	jQuery('.quantity .quantity-plus').on("click", function(){
		var val = jQuery(this).parent().parent().find('.input-text').val();
		val = parseInt(val) + 1;
		jQuery(this).parent().parent().find('.input-text').val(val);
		jQuery('.update_cart').removeAttr('disabled')
		return false;
	});
});

/*------------------------------------------------------------------
[ Popup gallery ]
*/
var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.getElementsByTagName("a")[0]; // <a> element

            console.log(figureEl);
            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        
        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return ((el.tagName && el.tagName.toUpperCase() === 'ARTICLE') || (el.tagName && el.tagName.toUpperCase() === 'LI') || (el.tagName && el.tagName.toUpperCase() === 'DIV'));
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

if(jQuery('.my-gallery').length > 0) {
	jQuery('body').append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div><div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div></div></div></div></div>')
	initPhotoSwipeFromDOM('.my-gallery');
}

