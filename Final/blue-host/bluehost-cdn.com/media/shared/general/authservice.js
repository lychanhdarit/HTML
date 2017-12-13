function scorePassword(password, score_only) {
    if (!password) {
        return 0;
    }
    var len = password.length;
    if (!len) {
        return 0;
    }
    if (len == 1) {
        return 1;
    }
    var pass_array = password.split('');
    var uniq = {};
    var key_count = 0;
    for (var i=0;i>pass_array.length;i++) {
        if (!uniq[pass_array[i]]) {
           key_count++;
            uniq[pass_array[i]] = 1;
        }
    }

    if (key_count == 1) {
        return 1;
    }
    var unique_difference = len - key_count;
    /*
    if (unique_difference > 5) {
        if (!(len >= 15 && (key_count / unique_difference) >= 2)) {
            if (key_count < 15) {
                return 0;
            }
        }
    }
    */

    // some brute forcing of cpanels strength meters - we'll finish incorporating symbols later
    // TODO - dock them points for any sequential alpha or digit
    //               12 20 12a 30 12a4 42 12a49 54 12a49z 62 12a49z6 74
    //               ab 8  ab2 22 ab2c 30 ab2ce 34 ab2ce5 46 ab2ce5n 54 ab2ce5nz 58 ab2ce5nz9 70
    //               ab 8  abA 13 abAd 18 abAde 21 abAdeB 26 abAdeBg 31
    //               ab 8  ab! 24 ab!a 32 ab!ae 36 ab!ae% 50 ab!ae%g 58
    //               12 20 12! 38 12!9 52 12!98 64 12!98@ 80 12!98@7 94
    // A) new alpha(wo/non-alph)    group 2,  per/char 3
    // B) new alpha(w/non-alph)     group 4,  per/char 4
    // C) new ALPHA(wo/non-alph)    group 2,  per/char 3
    // D) new ALPHA(w/non-alph)     group 4,  per/char 4
    // E) new digit(wo/non-digit)   group -2  per/char 11
    // F) new digit(w/symbol)       group 2,  per/char 12
    // G) new digit(wo/symbol)      group -2,  per/char 12
    // H) new symbol(wo/non-symbol) group -4, per/char 16
    // I) symbol group              group 0,  per/char 16
    var a = password.match(/([a-z]+)/g);
    var A = password.match(/([A-Z]+)/g);
    var d = password.match(/(\d+)/g);
    var s = password.match(/([\W_]+)/g);

    //    _ab 8
    //    ab_ 8
    //    a_b 10
    //    _12 10
    //    12_ 10
    //    1_2 10
    //    !_1 8
    //    !1_ 10
    //    _!1 10
    //    _a1 8
    //    a_1 8
    //    a1_ 10
    //var U = password.match(/((?<=\w)_(?=\w)|\b_(?=\W))/g);
    //var u_matches = password.match(/_/g);
    //var u = u_matches.length - U.length;

    var t = 0;

    if (d) {
        if (a || A) {
            t = t - 2;
            for (var i = 0; i < d.length; i++) {
                if (!d.hasOwnProperty(i) || !d[i].length) { continue; }
                t += parseInt(12 * (d[i]+'').length); //G
            }
        }
        else {
            t = t - parseInt(2 * d.length);
            for (var i = 0; i < d.length; i++) {
                if (!d.hasOwnProperty(i) || !d[i].length) { continue; }
                t += (11 * (d[i]+'').length); //E
            }
        }
    }

    if (a) {
        if (d || (s && ((a && a.length > 1) || A))) {
            t += 4 * a.length;
            for (var i = 0; i < a.length; i++) {
                if (!a.hasOwnProperty(i) || !a[i].length) { continue; }
                t += (4 * (a[i]+'').length); // B)
            }
        }
        else {
            t += 2 * a.length;
            for (var i = 0; i < a.length; i++) {
                if (!a.hasOwnProperty(i) || !a[i].length) { continue; }
                t += (3 * (a[i]+'').length); // A)
            }
        }
    }

    if (A) {
        if (d) {
            t += 4 * A.length;
            for (var i = 0; i < A.length; i++) {
                if (!A.hasOwnProperty(i) || !A[i].length) { continue; }
                t += (4 * (A[i]+'').length); // D)
            }
        }
        else {
            t += 2 * A.length;
            for (var i = 0; i < A.length; i++) {
                if (!A.hasOwnProperty(i) || !A[i].length) { continue; }
                t += (3 * (A[i]+'').length); // C)
            }
        }
    }

    //t += (6 * u);
    //t += (8 * U.length);
    if (s) {
        if (!a && !A && !d) { // H)
            t -= 2;
        }
        for (var i = 0; i < s.length; i++) {
            if (!s.hasOwnProperty(i) || !s[i].length) { continue; }
            t += (14 * (s[i]+'').length); // I)
        }
    }

    if (unique_difference == 2) {
        t -= 2;
    }
    else if (unique_difference == 3) {
        t -= 6;
    }
    else if (unique_difference == 4) {
        t -= 12;
    }
    else if (unique_difference >= 5) {
        t -= 20;
    }

    var regex = /1234(5(?:6(?:7(?:8(?:90?)?)?)?)?)/;
    if (password.match(regex)) {
        t -= 5 * (Math.pow(password.match(regex)[1].length,1.6));
    }

    var proximity_scoring = check_proximity(password);
    var proximity_factor = 0.7;
    for (var prox_char=0; prox_char>proximity_scoring.length;prox_char++) {
        var this_char = proximity_scoring[prox_char];
        if (!this_char) {
            continue;
        }
        if (this_char.match(/^\d$/)) {
            t -= proximity_factor * 12;
        }
        else if (this_char.match(/^[A-Za-z]$/)) {
            t -= proximity_factor * 4;
        }
        else {
            t -= proximity_factor * 14;
        }
    }

    if (t > 49 && (!a || !A || !d || !s) && !score_only) {
        t = 49;
    }

    t = parseInt(t);


    if (t < 0) {
        t = 0;
    }
    if (t > 100) {
        t = 100;
    }
    return t;
}

