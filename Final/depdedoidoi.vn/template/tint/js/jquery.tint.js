// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


$(function () {



    // Numeric only control handler
    jQuery.fn.ForceNumericOnly = function () {
        return this.each(function () {
            $(this).keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
                return (
                key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
        });
    }; // JavaScript Document

    //Center OBJ
    $.fn.center = function () {
        this.css({
            left: ($(document).width() - $(this).outerWidth()) / 2,
            top: ($(window).height() - $(this).outerHeight()) / 2
        });
    };
    //Colorbox
    //$('.colorbox').colorbox();
    //Menu last item
    $('.nav-left ul > li:last, .nav-right ul > li:last,.page-nav .mainnav ul li:last,.main-content ul.subnav li:last').addClass('last');
    $('.nav-left ul > li:first,.nav-right ul > li:first,.social a:first,.main-content ul.subnav li:first, .booking-form .row .column-1 input[type="radio"]:first').addClass('first');

    $(".content-sitemap .column  ul").each(function () {
        $(this).children("li:last").addClass("last");
    });

    $(".AllowOnlyNumericInputs").ForceNumericOnly();


    $('.imgRefreshCaptcha').click(function () {
        //Captcha();
    });

    $(".gotop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });
    $(".navbar-toggle").click(function () {
        $(this).toggleClass("open");  
        if ($(window).width() < 768) {
            if ($(this).hasClass("open")) {
                $("body").addClass('open-menu');
            }
            else {
                $("body").removeClass('open-menu');
            }
        }
    });
    $(".page-project-master-detail .bt-back").click(function () {
        window.history.back();
    });

    $(".bt-register-price").click(function () {
        $(".register-price").addClass("open");
    });

    $(".bt-close-register-price").click(function () {
        $(".register-price").removeClass("open");
        $("#txtNameP").val('').removeClass("error");
        $("#txtMobileP").val('').removeClass("error");
        $("#txtEmailP").val('').removeClass("error");
        $("#txtDateP").val('').removeClass("error");
    });

    $(window).scroll(function () {
        if ($(window).width() >= 0) {
            if ($(this).scrollTop() > 40) {
                $('.top-head').addClass("sticky");
                $('.hotline-sticky').addClass("sticky");
            }
            else {
                $('.top-head').removeClass("sticky");
                $('.hotline-sticky').removeClass("sticky");
            }
        }
        else {
            $('.top-head').removeClass("sticky");
            $('.hotline-sticky').removeClass("sticky");
        }
        //        if ($(window).width() > 1400) {
        //            if ($(this).scrollTop() > 88) {
        //                $('.box-category-wrapper').addClass("sticky");
        //            }
        //            else {
        //                $('.box-category-wrapper').removeClass("sticky");
        //            }
        //        }
        //        else {
        //            if ($(this).scrollTop() > 28) {
        //                $('.box-category-wrapper').addClass("sticky");
        //            }
        //            else {
        //                $('.box-category-wrapper').removeClass("sticky");
        //            }
        //        }
    });

    $(".item-tabs").click(function () {
        $(".animatedParent.active > .animated").addClass("go")
        $(".nav-tabs li").removeClass("active");
    });

    $(".dropdown-submenu > a.dropdown-submenu-toggle").on("click", function (e) {
        var current = $(this).next();
        var grandparent = $(this).parent().parent();
        current.parent().toggleClass("open")
        return false;
    });
    //Active Menu
    var pathName = window.location.pathname.toString();
    if (pathName.indexOf(".html") != -1) {
        var i = 0;
        var arrPath = pathName.split('/');
        var listMenu = $('.page-header .nav li > a');
        var listMenuBottom = $('.nav-bottom li > a');
        $.each(listMenu, function () {
            var href = $(this).attr('href').toString();
            var arrHref = href.split('/');
            if (arrPath.length > 1 && arrHref.length > 1) {
                if (arrPath[1].toString().replace(".html", "") == arrHref[1].toString().replace(".html", "")) {
                    $(this).parent().addClass('active');
                    i++;
                    return false;
                }
            }
        });

    }
    else {
        $(".page-header .nav li:first").addClass("active");
    }




    $(".error").click(function () {
        $(this).removeClass(".error");
    });


    //Check suuport online
    checkOnline();

    //Footer Menu
    $(".footer-nav .nav").html($(".page-header .header-left ul.navigation").html());


});


function init_map(mapid) {
    var contentString = $(".lbl_map_address").html();
    var map_coordinate_x = eval($(".map_coordinate_x").html());
    var map_coordinate_y = eval($(".map_coordinate_y").html());
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(map_coordinate_x, map_coordinate_y)
    };

    var map = new google.maps.Map(document.getElementById(mapid),
             mapOptions);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(map_coordinate_x, map_coordinate_y),
        map: map,
        icon: '/template/tint/images/ico-map-dot.svg',
        title: 'Click to zoom'
    });

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(map, 'center_changed', function () {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 60000);
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
}

