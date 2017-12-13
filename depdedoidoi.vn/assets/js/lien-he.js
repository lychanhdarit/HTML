/*
Name: cognitocrm_javascript
Author: luantnguyen88@gmail.com
Author URI: http://cognitocrm.com/
Description: The CognitoCRM JavaScript provides a rich set of client-side functionality for add new or old customer into list and event.
*/

(function() {
    jQuery("div.form-contact form").append('<input type="hidden" name="du_an[]" value=""> <input type="hidden" name="subscriber_list_id" value="4"> <input id="cognito_customer_source" name="subscription[customer_source]" type="hidden" value=""> <input type="hidden" name="cognito_redirect_url" value="/thanks.html">');

    jQuery("div.form-contact form").on("submit", function(e) {
        submitForm(this);
        return false;
    });
}).call(this);

function cognito_map_fields() {
    return {
        "event_id": "event_id",
        "subscriber_list_id": "subscriber_list_id",
        "cognito_redirect_url": "cognito_redirect_url",
        "full_name": "full_name",
        "email": "email",
        "phone": "phone",
        "birthday": "birthday",
        "hs_dvqt[]" : "hs_dvqt[]",
        "du_an[]": "du_an",
        "subscription[customer_source]": "customer_source"
    };
}

var is_https = false;
var cognito_save_data = false;
var cognito_phone_restricted = false;
var cognito_subscribe_logic = true;
var cognito_domain = "crm.depdedoidoi.vn";
var cognito_auth_default = { "user": "HTDPpsmTpg", "pass": "bKFvAeiTjXStJsdhgpFOJGjXvViVuGHF" };

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function checkCustomerOnPageLoad() {
    var email = getUrlParameter("email");
    var el_email = jQuery("[name='" + get_form_field("email") + "']");
    if (checkVariable(email)) {
        checkCustomerByEmail(email).done(function(check_email_data) {
            var email_data = jQuery.parseJSON(check_email_data);
            if (email_data["customer_id"]) {
                getCustomerByID(email_data).done(function(customer_data) {
                    fillForm(customer_data);
                    el_email.removeAttr('disabled');
                });
            } else {
                redirectToPage("/");
            }
        });
    } else {
        redirectToPage("/");
    }
}

function cognito_data(frm) {
    var data = {
        "cognito_redirect_url": "",
        "required_fields": []
    };

    var all_field = jQuery(frm).serializeArray();

    jQuery.each(all_field, function(k, input) {
        var cognito_field = get_cognito_field(input.name);
        if (cognito_field) {
            if (input.name.includes("[]")) {
                if (!checkVariable(data[cognito_field])) {
                    data[cognito_field] = [];
                }
                data[cognito_field].push(input.value);
            } else {
                data[cognito_field] = input.value;
            }
        }
        if (jQuery(frm).find("[name='" + input.name + "']").attr("required")) {
            if (jQuery.inArray(cognito_field, data["required_fields"]) < 0) {
                data["required_fields"].push(cognito_field);
            }
        }
    });

    return data;
}

function get_cognito_field(form_field) {
    var map_fields = cognito_map_fields();
    var cognito_field = map_fields[form_field];
    if (checkVariable(cognito_field)) {
        return cognito_field;
    } else {
        return false;
    }
}

function get_form_field(cognito_field) {
    var map_fields = cognito_map_fields();
    jQuery.each(map_fields, function(k, v) {
        if (v == cognito_field) {
            cognito_field = k;
        }
    });
    return cognito_field;
}

