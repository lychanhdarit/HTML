/* globals ScrollFilter, YT, open_chat_window */
/* exported onYouTubePlayerAPIReady */

// Parallax Effect
// To give your background images parallax give them a class of "parallax",
// and include an optional data-parallax attribute to specify the speed:
// 1 = background stays still while page scrolls around it
// 8 = for every 8 pixels the page scrolls this will scroll 1 (default)
function use_parallax() {
    'use strict';

    var to_parallax = [];
    var safari = 0;
    var starting_top = 0;

    if (
        -1 !== navigator.userAgent.indexOf('Safari') &&
        -1 === navigator.userAgent.indexOf('Chrome')
    ) {
        safari = 1;
    }

    window.get_parallax_position = function(item, scroll_top) {
        if (!(scroll_top)) {
            scroll_top = $(window).scrollTop();
        }

        var midpoint = item.attr('midpoint');
        starting_top = item.data('background_height') / -4;

        var factor = item.data('parallax');

        return Math.floor((scroll_top - midpoint) / factor + starting_top);
    };

    var manage_parallax = function() {
        var scroll_top = $(window).scrollTop();

        for (var iterator = 0; iterator < to_parallax.length; iterator += 1) {
            if (!(to_parallax[iterator].data('suspend_parallax'))) {
                var parallax_position = window.get_parallax_position(
                    to_parallax[iterator],
                    scroll_top
                );

                to_parallax[iterator].css({
                    'background-position': '50% ' + parallax_position + 'px'
                });
            }
        }
    };

    var window_height = $(window).height();

    if (767 < document.documentElement.clientWidth) {
        $('.parallax').each(function() {
            var temp_image_url = $(this).css('background-image').replace(/^.*?\("*|"*\).*$/g, '');
            var temp_image = new Image();
            var item = $(this);

            temp_image.onload = function() {
                item.data('background_height', temp_image.height);
                var offset_top = item.offset().top;

                var midpoint = 0;
                if (item.hasClass('cover_bottom')) {
                    var css_offset = item.css('background-position');
                    if (item.css('background-position')) {
                        css_offset = parseInt(css_offset.replace(/^.* ([\-\d]+)px/, '$1'), 10);
                    }
                    midpoint = offset_top - item.height() - css_offset * 10 - window_height / 2;
                }
                else {
                    midpoint = offset_top + item.height() / 2 - window_height / 2;
                }

                item.attr('midpoint', midpoint);

                if (!(item.data('parallax'))) {
                    item.data('parallax', 8);
                }

                to_parallax.push(item);

                manage_parallax();
            };
            temp_image.src = temp_image_url;
        });
    }

    $(window).on('scroll', function() {
        if (767 < document.documentElement.clientWidth) {
            manage_parallax();
        }
    });
}