function checkOnline() {
    $(".support-online a").each(function () {
        var nick = $(this).attr("nickname");
        var type = $(this).attr("nicktype");
        var element = $(this);
        $.ajax({
            type: "GET",
            cache: false,
            url: "/AJAX.aspx",
            data: "func=CHECKSTATUS&nickname=" + nick + "&nicktype=" + type,
            dataType: "html",
            success: function (msg) {
                if (type == "yahoo") {
                    if (msg == "01")
                        $(element).children("span").addClass("yahooonline");
                    else
                        $(element).children("span").addClass("yahoooffline");
                }
                else {
                    if (msg == "2")
                        $(element).children("span").addClass("skypeonline");
                    else
                        $(element).children("span").addClass("skypeoffline");
                }
            },
            error: function (msg) {
                //$(imgCatcha).hide();
            }
        });
    });
}

function equalHeight(group) {
    group.css("height", "auto")
    tallest = 0;
    group.each(function () {
        thisHeight = $(this).height();
        if (thisHeight > tallest) {
            tallest = thisHeight;
        }
    });
    group.height(tallest);
}

function AddToCart(id, att, name, qty, price, pic) {
    $.ajax({
        type: "GET",
        url: "/AJAX.aspx",
        data: "func=cart&id=" + id + "&att=" + att + "&name=" + name + "&qty=" + qty + "&price=" + price + "&pic=" + pic,
        dataType: "html",
        success: function (msg) {
            jAlert(msg);
        },
        error: function (msg) {
            jAlert(msg);
        }
    });
}