var conito_form_messages = {
    "full_name_invalid": "Họ và tên không hợp lệ!",
    "first_name_invalid": "Tên không hợp lệ!",
    "last_name_invalid": "Họ không hợp lệ!",
    "email_invalid": "Email không hợp lệ!",
    "phone_invalid": "Số điện thoại không hợp lệ!",
    "field_require": "Vui lòng nhập thông tin!",
    "btn_default": "Gửi",
    "btn_waiting": "Chờ",
    "btn_sending": "Gửi...",
    "btn_complete": "Xong",
    "success_notify": "CẢM ƠN BẠN!\nChúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    "fail_notify": "Thông tin đã được đăng ký.",
    "event_fail": "Bạn đã tham gia sự kiện này vui lòng chọn sự kiện khác.",
    "list_fail": "Email này đã được sử dụng.",
    "server_fail": "Hệ thống hiện đang gặp sự cố kết nối. Hãy thử lại sau giây lát.",
    "list_success": "Chúc mừng bạn đã đăng ký thành công."
};

function clearForm() {
    var map_fields = cognito_map_fields();
    jQuery.each(map_fields, function(k, v) {
        jQuery('[name="' + k + '"]').val('');
    });
}

function fillForm(data) {
    jQuery.each(data, function(k, v) {
        var field = get_form_field(k);
        if (checkVariable(v)) {
            jQuery('[name="' + field + '"]').val(v);
            jQuery('[name="' + field + '"]').attr('disabled', 'disabled');
        }
    });
}

function checkCustomerEmailExists(field) {
    var el_email = jQuery(field);
    checkCustomerByEmail(el_email.val()).done(function(check_email_data) {
        var email_data = jQuery.parseJSON(check_email_data);
        if (email_data["customer_id"]) {
            getCustomerByID(email_data).done(function(customer_data) {
                fillForm(customer_data);
                el_email.removeAttr('disabled');
            });
        } else {
            removeDisabledInput();
        }
    });
}

function removeDisabledInput() {
    var map_fields = cognito_map_fields();
    jQuery.each(map_fields, function(k, v) {
        jQuery('[name="' + k + '"]').removeAttr('disabled');
    });
}

function btnValue(btn, text) {
    if (btn.is("button")) {
        btn.html(text);
    } else {
        btn.val(text);
    }
}

function btnLogic(btn) {
    //Disable the button to prevent double click
    btnValue(btn, conito_form_messages["btn_sending"]);
    btn.attr('disabled', 'disabled');

    // Enable the button after 3 seconds
    var sec = 3;
    var timer = setInterval(function() {
        btnValue(btn, conito_form_messages["btn_waiting"] + ' (' + sec-- + ')');
        if (sec == -1) {
            btnValue(btn, conito_form_messages["btn_default"]);
            btn.removeAttr('disabled');
            clearInterval(timer);
        }
    }, 1000);
}

function submitForm(frm) {
    var data = cognito_data(frm);
    if (dataValid(data)) {
        saveFormByCookie(data);
        btnLogic(jQuery(frm).find("[type='submit']"));
        dataLogic(data);
    }

    event.preventDefault();
}

function dataRequiredValid(v) {
    var is_validation = true;
    var tmp_val = v;
    if (jQuery.type(tmp_val) === "array") {
        tmp_val = tmp_val.join('');
    }

    if (tmp_val.replace(/\s+/, "") === "") {
        is_validation = isNotValid(conito_form_messages["field_require"]);
    }
    return is_validation;
}

function dataValid(data) {
    var is_validation = true;
    jQuery.each(data, function(key, val) {
        if (jQuery.inArray(key, data["required_fields"]) >= 0) {
            console.log(val);
            is_validation = dataRequiredValid(val);
        }
        if (is_validation) {
            if (key == "full_name" || key == "first_name" || key == "last_name") {
                var is_validation_fullname = isValidFullName(val);
                if (!is_validation_fullname) {
                    is_validation = isNotValid(conito_form_messages[key + "_invalid"]) && is_validation;
                }
            }

            if (key == 'email') {
                var is_validation_email = isValidEmailAddress(val);
                if (!is_validation_email) {
                    is_validation = isNotValid(conito_form_messages[key + "_invalid"]) && is_validation;
                }
            }

            if (key == 'phone') {
                var is_validation_tel = isValidPhoneNumber(val);
                if (!is_validation_tel) {
                    is_validation = isNotValid(conito_form_messages[key + "_invalid"]) && is_validation;
                }
            }

        } else {
            return is_validation;
        }
    });
    return is_validation;
}

