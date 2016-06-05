function capitalize(s: string): string {
    if (s.length == 0) {
        return "";
    }
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function capitalize_words(s: string): string {
    return s.split(' ').map(function(w) { return capitalize(w); }).join(' ');
}

function resetField($field: JQuery): JQuery {
    $field.removeClass('invalid');
    return getErrorField($field).text('');
}

// Returns false if required field was not set, true otherwise. This function should be called
// before other checks, as it removes the `invalid` class from the field.
function checkRequired($field: JQuery, val: string, name: string, errors: Error_[]): boolean {
    if (val == "") {
        var $errorField = getErrorField($field);
        errors.push(new Error_(name + ' is a required field.', $errorField))
        $field.addClass('invalid');
        return false;
    }
    return true;
}

function getErrorField(obj: JQuery): JQuery {
    return obj.parent().find('.error').assertOne();
}

class Error_ {
    constructor(public message: string, public obj: JQuery) {
    }
}

class FullName {
    private _firstName: JQuery;
    private _middleName: JQuery;
    private _lastName: JQuery;

    constructor(obj: JQuery) {
        this._firstName = obj.find('input[name=first-name]').assertOne();
        this._middleName = obj.find('input[name=middle-name]').assertOneOrLess();
        this._lastName = obj.find('input[name=last-name]').assertOne();
    }

    get firstName(): string {
        return this._firstName.val().trim();
    }

    get middleName(): string {
        if (this._middleName.length == 0) {
            return "";
        }
        return this._middleName.val().trim();
    }

    get lastName(): string {
        return this._lastName.val().trim();
    }

    get fullName(): string {
        var name = capitalize(this.firstName) + ' ';
        if (this.middleName != "") {
            name += capitalize(this.middleName) + ' ';
        }
        name += capitalize(this.lastName);
        return name;
    }

    checkField($field: JQuery, value: string, name: string, errors: Error_[]): void {
        if (checkRequired($field, value, name, errors)) {
            if (value.split(' ').length != 1) {
                var $errorField = getErrorField($field);
                errors.push(new Error_(name + ' should only be one word', $errorField));
                $field.addClass('invalid');
            }
        }
    }

    check(errors: Error_[]): void {
        this.reset();
        this.checkField(this._firstName, this.firstName, 'First name', errors);
        if (this.middleName != '') {
            this.checkField(this._middleName, this.middleName, 'Middle name', errors);
        }
        this.checkField(this._lastName, this.lastName, 'Last name', errors);
    }

    reset(): void {
        resetField(this._firstName);
        resetField(this._lastName);

        if (this._middleName.length != 0) {
            resetField(this._middleName);
        }
    }
}

class Address {
    _street: JQuery;
    _city: JQuery;
    _state: JQuery;
    _zipcode: JQuery;
    _foreign: JQuery;

    constructor(obj: JQuery) {
        this._street = obj.find('input[name=street]').assertOne();
        this._city = obj.find('input[name=city]').assertOne();
        this._state = obj.find('select[name=state]').assertOne();
        this._zipcode = obj.find('input[name=zip-code]').assertOne();
        this._foreign = obj.find('input[name=foreign]').assertOne();
    }

    get street(): string {
        return this._street.val().trim();
    }

    get city(): string {
        return this._city.val().trim();
    }

    get state(): string {
        return this._state.val();
    }

    get zipcode(): string {
        return this._zipcode.val().trim();
    }

    get foreign(): boolean {
        return this._foreign.is(':checked')
    }

    get address(): string {
        if (this.foreign) {
            return 'Outside of US';
        } else {
            return capitalize_words(this.street) + ', ' + capitalize_words(this.city)
                + ', ' + this.state + ', ' + this.zipcode;
        }
    }

    check(errors: Error_[]): void {
        resetField(this._street);
        resetField(this._city);
        var $zipErrorField = resetField(this._zipcode);

        if (this.foreign) {
            return;
        }

        checkRequired(this._street, this.street, 'Street', errors);
        checkRequired(this._city, this.city, 'City', errors);
        if (checkRequired(this._zipcode, this.zipcode, 'ZIP code', errors)) {
            if (!/^[0-9]{5}$/.test(this.zipcode)) {
                this._zipcode.addClass('invalid');
                errors.push(new Error_('Invalid ZIP code', $zipErrorField));
            }
        }
    }
}

class Email {
    _email: JQuery;
    _confirm: JQuery;

    constructor(obj: JQuery) {
        this._email = obj.find('input[name=email]').assertOne();
        this._confirm = obj.find('input[name=confirm-email]').assertOne();
    }

    get email(): string {
        return this._email.val().trim();
    }

    get confirmEmail(): string {
        return this._confirm.val().trim();
    }

    check(errors: Error_[]): void {
        var $errorField = resetField(this._email);
        var $confirmErrorField = resetField(this._confirm);

        if (checkRequired(this._email, this.email, 'Email', errors)) {
            if (!/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.email)) {
                this._email.addClass('invalid');
                errors.push(new Error_('Invalid email address', $errorField));
            }
            if (this.email != this.confirmEmail) {
                this._email.addClass('invalid');
                this._confirm.addClass('invalid');
                errors.push(new Error_("Email addresses don't match", $confirmErrorField));
            }
        } else {
            this._confirm.addClass('invalid');
        }
    }

    reset(): void {
        resetField(this._email);
        resetField(this._confirm);
    }
}