function Captcha() {
    var imgCatcha = $('.imgCatcha');
    $.ajax({
        type: "GET",
        cache: false,
        url: "/AJAX.aspx",
        data: "func=CAPTCHA",
        dataType: "html",
        success: function (msg) {
            $(imgCatcha).attr('src', msg);
        },
        error: function (msg) {
            //$(imgCatcha).hide();
        }
    });
}
function RequiredEmptyField(object, message) {
    var txtobject = $(object).val().trim();
    if (txtobject == "") {
        $.Msg.show(message);
        return false;
    }
    return true;
}
function AreaMaxLength(textBox, e, length) {
    var mLen = textBox["MaxLength"];
    if (null == mLen)
        mLen = length;
    var maxLength = parseInt(mLen);
    if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) {
        if (textBox.value.length > maxLength - 1) {
            if (window.event)
                e.returnValue = false;
            else
                e.preventDefault();
        }
    }
}
function Valid_Profile(name, msgname,
                    email, msgemail,
                    phone, msgphone,
                    captcha, msgcaptcha) {
    var error = "";
    var bl = "- ";
    var br = "<br />";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrEmail = $(email);
    var ctrPhone = $(phone);
    var ctrCaptcha = $(captcha);
    //name
    if (ctrName.val() == "") { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }
    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "") { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }
    //phone
    if (regex_phone.test(ctrPhone.val()) || ctrPhone.val() == "") { $(ctrPhone).addClass('error'); error += bl + msgphone + br; }
    else { $(ctrPhone).removeClass('error'); }
    //captcha
    if (ctrCaptcha.val() == "") { $(ctrCaptcha).addClass('error'); error += bl + msgcaptcha + br; }
    else { $(ctrCaptcha).removeClass('error'); }
    if (error != "") {
        //$.Msg.show(error);
        return false;
    }
    return true;
}
function Valid_Contact(name, msgname, lblname,
                        mobile, msgmobile, lblmobile,
                        email, msgemail, lblemail,
                        //message, msgmessage,lblmessage, 
                        //captcha, msgcaptcha, lblcaptcha
                        ) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrMobile = $(mobile);
    var ctrEmail = $(email);
    //var ctrMessage = $(message);      
    //var ctrCaptcha = $(captcha);

    //name
    if (ctrName.val() == "" || ctrName.val()==lblname) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //Mobile
    if (regex_phone.test(ctrMobile.val()) == true || ctrMobile.val() == "" || ctrMobile.val() == lblmobile) { $(ctrMobile).addClass('error'); error += bl + msgmobile + br; }
    else { $(ctrMobile).removeClass('error'); }

    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val()==lblemail) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }

    //message
    /*if (ctrMessage.val() == ""|| ctrMessage.val()==lblmessage) { $(ctrMessage).addClass('error'); error += bl + msgmessage + br; }
    else { $(ctrMessage).removeClass('error'); }     
    //captcha
    if (ctrCaptcha.val() == "") { $(ctrCaptcha).addClass('error'); error += bl + msgcaptcha + br; }
    else { $(ctrCaptcha).removeClass('error'); }*/

    if (error != "") {
        //jAlert(error);
        //$.Msg.show(error);
        //jAlert("Vui lòng kiểm tra lại:", error);
        bootbox.alert(error);
        return false;
    }
    return true;
}
function Valid_CustomerReviews(name, msgname, lblname,
                        email, msgemail, lblemail,
                        message, msgmessage, lblmessage,
                        captcha, msgcaptcha, lblcaptcha) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrEmail = $(email);
    var ctrMessage = $(message);
    var ctrCaptcha = $(captcha);
    var checkcaptcha = "";
    $.ajax({
        type: "GET",
        cache: false,
        url: "/AJAX.aspx",
        async: false,
        data: "func=checkcaptcha&captcha=" + $(ctrCaptcha).val(),
        dataType: "html",
        success: function (msg) {
            checkcaptcha = msg;
            return false;
        }
    });

    //name
    if (ctrName.val() == "" || ctrName.val() == lblname) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val() == lblemail) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }


    //message
    if (ctrMessage.val() == "" || ctrMessage.val() == lblmessage) { $(ctrMessage).addClass('error'); error += bl + msgmessage + br; }
    else { $(ctrMessage).removeClass('error'); }
    //captcha
    if (ctrCaptcha.val() == "" || checkcaptcha == "False" || ctrCaptcha.val() == lblcaptcha) { $(ctrCaptcha).addClass('error'); error += bl + msgcaptcha + br; }
    else { $(ctrCaptcha).removeClass('error'); }
    if (error != "") {
        //jAlert(error);
        //$.Msg.show(error);
        //jAlert("Vui lòng kiểm tra lại:", error);
        bootbox.alert(error);
        return false;
    }
    return true;
}
function Valid_NewsLetter(name, msgname, lblname,
                        mobile, msgmobile, lblmobile,
                        email, msgemail, lblemail) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrMobile = $(mobile);
    var ctrEmail = $(email);


    //name
    if (ctrName.val() == "" || ctrName.val() == lblname) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //Mobile
    if (regex_phone.test(ctrMobile.val()) == true || ctrMobile.val() == "" || ctrMobile.val() == lblmobile) { $(ctrMobile).addClass('error'); error += bl + msgmobile + br; }
    else { $(ctrMobile).removeClass('error'); }

    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val() == lblemail) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }

    if (error != "") {
        //jAlert(error);
        //$.Msg.show(error);
        //jAlert("Vui lòng kiểm tra lại:", error);
        bootbox.alert(error);
        return false;
    }
    return true;
}
function Valid_Schedule(name, msgname, lblname,
                        mobile, msgmobile, lblmobile,
                        date, msgdate, lbldate,
                        email, msgemail, lblemail) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrMobile = $(mobile);
    var ctrDate= $(date);
    var ctrEmail = $(email);


    //name
    if (ctrName.val() == "" || ctrName.val() == lblname) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //Mobile
    if (regex_phone.test(ctrMobile.val()) == true || ctrMobile.val() == "" || ctrMobile.val() == lblmobile) { $(ctrMobile).addClass('error'); error += bl + msgmobile + br; }
    else { $(ctrMobile).removeClass('error'); }

    //Date
    if (ctrDate.val() == "" || ctrDate.val() == lbldate) { $(ctrDate).addClass('error'); error += bl + msgdate + br; }
    else { $(ctrDate).removeClass('error'); }

    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val() == lblemail) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }

    if (error != "") {
        //jAlert(error);
        //$.Msg.show(error);
        //jAlert("Vui lòng kiểm tra lại:", error);
        bootbox.alert(error);
        return false;
    }
    return true;
}
function Valid_Register(name, msgname, lblname,
                        email, msgemail, lblemail,
                        phone, msgphone, lblphone,
                        address, msgaddress, lbladdress,
                        message, msgmessage, lblmessage,
                        captcha, msgcaptcha, lblcaptcha) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrEmail = $(email);
    var ctrPhone = $(phone);
    var ctrAddress = $(address);
    var ctrMessage = $(message);
    var ctrCaptcha = $(captcha);

    var checkcaptcha = "";
    $.ajax({
        type: "GET",
        cache: false,
        url: "/AJAX.aspx",
        async: false,
        data: "func=checkcaptcha&captcha=" + $(ctrCaptcha).val(),
        dataType: "html",
        success: function (msg) {
            checkcaptcha = msg;
            return false;
        }
    });

    //name
    if (ctrName.val() == "" || ctrName.val() == lblname + '*') { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //email
    if (regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val() == lblemail) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }

    //phone
    if (regex_phone.test(ctrPhone.val()) || ctrPhone.val() == "" || ctrPhone.val() == lblphone + '*') { $(ctrPhone).addClass('error'); error += bl + msgphone + br; }
    else { $(ctrPhone).removeClass('error'); }

    //Address
    if (ctrAddress.val() == "" || ctrAddress.val() == lbladdress + '*') { $(ctrAddress).addClass('error'); error += bl + msgaddress + br; }
    else { $(ctrAddress).removeClass('error'); }

    //message
    if (ctrMessage.val() == "" || ctrMessage.val() == lblmessage + '*') { $(ctrMessage).addClass('error'); error += bl + msgmessage + br; }
    else { $(ctrMessage).removeClass('error'); }
    //captcha
    if (ctrCaptcha.val() == "" || checkcaptcha == "False" || ctrCaptcha.val() == lblcaptcha) { $(ctrCaptcha).addClass('error'); error += bl + msgcaptcha + br; }
    else { $(ctrCaptcha).removeClass('error'); }
    if (error != "") {
        //jAlert(error);
        //$.Msg.show(error);
        //jAlert("Vui lòng kiểm tra lại:", error);
        bootbox.alert(error);
        return false;
    }
    return true;
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function Valid_FormRegister(name, msgname,
                        email, msgemail,
                        phone, msgphone,
                        contactname, msgcontactname,
                        mobile, msgmobile,
                        product, msgproduct,
                        captcha, msgcaptcha) {


    var error = "";
    var bl = "- ";
    var br = "<br>";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrEmail = $(email);
    var ctrContactName = $(contactname);
    var ctrPhone = $(phone); 
   
   
    

    //name
    if (ctrName.val() == "" ) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //Contact name
    if (ctrContactName.val() == "") { $(ctrContactName).addClass('error'); error += bl + msgcontactname + br; }
    else { $(ctrContactName).removeClass('error'); }

    //Email
    if (ctrEmail.val() == "" || regex_email.test(ctrEmail.val()) == false) { $(ctrEmail).addClass('error'); error += bl + msgemail + br; }
    else { $(ctrEmail).removeClass('error'); }

    //Phone
    if (ctrPhone.val() == "") { $(ctrPhone).addClass('error'); error += bl + msgphone + br; }
    else { $(ctrPhone).removeClass('error'); }

   

    if (error != "") {
        bootbox.alert(error);
        return false;
    }
    return true;
}