function isNotValid(text) {
    fail_notify(text);
    return false;
}

function redirectToPage(url) {
    clearForm();
    if (checkVariable(url)) {
        window.location.href = url;
    } else {
        success_notify();
    }
}

function success_notify(success_text) {
    if (checkVariable(success_text)) {
        alert(success_text);
    } else {
        alert(conito_form_messages["success_notify"]);
    }
}

function fail_notify(fail_text) {
    if (checkVariable(fail_text)) {
        alert(fail_text);
    }
    //alert(conito_form_messages["fail_notify"]);
}

function handleForm(data) {
    checkCustomerByEmail(data["email"]).done(function(check_email_data) {
        var check_email_data = JSON.parse(check_email_data);
        var customer_id = check_email_data["customer_id"];
        if (customer_id) {
            data["customer_id"] = customer_id;
            subscribeList(data);
        } else {
            createNewCustomer(data).done(function(customer_data) {
                var customer_data = JSON.parse(customer_data);
                data["customer_id"] = customer_data["id"];
                subscribeLogic(data);
            });
        }
    }).fail(function() {
        createNewCustomer(data).done(function(customer_data) {
            var customer_data = JSON.parse(customer_data);
            data["customer_id"] = customer_data["id"];
            subscribeLogic(data);
        });
    });
}

function dataLogic(data) {
    if (checkVariable(cognito_phone_restricted)) {
        checkCustomerByPhone(data["phone"]).done(function(check_phone_data) {
            var check_phone_data = JSON.parse(check_phone_data);
            var customer_id = check_phone_data["customer_id"];
            if (customer_id) {
                fail_notify(conito_form_messages["phone_fail"]);
            } else {
                handleForm(data);
            }
        });
    } else {
        handleForm(data);
    }
}

function subscribeLogic(data) {
    if (checkVariable(data["subscriber_list_id"])) {
        subscribeList(data);
    } else if (checkVariable(data["event_id"])) {
        registerEvent(data);
    } else {
        console.log("Vui lòng kiểm tra lại giá trị của sự kiện/danh sách tiếp thị");
    }
}

function subscribeList(data) {
    checkIfSubscribed(data["subscriber_list_id"], data["customer_id"]).done(function(check_subscriber_data) {
        var check_subscriber_data = JSON.parse(check_subscriber_data);
        if (!check_subscriber_data["result"]) {
            subscribeCustomerToList(data).done(function(check_subscriber_data) {
                if (checkVariable(data["event_id"]) && checkVariable(cognito_subscribe_logic)) {
                    registerEvent(data);
                } else {
                    redirectToPage(data["cognito_redirect_url"]);
                }
            });
        } else {
            fail_notify(conito_form_messages["list_fail"]);
        }
    });
}

function registerEvent(data) {
    checkIfRegister(data["event_id"], data["customer_id"]).done(function(check_register_data) {
        var check_register_data = JSON.parse(check_register_data);
        if (!check_register_data["result"]) {
            registerCustomerToEvent(data).done(function() {
                if (checkVariable(data["event_id"]) && !checkVariable(cognito_subscribe_logic)) {
                    subscribeList(data);
                } else {
                    redirectToPage(data["cognito_redirect_url"]);
                }
            });
        } else {
            fail_notify(conito_form_messages["event_fail"]);
        }
    });
}

