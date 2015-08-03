/// <reference path="typings/jquery/jquery.d.ts"/>

$('#numentries').change(function() {
    var val = parseInt($('#numentries option:selected').val(), 10);
    for (var i = 1; i <= 4; i++) {
        if (i <= val) {
            $('#student-' + i).removeClass('hide');
        } else {
            $('#student-' + i).addClass('hide');
        }
    }

    if (val == 0) {
        $('#form').addClass('hide');
    } else {
        $('#form').removeClass('hide');
    }
})
