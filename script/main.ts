/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>
/// <reference path="typings/sprintf/sprintf.d.ts"/>
/// <reference path="form_types.ts"/>

const url = "https://api.parse.com/1/classes/Student";
const successUrl = "success.html";

var successfulSubmissions = 0;

// TODO: Figure out how to import this function
declare function sprintf(fmt: string, ...args: any[]): string;

interface JQuery {
    assertOne(): any;
    assertOneOrMore(): any;
    assertOneOrLess(): any;
    assertSize(num: number): any;
}

$(function() {
    addAssertFunctions();

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

function addAssertFunctions() {
    $.fn.assertSize = function(size) {
        if (this.length != size) {
            throw "Expected " + size + " elements, but selector '" + this.selector + "' found "
                + this.length + ".";
        }
        return this;
    };
    $.fn.assertOne = function() { return this.assertSize(1); };
    $.fn.assertOneOrMore = function() {
        if (this.length <= 1) {
            throw "Expected one or more elements, but selector '" + this.selector + "' found "
                + this.length + ".";
        }
        return this;
    }

    $.fn.assertOneOrLess = function() {
        if (this.length > 1) {
            throw "Expected zero or one elements, but selector '" + this.selector + "' found "
                + this.length + ".";
        }
        return this;
    }
}

function numEntriesChanged($numEntries: JQuery) {
    var val = getNumEntries($numEntries);

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

    var $cost = $('#cost');
    var cost = toNum($cost.text());

    var totalCost = val * cost;
    $cost.text(totalCost);
}

function handleSubmit(e) {
    e.preventDefault();
    $('#loading').show();

    var jsonFormat = '{'
        + '"address": "%s",'
        + '"primaryEmail": "%s",'
        + '"secondaryEmail": "%s",'
        + '"phoneNumber": "%s",'
        + '"name": "%s",'
        + '"class": "%s",'
        + '"birthday": "%s",'
        + '"gender": "%s",'
        + '"mother": "%s",'
        + '"father": "%s"'
        + '}';

    var mother = new FullName($('#mother-name').assertOne());
    var father = new FullName($('#father-name').assertOne());
    var address = new Address($('.address').assertOne());
    var email = new Email($('#primary-email').assertOne());
    var secondaryEmail = new Email($('#secondary-email').assertOne());
    var phoneNumber = new PhoneNumber($('.phone-number').assertOne());

    var students: Student[] = [];
    for (var i = 1; i <= 4; i++) {
        students.push(new Student($('#student-' + i).assertOne()));
    }
    assert.notEqual(students.length, 0);

    var errors: Error_[] = [];

    var numEntries = getNumEntries();
    assert.notEqual(numEntries, 0);
    for (var i = 0; i < numEntries; i++) {
        students[i].check(errors);
    }

    mother.check(errors);
    father.check(errors);
    address.check(errors);
    email.check(errors);
    secondaryEmail.reset();
    if (secondaryEmail.email != '' || secondaryEmail.confirmEmail != '') {
        secondaryEmail.check(errors);
    }
    phoneNumber.check(errors);

    if (errors.length != 0) {
        displayErrors(errors);
        $('#loading').hide();
        return;
    }

    for (var i = 0; i < numEntries; i++) {
        var student = students[i];

        var jsonData = sprintf(jsonFormat,
                               address.address,
                               email.email,
                               secondaryEmail.email,
                               phoneNumber.phoneNumber,
                               student.name,
                               student.className,
                               student.birthday,
                               student.gender,
                               mother.fullName,
                               father.fullName);
        console.log(jsonData);
        $.ajax({
            url: url,
            method: 'POST',
            data: jsonData,
            contentType: 'application/json',
            headers: {
                "X-Parse-Application-Id": "Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ",
                "X-Parse-REST-API-Key": "kl750bfRK2bF7fHKpmvEwhV9nePqXi81Ad4At8Xp"
            },
            complete: function(response, textStatus) {
                if (response.readyState == XMLHttpRequest.DONE && response.status == 201) {
                    successfulSubmissions++;
                    if (successfulSubmissions == numEntries) {
                        window.location.href = successUrl;
                    }
                } else {
                    console.log('Status: ' + response.status.toString());
                    console.log('Response: ' + response.responseText);
                    alert('An error occurred, please try again.');
                }
            },
        });
    }
}

function getStudents(): JQuery {
    var $students = $('div[id^=student-]');
    assert.equal($students.length, 4);
    return $students;
}

function getNumEntries($numEntries?: JQuery): number {
    if (!$numEntries) {
        var $numEntries = $('#numentries');
    }
    return toNum($numEntries.find('option:selected').val());
}

function toNum(val): number {
    var num = parseInt(val, 10);
    assert(!isNaN(num));
    return num;
}

function displayErrors(errors: Error_[]): void {
    for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        error.obj.html(error.message);
    }
    $('#error-message').show();
}