// Email Validation
function isValidEmailAddress(email_address) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(email_address);
}
//Calculate age
function calcAge(dateString) {
    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    var birthday = +new Date(dateString.replace(pattern, '$3-$2-$1'));
    return ~~((Date.now() - birthday) / (31557600000));
}
// Fullname Validation
function isValidFullName(full_name) {
    var pattern = new RegExp(/^[a-zA-Z\\Â\\â\\ă\\Ă\\Đ\\đ\\ê\\Ê\\Ư\\ư\\Ô\\ô\\ơ\\Ơ \\À\\à\\Ằ\\ằ\\Ầ\\ầ\\È\\è\\Ề\\ề\\Ì\\ì\\Ò\\ò\\Ồ\\ồ\\Ờ\\ờ\\Ù\\ù\\Ừ\\ừ\\Ỳ\\ỳ\\Á\\á\\Ắ\\ắ\\Ấ\\ấ\\É\\é\\Ế\\ế\\Í\\í\\Ó\\ó\\Ố\\ố\\Ớ\\ớ\\Ú\\ú\\Ứ\\ứ\\Ý\\ý\\Ả\\ả\\Ẳ\\ẳ\\Ẩ\\ẩ\\Ẻ\\ẻ\\Ể\\ể\\Ỉ\\ỉ\\Ỏ\\ỏ\\Ổ\\ổ\\Ở\\ở\\Ủ\\ủ\\Ử\\ử\\Ỷ\\ỷ\\Ã\\ã\\Ẵ\\ẵ\\Ẫ\\ẫ\\Ẽ\\ẽ\\Ễ\\ễ\\Ĩ\\ĩ\\Õ\\õ\\Ỗ\\ỗ\\Ỡ\\ỡ\\Ũ\\ũ\\Ữ\\ữ\\Ỹ\\ỹ\\Ạ\\ạ\\Ặ\\ặ\\Ậ\\ậ\\Ẹ\\ẹ\\\\ệ\\Ị\\ị\\Ọ\\ọ\\Ộ\\ộ\\Ợ\\ợ\\Ụ\\ụ\\Ự\\ự\\Ỵ\\ỵ][a-zA-Z\\s\\Â\\â\\ă\\Ă\\Đ\\đ\\ê\\Ê\\Ư\\ư\\Ô\\ô\\ơ\\Ơ \\À\\à\\Ằ\\ằ\\Ầ\\ầ\\È\\è\\Ề\\ề\\Ì\\ì\\Ò\\ò\\Ồ\\ồ\\Ờ\\ờ\\Ù\\ù\\Ừ\\ừ\\Ỳ\\ỳ\\Á\\á\\Ắ\\ắ\\Ấ\\ấ\\É\\é\\Ế\\ế\\Í\\í\\Ó\\ó\\Ố\\ố\\Ớ\\ớ\\Ú\\ú\\Ứ\\ứ\\Ý\\ý\\Ả\\ả\\Ẳ\\ẳ\\Ẩ\\ẩ\\Ẻ\\ẻ\\Ể\\ể\\Ỉ\\ỉ\\Ỏ\\ỏ\\Ổ\\ổ\\Ở\\ở\\Ủ\\ủ\\Ử\\ử\\Ỷ\\ỷ\\Ã\\ã\\Ẵ\\ẵ\\Ẫ\\ẫ\\Ẽ\\ẽ\\Ễ\\ễ\\Ĩ\\ĩ\\Õ\\õ\\Ỗ\\ỗ\\Ỡ\\ỡ\\Ũ\\ũ\\Ữ\\ữ\\Ỹ\\ỹ\\Ạ\\ạ\\Ặ\\ặ\\Ậ\\ậ\\Ẹ\\ẹ\\\\ệ\\Ị\\ị\\Ọ\\ọ\\Ộ\\ộ\\Ợ\\ợ\\Ụ\\ụ\\Ự\\ự\\Ỵ\\ỵ]+$/);
    return pattern.test(full_name);
}
// License plates Validation

// Phone Number Validation
function isValidPhoneNumber(phone_number) {
    var pattern = new RegExp(/^(0|\+84)\d{9,10}$/);
    return pattern.test(phone_number);
}