class PhoneNumber {
    _number: JQuery;

    constructor(obj: JQuery) {
        this._number = obj.find('input[name=phone-number]').assertOne();
    }

    get phoneNumber(): string {
        return this._number.val().trim();
    }

    check(errors: Error_[]): void {
        var $errorField = resetField(this._number);
        if (checkRequired(this._number, this.phoneNumber, 'Phone number', errors)) {
            if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(this.phoneNumber)) {
                this._number.addClass('invalid');
                errors.push(new Error_('Phone number should be in xxx-xxx-xxxx format',
                                       $errorField));
            }
        }
    }
}

class Date_ {
    _day: JQuery;
    _month: JQuery;
    _year: JQuery;

    constructor(obj: JQuery) {
        this._day = obj.find('.day').assertOne();
        this._month = obj.find('.month').assertOne();
        this._year = obj.find('.year').assertOne();
    }

    get date(): string {
        return this._month.val() + ' ' + this._day.val() + ', ' + this._year.val();
    }
}

class Gender {
    _genderInput: JQuery;
    _gender: JQuery;

    constructor(obj: JQuery) {
        this._genderInput = obj.find('input[name^=gender]').assertSize(2);
        this._gender = obj.find('input[name^=gender]:checked').assertOneOrLess();
    }

    get gender(): string {
        return this._gender.val();
    }

    check(errors: Error_[]): void {
        var $errorField = this._genderInput.parents('.gender').find('.error').assertOne();
        $errorField.text('');
        if (this._gender.length == 0) {
            errors.push(new Error_('Gender is a required field.', $errorField))
        }
    }
}

class Student {
    private _name: FullName;
    private _classSelector: JQuery;
    private _birthday: Date_;
    private _gender: Gender;

    constructor(obj: JQuery) {
        this._name = new FullName(obj.find('.full-name').assertOne());
        this._classSelector = obj.find('select[name=class]').assertOne();
        this._birthday = new Date_(obj.find('.date').assertOne());
        this._gender = new Gender(obj.find('.gender').assertOne());
    }

    get name(): string {
        return this._name.fullName;
    }

    get className(): string {
        return this._classSelector.find('option:selected').val();
    }

    get birthday(): string {
        return this._birthday.date;
    }

    get gender(): string {
        return this._gender.gender;
    }

    check(errors: Error_[]): void {
        var $errorField = resetField(this._classSelector);

        this._name.check(errors);
        this._gender.check(errors);

        // TODO: Make sure birthday is set

        if (this.className == 'invalid') {
            errors.push(new Error_(
                'Please select a grade, or select "I don\'t know" if you are not sure',
                $errorField
            ));
        }
    }
}

class Camper {
    private _name: FullName;
    private _tShirtSelector: JQuery;
    private _age: JQuery;
    private _gender: Gender;
    private _skills: JQuery;

    constructor(obj: JQuery) {
        this._name = new FullName(obj.find('.full-name').assertOne());
        this._tShirtSelector = obj.find('select[name=tshirt]').assertOne();
        this._age = obj.find('.number').assertOne();
        this._gender = new Gender(obj.find('.gender').assertOne());
        this._skills = obj.find('.skills').assertOne();
    }

    get name(): string {
        return this._name.fullName;
    }

    get tShirt(): string {
        return this._tShirtSelector.find('option:selected').val();
    }

    get age(): string {
        return this._age.find('option:selected').val();
    }

    get gender(): string {
        return this._gender.gender;
    }

    get skills(): string {
        var selected = this._skills.find('input:checkbox:checked + span').toArray();
        return selected.map((x) => $(x).text()).join(', ');
    }

    check(errors: Error_[]): void {
        var $tShirtErrorField = resetField(this._tShirtSelector);
        var $ageErrorField = resetField(this._age);

        this._name.check(errors);
        this._gender.check(errors);

        if (this.age == 'invalid') {
            errors.push(new Error_(
                'Please choose an age',
                $ageErrorField
            ));
        }

        if (this.tShirt == 'invalid') {
            errors.push(new Error_(
                'Please choose a t-shirt size',
                $tShirtErrorField
            ));
        }
    }
}
