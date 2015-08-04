function capitalize(s: string): string {
    if (s.length == 0) {
        return "";
    }
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function capitalize_words(s: string): string {
    return s.split(' ').map(function(w) { return capitalize(w); }).join(' ');
}

// Returns false if required field was not set, true otherwise
function checkRequired(val: string, name: string, errors: string[]): boolean {
    if (val == "") {
        errors.push(name + ' is a required field.')
        return false;
    }
    return true;
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

    checkField(field: JQuery, value: string, name: string, errors: string[]): void {
        if (checkRequired(value, name, errors)) {
            if (value.split(' ').length != 1) {
                errors.push(name + ' should only be one word');
                field.addClass('invalid');
            } else {
                field.removeClass('invalid');
            }
        } else {
            field.addClass('invalid');
        }
    }

    check(errors: string[]): void {
        this.checkField(this._firstName, this.firstName, 'First name', errors);
        if (this.middleName != '') {
            this.checkField(this._middleName, this.middleName, 'Middle name', errors);
        }
        this.checkField(this._lastName, this.lastName, 'Last name', errors);
    }
}

class Address {
    _street: JQuery;
    _city: JQuery;
    _state: JQuery;
    _zipcode: JQuery;

    constructor(obj: JQuery) {
        this._street = obj.find('input[name=street]').assertOne();
        this._city = obj.find('input[name=city]').assertOne();
        this._state = obj.find('select[name=state]').assertOne();
        this._zipcode = obj.find('input[name=zip-code]').assertOne();
    }

    get address(): string {
        return capitalize_words(this._street.val()) + ', ' + capitalize_words(this._city.val())
            + ', ' + this._state.val() + ', ' + this._zipcode.val();
    }

    check(errors: string[]): void {
    }
}

class Email {
    _email: JQuery;

    constructor(obj: JQuery) {
        this._email = obj.find('input[name=email]').assertOne();
    }

    get email(): string {
        return this._email.val();
    }

    check(errors: string[]): void {
    }
}

class PhoneNumber {
    _number: JQuery;

    constructor(obj: JQuery) {
        this._number = obj.find('input[name=phone-number]').assertOne();
    }

    get phoneNumber(): string {
        return this._number.val();
    }

    check(errors: string[]): void {
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
    _gender: JQuery;

    constructor(obj: JQuery) {
        // This is just here for the assertion
        obj.find('input[name=gender]').assertSize(2);

        this._gender = obj.find('input[name=gender]:checked');
    }

    get gender(): string {
        return this._gender.val();
    }
}

class Student {
    private _name: FullName;
    private _classSelector: JQuery;
    private _birthday: Date_;
    private _gender: Gender;

    constructor(obj: JQuery) {
        this._name = new FullName(obj.find('.full-name').assertOne());
        this._classSelector = obj.find('.class-selector').assertOne();
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

    check(errors: string[]): void {
    }
}