function Valid_faqs(name, msgname, lblname,
                    message, msgmessage, lblmessage,
                        mobile, msgemailmobile, lblmobile,
                        email, msgemailmobile, lblemail
                        ) {


    var error = "";
    var bl = "- ";
    var br = "\n";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    var regex_phone = /[A-Za-z]$/;

    var ctrName = $(name);
    var ctrEmail = $(email);
    var ctrMobile = $(mobile);
    var ctrMessage = $(message);
    

    //name
    if (ctrName.val() == "" || ctrName.val() == lblname) { $(ctrName).addClass('error'); error += bl + msgname + br; }
    else { $(ctrName).removeClass('error'); }

    //email
    if ((regex_email.test(ctrEmail.val()) == false || ctrEmail.val() == "" || ctrEmail.val() == lblemail) && (ctrMobile.val() == "" || ctrMobile.val() == lblmobile)
        ) { $(ctrEmail).addClass('error'); error += bl + msgemailmobile + br; }
    else { $(ctrEmail).removeClass('error'); }
   
    //message
    if (ctrMessage.val() == "" || ctrMessage.val() == lblmessage) { $(ctrMessage).addClass('error'); error += bl + msgmessage + br; }
    else { $(ctrMessage).removeClass('error'); }
    if (error != "") {
        swal("Vui lòng kiểm tra lại:", error);
        return false;
    }
    return true;
} 