function format_cognito_date(cognito_date, cognito_dash_date) {
    var cognito_date_yyyy = cognito_date.getFullYear();
    var cognito_date_mm = cognito_zero_lead(cognito_date.getMonth() + 1);
    var cognito_date_dd = cognito_zero_lead(cognito_date.getDate() + cognito_dash_date);
    return cognito_date_dd + "-" + cognito_date_mm + "-" + cognito_date_yyyy;
}

function cognito_zero_lead(val) {
    if (val < 10) {
        val = "0" + parseInt(val);
    }
    return val;
}

function registerCustomerToEvent(cognito_data) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/event_registers/" };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function checkIfRegister(cognito_event_id, cognito_customer_id) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/event_registers/check_if_register" };
    var cognito_data = { "event_id": cognito_event_id, "customer_id": cognito_customer_id };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function subscribeCustomerToList(cognito_data) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/subscriptions/" };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function checkIfSubscribed(cognito_subscriber_list_id, cognito_customer_id) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/subscriptions/check_if_subscribed" };
    var cognito_data = { "subscriber_list_id": cognito_subscriber_list_id, "customer_id": cognito_customer_id };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function createNewCustomer(cognito_data) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/customers/" };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function checkCustomerByEmail(cognito_email) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/customers/check_by_email" };
    var cognito_data = { email: cognito_email };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function checkCustomerByPhone(cognito_phone) {
    var cognito_ajax = { "type": "POST", "url": "/api/v1/customers/check_by_phone" };
    var cognito_data = { phone: cognito_phone };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function getCustomerByID(cognito_data) {
    var cognito_ajax = { "type": "GET", "url": "/api/v1/customers/" + cognito_data["customer_id"] };
    return runCognitoAPI(cognito_ajax, cognito_data);
}

function createCognitoURL(domain, url) {
    var protocol = '';
    if (checkVariable(is_https)) {
        protocol = 'https://';
    } else {
        protocol = 'http://';
    }
    return protocol + domain + url;
}

function runCognitoAPI(cognito_ajax, cognito_data) {
    var content_type = "application/x-www-form-urlencoded; charset=UTF-8";
    var data_type = "text";
    if (cognito_ajax["type"] == "GET" || cognito_ajax["type"].toLowerCase() == "get") {
        content_type = "application/json; charset=utf-8";
        data_type = "json";
    }
    return jQuery.ajax({
        method: cognito_ajax["type"],
        url: createCognitoURL(cognito_domain, cognito_ajax["url"]),
        data: cognito_data,
        contentType: content_type,
        dataType: data_type,
        beforeSend: setAuthorizationBasic,
        success: function(data) {
            //console.log(data);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

function setAuthorizationBasic(xhr) {
    return xhr.setRequestHeader("Authorization", "Basic " + btoa(cognito_auth_default["user"] + ":" + cognito_auth_default["pass"]));
}

function checkVariable(val) {
    if (typeof val == 'undefined' || val == null || val == '') {
        return false;
    }
    return val;
}

// Cookies
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function saveFormByCookie(data) {
    if (cognito_save_data) {
        createCookie('cognito_saved_data', JSON.stringify(data), 30);
    }
}

fillFormByCookie();

function fillFormByCookie() {
    if (cognito_save_data) {
        var cognito_saved_data = JSON.parse(readCookie('cognito_saved_data'));

        jQuery.each(cognito_saved_data, function(k, v) {
            var field = get_form_field(k);
            if (checkVariable(v)) {
                jQuery('[name="' + field + '"]').val(v);
            }
        });

    }
}

//Test
//testData();
function testData() {
    jQuery(":text").val('Cognito Test');
    jQuery("[type='email']").val('test@cognitocrm.com');
    jQuery("[type='tel']").val('0862717474');
    jQuery("textarea").val('Cognito Test');
    jQuery("select").each(function(el) {
        jQuery(this).find("option").eq(1).prop('selected', true);
    });
    jQuery(":checkbox").each(function() {
        this.checked = true;
    });
}
