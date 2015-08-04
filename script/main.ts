/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>
/// <reference path="typings/sprintf/sprintf.d.ts"/>

const url = "https://api.parse.com/1/classes/Student";
const successUrl = "success.html";

var successfulSubmissions = 0;

// TODO: Figure out how to import this function
declare function sprintf(fmt: string, ...args: any[]): string;

interface JQuery {
    assertOne(): any;
    assertOneOrMore(): any;
    assertSize(num: number): any;
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

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

class FullName {
    firstName: string;
    middleName: string;
    lastName: string;

    constructor(id) {
        var obj = $('#' + id).assertOne();
        this.firstName = obj.find('input[name=first-name]').val();
        this.middleName = obj.find('input[name=middle-name]').val();
        this.lastName = obj.find('input[name=last-name]').val();
    }

    get fullName(): string {
        var name = capitalize(this.firstName) + ' ';
        if (this.middleName != undefined && this.middleName != "") {
            name += capitalize(this.middleName) + ' ';
        }
        name += capitalize(this.lastName);
        return name;
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

    var mother = new FullName('mother-name');
    var father = new FullName('father-name');
    var address = new Address('address');
    var email = new Email('primary-email');
    var secondaryEmail = new Email('secondary-email');
    var phoneNumber = new PhoneNumber('phone-number');

    var students: Student[] = [new Student('a')];
    assert.notEqual(students.length, 0);

    var errors: string[] = [];

    var numEntries = getNumEntries();
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
                               mother.fullName);
        console.log(jsonData);
        // $.ajax({
        //     url: url,
        //     method: 'POST',
        //     data: jsonData,
        //     contentType: 'application/json',
        //     headers: {
        //         "X-Parse-Application-Id": "Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ",
        //         "X-Parse-REST-API-Key": "kl750bfRK2bF7fHKpmvEwhV9nePqXi81Ad4At8Xp"
        //     },
        //     complete: function(response, textStatus) {
        //         if (response.readyState == XMLHttpRequest.DONE && response.status == 201) {
        //             successfulSubmissions++;
        //             if (successfulSubmissions == numEntries) {
        //                 window.location.href = successUrl;
        //             }
        //         } else {
        //             console.log('Status: ' + response.status.toString());
        //             console.log('Response: ' + response.responseText);
        //             alert('An error occurred, please try again.');
        //         }
        //     },
        // });
    }
}

function displayErrors(errors: string[]): void {

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
}
