(function() {

    $(document).ready(function() {

        // Inform us that JavaScript is actually available
        $('html').removeClass('no-js')

        $('.js-select').each(function() {
            var $el = $(this)

            if ($el.hasClass('select2-block')) {
                $el.select2({
                    containerCssClass: 'select2-block',
                    dropdownAutoWidth: true
                })
            }
            else {
                $el.select2({
                    dropdownAutoWidth: true
                })
            }
        })

        $('input[data-type="daterange"]').daterangepicker({
            separator: ',',
            format: 'YYYY-MM-DD'
        });

        $('input[data-type="daterange"]').on('apply.daterangepicker', function() {
            $(this).closest('form').submit()
        })

        $('.js-autosubmit').on('change', function() {
            $(this).closest('form').submit()
        })

    })

}).call(this)