// Price browser
// Works with elements classed 'price_browser' to flip through pricing & options.
function PriceBrowser(target) {
    'use strict';

    var self = this;

    self.dom_element = target;

    self.parts = [];
    self.part_sequence = [];
    self.detail_display = self.dom_element.find('ul.initial_display');
    self.showing_now = 1;
    self.now_animating = 0;
    self.column_width = self.dom_element.find('.price_browser_core').width();
    self.header_offset = 48;

    var part;
    var matches;

    // Track down all of the elements and data
    var plans = self.dom_element.find('.plans');
    plans.find('div').each(function() {
        matches = $(this).attr('class').match(/^plan_(\w+)/, '');
        if (matches && matches[1]) {
            part = matches[1];
            self.parts[part] = {
                header: $(this),
                link: $(this).data('link')
            };

            if ($(this).hasClass('initial_display')) {
                self.showing_now = self.part_sequence.length;
            }

            self.part_sequence.push(part);
        }
    });

    // Copy the various pricing plans to the "scroll behind" divs
    self.background = {};

    self.dom_element.prepend('<div class="behind_price_container right"></div>');
    self.dom_element.prepend('<div class="behind_price_container left"></div>');

    self.background.left_plan = self.dom_element.find('.behind_price_container.left');
    self.background.right_plan = self.dom_element.find('.behind_price_container.right');

    var new_background_width = self.dom_element.width() / 2 - self.column_width / 2;
    self.background.left_plan.css({width: new_background_width});
    self.background.right_plan.css({width: new_background_width});

    var plan_html = '<div class="behind_price_bar">' + plans.html() + '</div>';

    self.background.left_plan.html(plan_html);
    self.background.right_plan.html(plan_html);

    var iterator = 0;
    self.background.left_plan.find('div').each(function() {
        $(this).data('plan_sequence', iterator);
        iterator += 1;
    });

    iterator = 0;
    self.background.right_plan.find('div').each(function() {
        $(this).data('plan_sequence', iterator);
        iterator += 1;
    });

    self.background.left_plan_display = self.background.left_plan.find('.behind_price_bar');
    self.background.right_plan_display = self.background.right_plan.find('.behind_price_bar');

    self.background.plans_pane_width = self.background.left_plan.width();
    self.background.plans_width = self.background.left_plan.find('.behind_price_bar').width();
    self.background.single_plan_width = self.background.plans_width / self.part_sequence.length;

    // put things in their proper positions
    for (iterator = 0; iterator < self.part_sequence.length; iterator += 1) {
        var distance = (iterator - self.showing_now) * self.column_width;
        part = self.parts[self.part_sequence[iterator]].header;
        part.css({left: (distance + self.header_offset) + 'px'});
        part.show();
    }

    var graph_count;

    self.dom_element.find('.price_browser_core ul').each(function() {
        matches = $(this).attr('class').match(/^details_(\w+)/, '');
        if (matches && matches[1] && self.parts[matches[1]]) {
            part = matches[1];
            self.parts[part].details_dom = $(this);
            self.parts[part].details = [];

            graph_count = 0;

            self.parts[part].details_dom.find('li').each(function() {
                var details = {};
                details.text = $(this).html();
                details.graph = $(this).data('graph');
                graph_count += 1;

                self.parts[part].details.push(details);
            });
        }
    });

    // Add the graph elements
    var graph_html = '<div class="bar_container">';
    while (graph_count) {
        graph_html += '<span class="bar"></span>';
        graph_count -= 1;
    }
    graph_html += '</div>';
    self.dom_element.find('.price_browser_wrapper').prepend(graph_html);

    // click on the "behind the bar" prices to flip to them
    self.dom_element.on('click', '.behind_price_bar div', function(the_event) {
        self.clearSelection();
        $(the_event.target).blur();
        self.rotateTo($(the_event.currentTarget).data('plan_sequence') - 1);
    });

    // Click on the side-to-side icons to rotate
    self.dom_element.on('click', '.arrow', function(the_event) {
        self.clearSelection();
        the_event.preventDefault();

        var event_target = $(the_event.target);
        event_target.blur();
        var to_change = 1;
        if ($(this).hasClass('left')) {
            to_change = -1;
        }

        self.rotateTo(self.showing_now + to_change);
    });

    // Rotate to a given slot
    self.rotateTo = function(rotate_to) {
        var self = this;
        var iterator = 0;

        if (self.now_animating) {
            return;
        }
        self.now_animating = 1;

        if (0 > rotate_to) {
            rotate_to = self.part_sequence.length + rotate_to + 1;
        }
        else if (rotate_to === self.part_sequence.length) {
            rotate_to = rotate_to - self.part_sequence.length;
        }

        if (rotate_to === self.showing_now) {
            return;
        }

        var vector = (self.showing_now - rotate_to) * self.column_width;
        if (0 > vector) {
            vector = '-=' + Math.abs(vector) + 'px';
        }
        else {
            vector = '+=' + vector;
        }

        var finished = 0;

        self.dom_element.find('header a').each(function() {
            if ($(this).is(':hidden')) {
                $(this).fadeIn();
            }

        });
        if (rotate_to === self.part_sequence.length - 1) {
            self.dom_element.find('header a.right').fadeOut();
        }
        else if (0 === rotate_to) {
            self.dom_element.find('header a.left').fadeOut();
        }

        // Rotate the header
        var are_we_finished = function() {
            // only do this once
            if (!(finished)) {
                finished = 1;
                self.now_animating = 0;
                self.showing_now = rotate_to;
            }
        };
        for (iterator = 0; iterator < self.part_sequence.length; iterator += 1) {
            var this_part = self.parts[self.part_sequence[iterator]].header;
            this_part.animate({left: vector}, are_we_finished);
        }

        // Update the detail info below the header
        var showing_now = self.parts[self.part_sequence[rotate_to]];

        iterator = 0;
        var elements = [];
        self.dom_element.find('ul.initial_display li').each(function() {
            elements.push($(this));
            iterator += 1;
        });

        var interval_position = 0;
        iterator -= 1;

        self.updateDisplay(rotate_to);

        self.dom_element.find('.btn_primary').attr('href', showing_now.link);

        // Update the data one bit at a time for animation
        var interval = setInterval(function() {

            elements[interval_position].html(showing_now.details[interval_position].text);

            var glow_element = elements[interval_position].find('b');

            glow_element.addClass('price_glow');

            setTimeout(function() {
                glow_element.removeClass('price_glow');
            }, 68);

            if (interval_position >= iterator) {
                clearInterval(interval);

                // Animate the button after replacing the data -- but not in IE
                if ('Microsoft Internet Explorer' !== navigator.appName) {
                    var button = self.dom_element.find('.btn_primary');
                    button.animate({'margin-top': '+=8px'}, 100, function() {
                        button.animate({'margin-top': '-=12px'}, 100, function() {
                            button.animate({'margin-top': '+=4px'}, 100, function() {
                            });
                        });
                    });
                }
            }
            interval_position += 1;
        }, 30);
    };

    self.updateDisplay = function(price_item_to_display, no_animate) {
        var self = this;

        var animate = 1;
        if (no_animate) {
            animate = 0;
        }

        var item = self.parts[self.part_sequence[price_item_to_display]];

        // Update the background pricing display position
        var new_left_margin = self.background.plans_pane_width -
            price_item_to_display * self.background.single_plan_width;

        var new_right_margin = -1 * self.background.plans_width +
            self.background.single_plan_width *
            (self.part_sequence.length - 1 - price_item_to_display);

        if (animate) {
            self.background.left_plan_display.animate({'margin-left': new_left_margin});
            self.background.right_plan_display.animate({'margin-left': new_right_margin});
        }
        else {
            self.background.left_plan_display.css({'margin-left': new_left_margin});
            self.background.right_plan_display.css({'margin-left': new_right_margin});
        }

        // Update the graph sizes
        var iterator = 0;
        self.dom_element.find('div.bar_container span').each(function() {
            var new_width = Math.floor(self.column_width * item.details[iterator].graph / 100);
            if (animate) {
                $(this).animate({width: new_width});
            }
            else {
                $(this).css({width: new_width});
            }
            iterator += 1;
        });

    };

    // Make sure no text goes around animated & selected
    self.clearSelection = function() {
        if (document.selection) {
            document.selection.empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };

    // Set the starting position for the in-the-background pricing displays
    self.background.left_plan_display.css({'margin-left': self.background.plans_pane_width});
    self.background.right_plan_display.css({
        'margin-left': (-1 * self.background.plans_pane_width)
    });

    // Initial setting for the graph sizes and background pricing display position
    self.updateDisplay(self.showing_now, 1);
}

// Need a tiny delay on rendering this due to some odd "we don't know the size yet"
// race conditions
setTimeout(function() {
    'use strict';

    $('.price_browser').each(function() {
        window.test = new PriceBrowser($(this));
    });
}, 200);

// Expanding Video Bar
// An '.expanding_video_bar' will expand when you click on it, and replace
// whatever content is inside it with a Youtube video.
// The video will be shown as large as possible within the browser window,
// and the page will be scrolled to view the full video height.
// This functions automatically on any item with the class "expanding_video_bar"
// and a data-video attribute that specifies a YouTube code to load, like:
// <section class="expanding_video_bar" data-video="yYzSlAHUNLQ">View!</section>

window.youtube_ready_callback = '';

function onYouTubePlayerAPIReady() {
    'use strict';

    if (window.youtube_ready_callback) {
        window.youtube_ready_callback();
    }
}

function youtube_tools() {
    'use strict';

    var find_video_bar = function(clicked_item) {
        if (clicked_item.hasClass('expanding_video_bar')) {
            return clicked_item;
        }
        else {
            return clicked_item.parents('.expanding_video_bar');
        }
    };

    var hide_video = function(video_bar) {
        if (video_bar.data('showing')) {
            video_bar.data('showing', 0);

            // Hide before remove to fix IE8 black screen
            video_bar.find('.video_container').hide().remove();
            video_bar.data('player', null);

            var background_position;
            var movement;
            var work_with_parallax = 0;
            var destination;
            var animation_options = {};

            if (video_bar.data('work_with_parallax')) {
                work_with_parallax = 1;
                destination = window.get_parallax_position(video_bar);
                movement = Math.floor(Math.abs(destination) / 18);
                background_position = parseFloat(video_bar.css('background-position').replace(/^.* ([\-\d]+)px/, '$1'), 10);

                if (0 > destination) {
                    movement = -1 * movement;
                }

                animation_options.step = function() {
                    if (
                        (0 > movement && background_position <= destination) ||
                        (0 < movement && background_position >= destination)
                    ) {
                        background_position = destination;
                    }
                    else {
                        background_position += movement;
                    }
                    video_bar.css('background-position', '50% ' + background_position + 'px');
                };
            }

            animation_options.complete = function() {
                video_bar.data('suspend_parallax', 0);

                var new_css = {
                    cursor: 'auto'
                };
                if (video_bar.data('background_image')) {
                    new_css['background-image'] = video_bar.data('background_image');
                }
                video_bar.css(new_css);

                video_bar.data('original_children').fadeIn();
            };
            video_bar.animate({
                height: video_bar.data('original_height') + 'px'
            }, animation_options);
        }
    };

    var load_youtube_api = function(callback) {
        if (window.youtube_api_loaded) {
            if (callback) {
                callback();
            }
        }
        else {
            window.youtube_ready_callback = function() {
                window.youtube_api_loaded = 1;
                if (callback) {
                    callback();
                }
            };
            // When this loads it runs "onYouTubeAPIReady()" which then calls "window.youtube_ready_callback()"
            $.cacheScript('https://www.youtube.com/player_api');
        }
    };

    // preload the API after 6 seconds for faster response when they click play
    setTimeout(function() {
        load_youtube_api();
    }, 8000);

    var load_video = function(video_bar, video_player_container, video) {
        load_youtube_api(function() {
            var player = video_bar.data('player');
            if (player) {
                if (player.loadVideoById) {
                    player.loadVideoById(video);
                }
            }
            else {
                var id = 'youtube_' + Math.random().toString().substring(2);
                video_player_container.append('<div id="' + id +
                    '" class="video_container"></div>');

                player = new YT.Player(id, {
                    width: video_bar.data('width'),
                    height: video_bar.data('height'),
                    videoId: video,
                    playerVars: {
                        autoplay: 1,
                        version: 3,
                        enablejsapi: 1,
                        rel: 0,
                        controls: 0, // 0 = none, 2 = some (2 is the same as 1 but gives better performance)
                        showinfo: 0
                    },
                    events: {
                        onStateChange: function(event) {
                            if (0 === event.data) {
                                hide_video(video_bar);
                            }
                        }
                    }
                });

                video_bar.data('player', player);
            }
        });
    };

    var show_video = function(click_target, video_bar) {

        var video_player_container = video_bar;
        var work_with_parallax = 0;
        var full_width = 1;
        var in_place = video_bar.hasClass('in_place_video');

        video_bar.data('status', 'open');

        if (video_bar.data('video-target')) {
            video_player_container = video_player_container.find('.' +
                video_bar.data('video-target'));

            full_width = 0; // This is targeted at some specific div rather than full_width
        }

        var video = '';

        var matches = click_target.attr('href').match(/\?v\=(.*)/);
        if (matches) {
            video = matches[1];
        }
        else {
            window.alert('No video specified!');
            return;
        }

        if (video_bar.data('showing')) {
            load_video(video_bar, video_player_container, video);
            return;
        }

        if (!(video_bar.data('original_height'))) {
            video_bar.data('original_height', video_player_container.height());
            video_bar.data('original_children', video_player_container.children());
        }

        video_bar.data('showing', 1);

        video_bar.css({cursor: 'pointer'});

        var video_player_visible_width = video_player_container.innerWidth();
        var offset = video_player_container.offset();
        if (0 > offset.left) {
            video_player_visible_width = video_player_visible_width + offset.left;
        }

        var width = video_player_visible_width;

        var browser_height = $(window).height();
        var height = Math.floor(width * 0.5640);

        if (height > browser_height - 100) {
            height = browser_height - 100;
            width = Math.floor(height * 1.777);
        }

        if (!full_width && video_bar.hasClass('parallax')) {
            work_with_parallax = 1;
        }

        if (in_place) {
            height = video_bar.height();
            width = Math.floor(height * 1.777);
        }

        video_bar.data('width', width);
        video_bar.data('height', height);

        offset = video_player_container.offset().top;

        $('html,body').animate({scrollTop: offset - 20});

        video_bar.data('html', video_player_container.html());

        video_bar.data('original_children').each(function() {
            $(this).fadeOut();
        });

        var parallax_position = 0;
        var movement;

        if (full_width && !(in_place)) {
            video_bar.data('background_image', video_bar.css('background-image'));
            video_bar.css({'background-image': 'none'});
        }

        if (work_with_parallax) {
            parallax_position = window.get_parallax_position(video_bar);

            video_bar.data('suspend_parallax', 1);

            var background_covers = video_bar.data('background_height') + parallax_position;

            // Don't work with parallax if the current location will cover the larger size without a problem
            if (background_covers >= height) {
                video_bar.data('work_with_parallax', 0);
                work_with_parallax = 0;
            }
            else {
                video_bar.data('work_with_parallax', 1);

                movement = Math.ceil((height - background_covers) / 15);

                if (0 < parallax_position) {
                    movement = movement * -1;
                }
            }
        }

        // Manual animation for the background position shift, there isn't an "animate" method for it
        video_bar.animate({height: height + 'px'}, {
            step: function() {
                if (work_with_parallax) {
                    parallax_position += movement;
                    video_bar.css('background-position', '50% ' + parallax_position + 'px');
                }
            },
            complete: function() {
                load_video(video_bar, video_player_container, video);
            }
        });

    };

    $('.expanding_video_bar,.video_close').on('click', function(the_event) {
        if ('A' === $(the_event.target).prop('tagName')) {
            return;
        }
        the_event.preventDefault();
        $('.expanding_video_bar').each(function() {
            if ('open' === $(this).data('status')) {
                hide_video($(this));
            }

        });
    });

    $(document).on('keyup', function(e) {
        if (27 === e.which) {
            $('.expanding_video_bar').each(function() {
                hide_video($(this));
            });
        }
    });

    $('.expanding_video_bar .expand_video').on('click', function(theEvent) {
        theEvent.preventDefault();
        theEvent.stopPropagation();

        var click_target = $(this);
        var video_bar = find_video_bar(click_target);
        show_video(click_target, video_bar);
    });
}

// Rotating image
function RotatingImage(target) {
    'use strict';

    this.dom_element = target;

    this.init = function() {
        var self = this;

        self.sprite_url = self.dom_element.data('sprite');

        self.sprite_count = self.dom_element.data('sprite_count');
        self.sprite_ratio = self.sprite_count / 360;
        self.sprite_columns = self.dom_element.data('sprite_columns');
        self.loaded = 0;

        if (!(self.sprite_url && self.sprite_count && self.sprite_columns)) {
            window.alert('sprite, sprite_count and sprite_column data needed for rotating image');
            return;
        }

        $('body').on('click', '.rotate_image', function(evt) {
            evt.preventDefault();

            var link_element = $(this);

            var target = link_element.data('target');
            if (target !== self.id || !self.loaded) {
                return;
            }

            self.cancel_auto_rotation = 0;

            var degree_argument = link_element.data('degrees');

            if (0 === degree_argument || 0 < degree_argument) {
                self.rotate_to(degree_argument);
            }
            else {
                self.rotate_to(self.current_degrees);
            }

        });

        var load = function() {
            if (!(self.loaded)) {
                self.sprite_dimensions = {
                    x: self.dom_element.width(),
                    y: self.dom_element.height()
                };

                self.starting_degrees = self.dom_element.data('starting_degrees');
                self.id = self.dom_element.attr('id');

                self.current_degrees = 0;
                self.cancel_auto_rotation = 0;
                self.page_position_top = 0;
                self.page_position_bottom = 0;
                self.id = self.dom_element.attr('id');

                var image = new Image();
                image.onload = function() {
                    self.loaded = 1;
                    self.dom_element.css('background-image', 'url(' + self.sprite_url + ')');
                    self.start_rotation();
                };
                image.src = self.sprite_url;
            }
        };

        setTimeout(load, 3000);

        $(window).on('load_rotating', function() {
            load();
        });

    };

    this.set_rotation = function(degree) {
        this.current_degrees = degree;

        var sprite_number = Math.floor(degree * this.sprite_ratio);

        var row = Math.floor(sprite_number / this.sprite_columns);

        var y = row * this.sprite_dimensions.y;

        var column = sprite_number - row * this.sprite_columns;

        var x = column * this.sprite_dimensions.x;

        this.dom_element.css('backgroundPosition', '-' + x + 'px -' + y + 'px');
    };

    this.rotate_to = function(degrees, callback) {
        var self = this;

        var increment = -2;
        if (180 < (self.current_degrees - degrees + 360) % 360) {
            increment = 2;
        }
        var steps = 0; // Always rotate--go around even if you are there already

        var interval = setInterval(function() {

            var new_degrees = self.check_degree_bounds(self.current_degrees + increment);

            self.set_rotation(new_degrees);

            if (self.cancel_auto_rotation) {
                self.cancel_auto_rotation = 0;
                clearInterval(interval);
            }

            if (Math.abs(self.current_degrees - degrees) < Math.abs(increment) && 3 < steps) {
                clearInterval(interval);
                if (callback) {
                    callback();
                }
            }

            steps += 1;

        }, 10);
    };

    this.check_degree_bounds = function(degrees) {

        if (359 < degrees) {
            degrees = degrees - 360;
        }
        else if (0 > degrees) {
            degrees = 360 + degrees;
        }

        return degrees;

    };

    this.update_page_position = function() {
        this.page_position_top = 0;
        this.page_position_bottom = 0;

        this.page_position_top = this.dom_element.offset().top;
        this.page_position_bottom = this.page_position_top + this.dom_element.height();
    };

    this.start_rotation = function() {
        var self = this;
        self.set_rotation(self.starting_degrees);

        this.update_page_position();

        $(window).on('scroll', function() {
            self.update_page_position();
        });

        var mouse_start = -1;
        var degrees_start = 0;

        this.dom_element.on('mouseout', function() {
            mouse_start = -1;
        });

        $(window).on('mousemove', function(evt) {
            if (evt.pageY > self.page_position_top && evt.pageY < self.page_position_bottom) {
                self.cancel_auto_rotation = 1;

                if (mouse_start === -1) {
                    mouse_start = evt.pageX;
                    degrees_start = self.current_degrees;
                }

                var degrees = Math.floor((mouse_start - evt.pageX) / 4);
                degrees = self.check_degree_bounds(degrees + degrees_start);

                self.set_rotation(degrees);
            }
        });
    };
    this.init();
}

function use_rotating_images() {
    'use strict';

    $('.rotating_image').each(function() {
        $(this).data('rotating_image', new RotatingImage($(this)));
    });

    // Rotating server--user interactions for the rotating server piece
    // and showing connections between the rotating image and menu below.
    // The rotating action itself comes under Rotating above.
    var hide_pointer_line = function() {
        $('.tech_line').remove();
        $('.tech_circle').remove();
    };

    $('.rotating_server_link').on('click', function(the_event) {
        var button = $('.rotating_server_button');
        $(window).trigger('load_rotating');

        the_event.preventDefault();
        var target_id = $(this).data('target');
        var target = $('#stats_' + target_id);

        if (0 < target.height() && !$(this).data('noToggle')) {
            target.removeClass('tec_spec_showing');
            hide_pointer_line();
            $('body, html').animate({scrollTop: $(window).scrollTop() - 230}, 800, function() {
                button.removeClass('active');
            });
        }
        else {
            button.addClass('active');
            $('body, html').animate({scrollTop: target.offset().top - 50});
            target.addClass('tec_spec_showing');
        }
    });

    $(window).on('resize', function() {
        hide_pointer_line();
    });
    $('.tech_spec').on('mouseleave', function() {
        hide_pointer_line();
    });
}

// Flying footer
// Very specific to the ".flying_footer" div--shows, hides and docks it
function flying_footer() {
    'use strict';

    var footer = $('.flying_footer');

    var phone_popup = $('.flying_footer_popup');
    var phone_button = $('.flying_footer .phone');

    var fixed_to_bottom = false;

    var footer_visible = false;
    var phone_visible = false;

    var normal_footer = $('#footer');
    var flying_footer_height = 50;

    var height_to_show = 140;
    var window_height = $(window).height();
    var document_height = $(document).height();
    if (250 > document_height - window_height) {
        height_to_show = 0;
    }

    var update_flying_footer = function() {
        var height_check = document.querySelector('.visible_flying_footer');
        if (height_check) {
            flying_footer_height = height_check.offsetHeight || flying_footer_height;
        }

        if (window.flying_footer_disabled) {
            footer.removeClass('visible_flying_footer');
            footer_visible = false;
            return;
        }
        var scroll_position = $(window).scrollTop();
        var footer_top = normal_footer.offset().top - flying_footer_height;

        if (scroll_position < height_to_show) {
            if (footer_visible) {
                footer.removeClass('visible_flying_footer');
                footer_visible = false;
            }
        }
        else {
            if (!(footer_visible)) {
                footer.addClass('visible_flying_footer');
                footer.show();
                footer_visible = true;
            }
        }

        scroll_position += $(window).height() - flying_footer_height;

        if (scroll_position > footer_top) {
            if (!(fixed_to_bottom)) {
                fixed_to_bottom = true;
            }
            footer_top = normal_footer.offset().top - flying_footer_height;
            footer.css({
                position: 'absolute',
                top: footer_top
            });
        }
        else {
            if (fixed_to_bottom) {
                fixed_to_bottom = false;
                footer.removeAttr('style');
            }
        }
    };

    var phone_on = function() {
        if (!(phone_visible)) {
            phone_button.addClass('active');

            phone_popup.show();

            var height = phone_popup.height();
            var footer_top = Math.floor(footer.offset().top);

            phone_popup.css({
                top: footer_top - height - 30
            });

            phone_visible = true;
            var left_px = $('.icon.phone').offset().left;
            phone_popup.animate({left: left_px}, 'linear');
        }
    };

    var phone_off = function() {
        if (phone_visible) {
            phone_popup.animate({left: '-360px'}, 'linear');
            phone_visible = false;
            phone_button.removeClass('active');
        }
    };

    var toggle_phone_popup = function() {
        if (phone_visible) {
            phone_off();
        }
        else {
            phone_on();
        }
    };

    setTimeout(update_flying_footer, 200);

    phone_button.on('click', function(event) {
        event.preventDefault();
        toggle_phone_popup();
    });
    $('.chat').on('click', function(event) {
        event.preventDefault();
        window.open_chat_window();
    });

    $(window).on('scroll resize', function() {
        phone_off();
        update_flying_footer();
    });
}

// mojo_bar
function mojo_bar() {
    'use strict';
    $('.mojo_bar .links a').on('click', function(event) {
        event.preventDefault();
        $(this).blur();
        $('.mojo_bar .links a').removeClass('active');
        $(this).addClass('active');
        $('.mojo_bar_image').attr('src', $(this).data('image'));
        $('.mojo_bar .message').html($('.mojo_bar .' + $(this).data('message')).html());

    });
}

function auxiliary_actions() {
    'use strict';

    // VIDEO BUTTON
    // set "play video" button text, on mouseover
    $('.btn_video').on('mouseover', function() {
        var btntext = $(this).prop('title');
        if ($(this).text('')) {
            $(this).text(btntext).css('text-indent', '4em');
        }
    });

    // TABS
    var tabSection = $('.tab_section:not(.linkify), .sidetab_section:not(.linkify)');
    var tabs = tabSection.find('.tabs, .sidetabs');
    var tab = tabs.find('a');

    tab.click(function(e) {
        e.preventDefault();
        $(this).closest(tabs).find('.active').removeClass('active');
        $(this).addClass('active');
        var tab = $(this).attr('href');
        var section = $(this).closest(tabSection);
        section.find('.pane.active').removeClass('active');
        section.find(tab).addClass('active');
    });
}

// Tool/Partner Search
function tool_search() {
    'use strict';

    var $tileList = $('.tile_list');

    if (0 === $tileList.get().length) {
        return;
    }

    $.getScript('/media/shared/info/style/javascript/jquery.listsort.js', function() {
        $.getScript('/media/shared/info/style/javascript/scroll_filter.js', function() {
            $tileList.each(function() {
                var $list = $(this);
                var $search = $list.closest('.scroll_filter').find('input[type=search]');
                new ScrollFilter($list, { // jshint ignore:line
                    filter: function(li) {
                        var $li = $(li);
                        return -1 !== $li.text()
                            .toLowerCase()
                            .search($search.val().toLowerCase()) || $li.hasClass('not_filtered');
                    },
                    debounce: 50
                });

                $search.on('input propertychange', function() {
                    $tileList.listsort();
                });
                $search.closest('form').on('submit', function(e) {
                    e.preventDefault();
                    // there is nowhere to POST
                });
            });
        });
    });
}

// Chat sidebar
function chat_sidebar() {
    'use strict';

    $('.chat-sidebar .tab').on('click', function(e) {
        e.preventDefault();
        var $sidebar = $(this).closest('.chat-sidebar');
        $sidebar.toggleClass('active');
        if ($sidebar.hasClass('active')) {
            $sidebar.find('textarea').focus();
        }
    }).on('keyup', function(e) {
        if (13 === e.which) {
            $(this).click();
            return false;
        }
    });
    $('.chat-sidebar .close').on('click', function(e) {
        e.preventDefault();
        var $sidebar = $(this).closest('.chat-sidebar');
        $sidebar.removeClass('active');
    });
    $('.chat-sidebar form').on('submit', function(e) {
        e.preventDefault();
        var data = {};
        $.each($(this).serializeArray(), function(_, kv) {
            data[kv.name] = kv.value;
        });
        open_chat_window(data.department, data.media, data.question);
        var $sidebar = $(this).closest('.chat-sidebar');
        $sidebar.removeClass('active');
        $(this).find('textarea').val('');
    });
    $('.chat-sidebar textarea').on('keyup', function(e) {
        var $sidebar = $(this).closest('.chat-sidebar');
        if (13 === e.which) {
            if ($sidebar.hasClass('active')) {
                $(this).closest('form').submit();
            }
            else {
                $sidebar.addClass('active');
            }
            return false;
        }
        else if (27 === e.which) {
            $sidebar.removeClass('active');
            return false;
        }
        $sidebar.addClass('active');
    });
}

$(function() {
    'use strict';

    // Trigger the parallax effects...
    use_parallax();

    // Load YouTube tools...
    youtube_tools();

    // Allow images to rotate if they are setup to do so...
    use_rotating_images();

    // Load the flying footer...
    flying_footer();

    // Load the 'mojo_bar'...
    mojo_bar();

    // Load auxiliary utils...
    auxiliary_actions();

    // Load the tool/partner search...
    tool_search();

    // Show the chat sidebar...
    chat_sidebar();
});