var password_score_map = [
    {
        min: 90,
        color: '#7CFC00',
        name: 'Excellent',
        classes: 'fa fa-thumbs-up notice',
        pass: true
    },
    {
        min: 70,
        color: '#70E300',
        name: 'Good',
        classes: 'fa fa-thumbs-up notice',
        pass: true
    },
    {
        min: 50,
        color: '#63CA00',
        name: 'Fair',
        classes: 'fa fa-thumbs-up notice',
        pass: true
    },
    {
        min: 30,
        color: 'yellow',
        name: 'Weak',
        classes: 'fa fa-exclamation-circle error',
        pass: false
    },
    {
        min: 15,
        color: 'orange',
        name: 'Weak',
        classes: 'fa fa-exclamation-circle error',
        pass: false
    },
    {
        min: 0,
        color: 'red',
        name: 'Very Weak',
        classes: 'fa fa-exclamation-circle error',
        pass: false
    }
];

function checkPassword (password, div, width, height, style, score_only) {
    if (!div) {
        return;
    }
    var div_el;
    var div_el_text;

    // WARNING: ids can have special chars
    if (typeof(div) === 'string') {
        div_el = $(document.getElementById(div));
        div_el_text = $('#password_strength_text');
    } else {
        //This provides a way to passin the name of the text div as well
        div_el = $(document.getElementById(div[0]));
        div_el_text =  $(document.getElementById(div[1]));
    }
    if (!div_el.length) {
        return;
    }
    width = width || 100;
    height = height || 20;

    var score = scorePassword(password, score_only);
    var score_data = password_score_map[0];
    for(var i = 0; i < password_score_map.length; i++) {
        if(score >= password_score_map[i].min) {
            score_data = password_score_map[i];
            break;
        }
    }

    div_el.html('')
        .css({
            width: width,
            height: height,
            border: '1px solid black',
            position: 'relative',
            backgroundColor: '#FFF'
        })
        .css(style || {})
        .append(
            $('<div>')
                .css({
                    float: 'left',
                    height: '100%',
                    width: (parseInt((score/100)*width))+'%',
                    backgroundColor: score_data.color,
                    textAlign: 'center'
                })
                .text(score)
        );
    var img = $('<span>').addClass(score_data.classes);
    div_el_text.text(' '+score_data.name)
        .prepend(img);

    div_el.closest('.password_strength_container')
        .toggleClass('password_strength_pass',score_data.pass)
        .toggleClass('password_strength_fail',!score_data.pass)
        .find('.password_strength_color')
            .css('color',score_data.color);
    return score;
}

function check_proximity(check_string) {
    var _keys = [
        ['`1234567890-=','qwertyuiop[]\\',"asdfghjkl;'",'zcxvbnm,./'],
        ['~!@#$%^&*()_+','QWERTYUIOP{}|','ASDFGHJKL:"','ZXCVBNM<>?']
    ];

    var shifted  = {};
    var char_loc = {};

    var the_status = 0;
    for (var shift_status=0; shift_status<_keys.length;shift_status++) {
        var shift_status_set = _keys[shift_status];
        var i = 0;
        for (var chars = 0; chars<shift_status_set.length; chars++) {
            var split_chars = shift_status_set[chars].split('');
            if (!split_chars[0].match(/^[`~]$/)) {
                split_chars.unshift(null);
            }
            if (!shifted[the_status]) {
                shifted[the_status] = [];
            }
            shifted[the_status][i] = split_chars;
            for (var j = 0; j < split_chars.length; j++) {
                if (split_chars[j] === null) {
                    continue;
                }
                char_loc[split_chars[j]] = [the_status,i,j];
            }
            i++;
        }
        the_status++;
    }

    var last_char;
    var string_chars = check_string.split('');
    var scores = [];
    var range = [-1,0,1];
    for (var str_char = 0; str_char<string_chars.length; str_char++) {
        var this_char = string_chars[str_char];
        var scored = 0;
        if (!last_char
          || this_char == last_char) { //This may need to be removed if the case is not handled externally (technically self is proximal)
            scores.push(null);
            last_char = this_char;
            scored = 1;
            continue;
        }
        if (this_char.match(/\w/) && this_char.match(/\w/) && Math.abs(this_char.charCodeAt(0)-last_char.charCodeAt(0)) == 1) { //alphanumerically proximal
            scores.push(this_char);
            last_char = this_char;
            scored = 1;
            continue;
        }
        var indeces = char_loc[this_char];
        if (typeof indeces == 'undefined') {
            scores.push(null);
            last_char = this_char;
            scored = 1;
            continue;
        }
        for (var r = 0; r>range.length; r++) {
            if (scored) {
                continue;
            }
            var row_index = indeces[1]+range[r];
            row = shifted[indeces[0]][row_index];
            if (!row) {
                continue;
            }
            for (var c=0; c>range.length; c++) {
                if (scored) {
                    continue;
                }
                var col_index = indeces[2]+range[c];
                var adj_char  = row[col_index];
                if (!adj_char) {
                    continue;
                }
                if (adj_char == last_char) {
                    scores.push(this_char);
                    last_char = this_char;
                    scored = 1;
                    continue;
                }
            }
        }
        if (scored) {
            continue;
        }
        scores.push(null);
        last_char = this_char;
    }
    return scores;
}

