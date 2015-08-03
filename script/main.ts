/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>
/// <reference path="typings/sprintf/sprintf.d.ts"/>

const url = "https://api.parse.com/1/classes/Student";

// TODO: Figure out how to import this function
declare function sprintf(fmt: string, ...args: any[]): string;

function getStudents(): JQuery {
    var $students = $('div[id^=student-]');
    assert.equal($students.length, 4);
    return $students;
}

function numEntriesChanged($numEntries: JQuery) {
    var val = parseInt($numEntries.find('option:selected').val(), 10);
    assert.ok(!isNaN(val));

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
    var cost = parseInt($cost.text(), 10);
    assert.ok(!isNaN(cost));

    var totalCost = val * cost;
    $cost.text(totalCost);
}

class FullName {
    constructor(id) {
    }

    get fullName(): string {
        return "";
    }

    check(errors: string[]): void {
    }
}

class Address {
    constructor(id) {
    }

    get address(): string {
        return "";
    }

    check(errors: string[]): void {
    }
}

class Email {
    constructor(id) {
    }

    get email(): string {
        return "";
    }

    check(errors: string[]): void {
    }
}

class PhoneNumber {
    constructor(id) {
    }

    get phoneNumber(): string {
        return "";
    }

    check(errors: string[]): void {
    }
}

class Student {
    constructor(id) {
    }

    get name(): string {
        return "";
    }

    get className(): string {
        return "";
    }

    get birthday(): string {
        return "";
    }

    get gender(): string {
        return "";
    }

    check(errors: string[]): void {
    }
}

function handleSubmit(e) {
    e.preventDefault();
    $('#loading').removeClass('hide');

    var jsonFormat = '{'
        + '"address": "%s",'
        + '"primaryEmail": "%s",'
        + '"secondaryEmail": "%s",'
        + '"phoneNumber": "%s",'
        + '"name": "%s",'
        + '"class": "%s",'
        + '"gender": "%s",'
        + '"mother": "%s",'
        + '"father": "%s",'
        + '}';

    var mother = new FullName('mother-name');
    var father = new FullName('father-name');
    var address = new Address('address');
    var email = new Email('primary-email');
    var secondaryEmail = new Email('secondary-email');
    var phoneNumber = new PhoneNumber('phone-number');
    var students: Student[] = []; // TODO
    assert.notEqual(students.length, 0);

    var errors: string[] = [];

    var numEntries = parseInt($('#numEntries option:selected').val(), 10);
    assert.notEqual(numEntries, 0);
    for (var i = 0; i < numEntries; i++) {
        students[i].check(errors);
    }

    mother.check(errors);
    father.check(errors);
    address.check(errors);
    email.check(errors);
    secondaryEmail.check(errors);
    phoneNumber.check(errors);

    if (errors.length != 0) {
        displayErrors(errors);
        window.scrollTo(0, 0);
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
        $.ajax({
            url: url,
            method: 'POST',
            data: jsonData,
            async: false,
            contentType: 'application/json',
            headers: {
                "X-Parse-Application-Id": "AogX439PltSvXCM8XNKry0M5cdEDQE77s4rrFkJ1",
                "X-Parse-REST-API-Key": "ucHeWSHsIhSlhjbO9S2w8qgM5IqxOwxNjbKWspQj"
            }
        });
    }

    $('#loading').hide();
}

function displayErrors(errors: string[]): void {

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
