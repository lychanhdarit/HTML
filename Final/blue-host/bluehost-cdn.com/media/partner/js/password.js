$(document).ready(function () {

    // Pass-meter implementation
    // -------------------------

    var $strengthmeter = $('.password-strength-meter-bar')

    $('input[name="password"]').passMeter(function (score) {
        $strengthmeter.width(score + '%').removeClass('danger warning almost success')

        if (score < 35) {
            $strengthmeter.addClass('danger')
        } else if (score >= 35 && score < 75) {
            $strengthmeter.addClass('warning')
        } else if (score >= 75 && score < 100) {
            $strengthmeter.addClass('almost')
        } else if (score >= 100) {
            $strengthmeter.addClass('success')
        }
    })

})