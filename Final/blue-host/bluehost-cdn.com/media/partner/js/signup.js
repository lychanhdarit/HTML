(function() {

    // Sanitize URL input by removing any protocols added by the user and
    // prepending with HTTP
    var $url = $('input[name="primary_url"]').change(function() {
        this.value = 'http://' + this.value.replace(/.*?:\/\//g, "");
    })

    // Allow for pre-checking of account name availability
    var $account      = $('input[name="account"]')
    var $available    = $('.account-available')

    // Remove the cdn referenced img for later use
    var loadingImg = $($available.html())
    $available.html('')

    loadingImg.css('display', 'inline-block')

    $account.change(function () {
        var data = {
            account: this.value
        }

        $.ajax({
            url: '/cgi/partner/signup/check_account',
            dataType: 'json',
            data: data,
            beforeSend: function (jqXHR, settings) {
                $available.html(loadingImg)
            },
            success: function (data, textStatus, jqXHR) {
                if (data && data.status) {
                    if (data.status == 'ok') {
                        $('#account_error').text('')
                        if (data.available == 0) {
                            if (data.message) {
                                $('#account_error').text(data.message)
                                $available.html('').removeClass('text-success text-danger')
                            } else {
                                $available.html('Not Available').removeClass('text-success').addClass('text-danger')
                            }
                        } else {
                            $available.html('Available').removeClass('text-danger').addClass('text-success')
                        }
                    } else if (data.status == 'throttled') {
                        // Uhhh... not sure what to do here.
                    }
                }
            }
        })
    })

}).call(this)