function checkFileExt(fileuploader, type) {
    var filePath = fileuploader.value;

    if (filePath.indexOf('.') == -1)
        return false;

    var validExtensions = "";
    var ext = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
    //Add valid extentions in this array
    switch (type) {
        case "picture":
            validExtensions = 'jpg,png,gif';
            break;
        case "document":
            validExtensions = 'doc,docx,xls,xlsx,ppt,pptx,mdb,mdbx,pdf,txt,zip,rar,7z,cab,iso';
            break;
        case "media":
            validExtensions = 'mp3,flv,wmv,mpg,mp4,ogg';
            break;
        case "compress":
            validExtensions = 'zip,rar,7z';
            break;
    }
    var fileext = new Array();
    fileext = validExtensions.split(',');
    for (var i = 0; i < fileext.length; i++) {
        if (ext == fileext[i])
            return true;
    }
    $.Msg.show(ext.toUpperCase() + ' - file type not supported!');
    fileuploader.value = "";
    return false;
}
function openBox(winWidth, winHeight, fileSrc) {
    var w = ($(window).width() - winWidth) / 2;
    var h = ($(window).height() - winHeight) / 2;
    newParameter = "width=" + winWidth + ",height=" + winHeight + ",addressbar=no,scrollbars=yes,toolbar=no,top=" + h + ",left=" + w + ", resizable=no";
    newWindow = window.open(fileSrc, "a", newParameter);
    newWindow.focus();
}
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function Valid_SendEmail(msgtitle, sender, msgsender,
                        emailsender, msgemailsender,
                        receiver, msgreceiver,
                        emailreceiver, msgemailreceiver,
                        content, msgcontent) {
    var error = "";
    var bl = "- ";
    var br = "<br />";
    var regex_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

    var ctrSender = $(sender);
    var ctrEmailSender = $(emailsender);
    var ctrReceiver = $(receiver);
    var ctrEmailReceiver = $(emailreceiver);
    var ctrMessage = $(content);
    //sender
    if (ctrSender.val() == "") { $(ctrSender).addClass('error'); error += bl + msgsender + br; }
    else { $(ctrSender).removeClass('error'); }
    //email sender

    if (regex_email.test(ctrEmailSender.val()) == false || ctrEmailSender.val() == "") { $(ctrEmailSender).addClass('error'); error += bl + msgemailsender + br; }
    else { $(ctrEmailSender).removeClass('error'); }
    //receiver
    if (ctrReceiver.val() == "") { $(ctrReceiver).addClass('error'); error += bl + msgreceiver + br; }
    else { $(ctrReceiver).removeClass('error'); }
    //email receiver
    
    if (regex_email.test(ctrEmailReceiver.val()) == false || ctrEmailReceiver.val() == "") { $(ctrEmailReceiver).addClass('error'); error += bl + msgemailreceiver + br; }
    else { $(ctrEmailReceiver).removeClass('error'); }
    //content
    if (ctrMessage.val() == "") { $(ctrMessage).addClass('error'); error += bl + msgcontent + br; }
    else { $(ctrMessage).removeClass('error'); }
    if (error != "") {
        jAlert(error);
        return false;
    }
    return true;
}
