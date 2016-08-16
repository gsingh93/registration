/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/assert/assert.d.ts"/>
/// <reference path="form_types.ts"/>

const successUrl = "success.html";
declare var firebase: any;

interface JQuery {
    assertOne(): any;
    assertOneOrMore(): any;
    assertOneOrLess(): any;
    assertSize(num: number): any;
}

abstract class App {
    private TESTING: boolean = false;
    private successfulSubmissions: number = 0;
    private cost: number;
    private lateCost: number;

    protected abstract get_json_data(registrant: Registrant, jsonData: Object): void;
    protected abstract create_registrant(id: number): Registrant;
    protected abstract get_id(): string

    constructor(
        private url: string,
        private app_id: string,
        private api_key: string
    ) {
        if (window.location.hash == '#test') {
            this.TESTING = true;
        }
        this.cost = toNum($('#cost').text());
        var lateCost = $('#late-cost').text()
        if (lateCost !== '') {
            this.lateCost = toNum(lateCost);
        }
        addAssertFunctions();

        this.getRegistrants().each(function(index, elt) {
            $(elt).hide();
        });
        $('#form').hide();

        var $numEntries = $('#numentries');
        $numEntries.change(() => this.numEntriesChanged($numEntries));

        $('#submit').click((e) => this.handleSubmit(e));
    }

    private numEntriesChanged($numEntries: JQuery) {
        var val = getNumEntries($numEntries);

        var $registrants = this.getRegistrants();
        for (var i = 0; i < 4; i++) {
            if (i < val) {
                $registrants.eq(i).fadeIn();
            } else {
                $registrants.eq(i).fadeOut();
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
        var totalLateCost = val * this.lateCost;
        $('#cost').text(totalCost);
        $('#late-cost').text(totalLateCost);
    }

    private handleSubmit(e) {
        e.preventDefault();
        $('#loading').show();

        var mother = new FullName($('#mother-name').assertOne());
        var father = new FullName($('#father-name').assertOne());
        var address = new Address($('.address').assertOne());
        var email = new Email($('#primary-email').assertOne());
        var secondaryEmail = new Email($('#secondary-email').assertOne());
        //var cellPhoneNumber = new PhoneNumber($('.phone-number:eq(0)').assertOne(), 'Cell');
        var homePhoneNumber = new PhoneNumber($('.phone-number:eq(0)').assertOne(), 'Home');

        var registrants = [];
        for (var i = 1; i <= 4; i++) {
            registrants.push(this.create_registrant(i));
        }
        assert.notEqual(registrants.length, 0);

        var errors: Error_[] = [];

        var numEntries = getNumEntries();
        assert.notEqual(numEntries, 0);
        for (var i = 0; i < numEntries; i++) {
            registrants[i].check(errors);
        }

        mother.check(errors);
        father.check(errors);
        address.check(errors);
        email.check(errors);
        secondaryEmail.reset();
        if (secondaryEmail.email != '' || secondaryEmail.confirmEmail != '') {
            secondaryEmail.check(errors);
        }
        //cellPhoneNumber.check(errors);
        homePhoneNumber.check(errors);

        // TODO: There may be more errors
        if (errors.length != 0) {
            displayErrors(errors);
            $('#loading').hide();
            return;
        }

        for (var i = 0; i < numEntries; i++) {
            var registrant = registrants[i];

            var jsonData = {
                'address': address.address,
                'primaryEmail': email.email,
                'secondaryEmail': secondaryEmail.email,
                //'cellPhoneNumber': cellPhoneNumber.phoneNumber,
                'homePhoneNumber': homePhoneNumber.phoneNumber,
                'name': registrant.name,
                'gender': registrant.gender,
                'mother': mother.fullName,
                'father': father.fullName,
                'timestamp': Date.now(),
            };

            this.get_json_data(registrant, jsonData);

            if (this.TESTING) {
                console.log(jsonData);
                this.successfulSubmissions++;
                if (this.successfulSubmissions == numEntries) {
                    window.location.href = successUrl;
                }
            } else {
                console.log(jsonData);
                var newStudentRef = firebase.database().ref('/students').push();
                newStudentRef.set(jsonData)
                    .then((function() {
                        this.successfulSubmissions++;
                        if (this.successfulSubmissions == numEntries) {
                            // TODO: Send email confirmation
                            window.location.href = successUrl;
                        }
                    }).bind(this))
                    .catch(function(error) {
                        console.log('Error: ' + error);
                        alert('An error occurred, please try again.');
                    });
            }
        }
    }

    private getRegistrants(): JQuery {
        var $registrants = $('div[id^=' + this.get_id() + '-]');
        assert.equal($registrants.length, 4);
        return $registrants;
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
