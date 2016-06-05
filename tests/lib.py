from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


URL = 'file:///Users/gulshan/code/registration/public/index.html#test'


def assertOne(elts):
    assert len(elts) == 1
    return elts[0]


def assertOneOrLess(elts):
    if len(elts) == 1:
        return elts[0]
    else:
        assert len(elts) == 0
        return None


class FullName:
    def __init__(self, elt):
        self.firstName = assertOne(elt.find_elements_by_css_selector('input[name=first-name]'))
        self.middleName = assertOneOrLess(
            elt.find_elements_by_css_selector('input[name=middle-name]'))
        self.lastName = assertOne(elt.find_elements_by_css_selector('input[name=last-name]'))

    def set_name(self, names):
        self.set_first_name(names[0])
        if len(names) == 2:
            self.set_last_name(names[1])
        else:
            assert len(names) == 3
            self.set_middle_name(names[1])
            self.set_last_name(names[2])

    def set_first_name(self, name):
        self.firstName.send_keys(name)

    def set_middle_name(self, name):
        self.middleName.send_keys(name)

    def set_last_name(self, name):
        self.lastName.send_keys(name)


class Address:
    def __init__(self, elt):
        self.street = assertOne(elt.find_elements_by_css_selector('input[name=street]'))
        self.city = assertOne(elt.find_elements_by_css_selector('input[name=city]'))
        self.state = Select(assertOne(elt.find_elements_by_css_selector('select[name=state]')))
        self.zipcode = assertOne(elt.find_elements_by_css_selector('input[name=zip-code]'))


class Email:
    def __init__(self, elt):
        self.email = assertOne(elt.find_elements_by_css_selector('input[name=email]'))
        self.confirm = assertOne(elt.find_elements_by_css_selector('input[name=confirm-email]'))


class PhoneNumber:
    def __init__(self, elt, type):
        self.number = assertOne(elt.find_elements_by_css_selector('input[name=%s-phone-number]' % type))


class Gender:
    def __init__(self, elt):
        self.male = assertOne(elt.find_elements_by_css_selector('input[value=male]'))
        self.female = assertOne(elt.find_elements_by_css_selector('input[value=female]'))

    def set_male(self):
        self.male.click()

    def set_female(self):
        self.female.click()


class Date:
    def __init__(self, elt):
        self.day = Select(assertOne(elt.find_elements_by_class_name('day')))
        self.month = Select(assertOne(elt.find_elements_by_class_name('month')))
        self.year = Select(assertOne(elt.find_elements_by_class_name('year')))

    def set_date(self, date):
        assert len(date) == 3
        self.month.select_by_value(date[0])
        self.day.select_by_value(date[1])
        self.year.select_by_value(date[2])


class Student:
    def __init__(self, elt):
        self.name = FullName(assertOne(elt.find_elements_by_class_name('full-name')))
        self.birthday = Date(assertOne(elt.find_elements_by_class_name('date')))
        self.gender = Gender(assertOne(elt.find_elements_by_class_name('gender')))
        self.grade = Select(assertOne(elt.find_elements_by_css_selector('select[name=class]')))


class Camper:
    def __init__(self, elt):
        self.name = FullName(assertOne(elt.find_elements_by_class_name('full-name')))
        self.gender = Gender(assertOne(elt.find_elements_by_class_name('gender')))
        self.tshirt = Select(assertOne(elt.find_elements_by_css_selector('select[name=tshirt]')))
        self.age = Select(assertOne(elt.find_elements_by_css_selector('select[name=age]')))
        # TODO: Skills


class Form:
    def __init__(self, url, driver):
        driver.get(url)

        self.num_entries = Select(driver.find_element_by_id('numentries'))
        form = driver.find_element_by_id('form')
        assert not form.is_displayed()

        self.set_num_entries(1)

        WebDriverWait(driver, 10).until(EC.visibility_of(form))

        assert form.is_displayed()
        self.fathers_name = FullName(assertOne(form.find_elements_by_id('father-name')))
        self.mothers_name = FullName(assertOne(form.find_elements_by_id('mother-name')))
        self.address = Address(assertOne(form.find_elements_by_class_name('address')))
        self.primary_email = Email(assertOne(form.find_elements_by_id('primary-email')))
        self.secondary_email = Email(assertOne(form.find_elements_by_id('secondary-email')))
        self.cell_phone_number = PhoneNumber(form.find_elements_by_class_name('phone-number')[0], 'Cell')
        self.home_phone_number = PhoneNumber(form.find_elements_by_class_name('phone-number')[1], 'Home')

        self.students = []
        for i in range(1, 5):
            #self.students.append(Student(assertOne(form.find_elements_by_id('student-' + str(i)))))
            self.students.append(Camper(assertOne(form.find_elements_by_id('camper-' + str(i)))))

        self._submit = form.find_element_by_id('submit')

    def set_fathers_name(self, name):
        self.fathers_name.set_name(name)

    def set_mothers_name(self, name):
        self.mothers_name.set_name(name)

    def set_address(self, address):
        assert len(address) == 4
        self.address.street.send_keys(address[0])
        self.address.city.send_keys(address[1])
        self.address.state.select_by_value(address[2])
        self.address.zipcode.send_keys(address[3])

    def set_email(self, elt, emails):
        assert len(emails) == 2
        elt.email.send_keys(emails[0])
        elt.confirm.send_keys(emails[1])

    def set_primary_email(self, emails):
        self.set_email(self.primary_email, emails)

    def set_secondary_email(self, emails):
        self.set_email(self.secondary_email, emails)

    def set_cell_phone_number(self, number):
        self.cell_phone_number.number.send_keys(number)

    def set_home_phone_number(self, number):
        self.home_phone_number.number.send_keys(number)

    def set_student(self, index, name, grade, birthday, gender):
        student = self.students[index]
        student.name.set_name(name)
        student.grade.select_by_value(grade)
        student.birthday.set_date(birthday)
        if gender == 'male':
            student.gender.set_male()
        else:
            assert gender == 'female'
            student.gender.set_female()

    def set_camper(self, index, name, age, tshirt, gender):
        student = self.students[index]
        student.name.set_name(name)
        student.age.select_by_value(age)
        student.tshirt.select_by_value(tshirt)
        if gender == 'male':
            student.gender.set_male()
        else:
            assert gender == 'female'
            student.gender.set_female()

    def set_num_entries(self, num):
        assert num >= 0 and num <= 4
        self.num_entries.select_by_visible_text(str(num));

    def submit(self):
        self._submit.click()
