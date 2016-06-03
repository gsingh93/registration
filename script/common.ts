/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>
/// <reference path="typings/sprintf/sprintf.d.ts"/>
/// <reference path="form_types.ts"/>

const successUrl = "success.html";

// TODO: Figure out how to import this function
declare function sprintf(fmt: string, ...args: any[]): string;

interface JQuery {
    assertOne(): any;
    assertOneOrMore(): any;
    assertOneOrLess(): any;
    assertSize(num: number): any;
}

class App {
    private TESTING: boolean = true;
    private successfulSubmissions: number = 0;
    private cost: number;

    constructor(private id: string, private url: string, private app_id, private api_key: string) {
        if (window.location.hash == '#test') {
            this.TESTING = true;
        }
        this.cost = toNum($('#cost').text());
        addAssertFunctions();

        this.getStudents().each(function(index, elt) {
            $(elt).hide();
        });
        $('#form').hide();

        var $numEntries = $('#numentries');
        $numEntries.change(() => this.numEntriesChanged($numEntries));

        $('#submit').click((e) => this.handleSubmit(e));
    }

    private numEntriesChanged($numEntries: JQuery) {
        var val = getNumEntries($numEntries);

        var $students = this.getStudents();
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

        var totalCost = val * this.cost;
        $('#cost').text(totalCost);
    }

    private handleSubmit(e) {
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
            students.push(new Student($('#' + this.id + '-' + i).assertOne()));
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
            if (this.TESTING) {
                console.log(jsonData);
                this.successfulSubmissions++;
                if (this.successfulSubmissions == numEntries) {
                    window.location.href = successUrl;
                }
            } else {
                $.ajax({
                    url: this.url,
                    method: 'POST',
                    data: jsonData,
                    contentType: 'application/json',
                    headers: {
                        "X-Parse-Application-Id": this.app_id,
                        "X-Parse-REST-API-Key": this.api_key,
                    },
                    complete: function(response, textStatus) {
                        if (response.readyState == XMLHttpRequest.DONE && response.status == 201) {
                            this.successfulSubmissions++;
                            if (this.successfulSubmissions == numEntries) {
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
    }

    private getStudents(): JQuery {
        var $students = $('div[id^=' + this.id + '-]');
        assert.equal($students.length, 4);
        return $students;
    }
}

function getNumEntries($numEntries?: JQuery): number {
    if (!$numEntries) {
        var $numEntries = $('#numentries');
    }
    return toNum($numEntries.find('option:selected').val());
}

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
