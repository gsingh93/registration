/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>

function getStudents(): JQuery {
    var $students = $('div[id^=student-]');
    assert.equal($students.length, 4);
    return $students;
}

function numEntriesChanged($numEntries: JQuery) {
    var val = parseInt($numEntries.find('option:selected').val(), 10);
    var $students = getStudents();
    for (var i = 0; i < 4; i++) {
        if (i < val) {
            $students.eq(i).fadeIn();
        } else {
            $students.eq(i).fadeOut();
        }
    }

    var $form = $('#form');
    if (val == 0) {
        $form.fadeOut();
    } else {
        if (!$form.is(':visible')) {
            $form.fadeIn();
        }
    }
}

function handleSubmit(e) {
    e.preventDefault();
    $('#loading').removeClass('hide');
}

$(function() {
    getStudents().each(function(index, elt) {
        $(elt).hide();
    });
    $('#form').hide();

    var $numEntries = $('#numentries');
    $numEntries.change(function() {
        numEntriesChanged($numEntries);
    });

    $('#submit').click(handleSubmit);
});
