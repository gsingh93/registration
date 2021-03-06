#!/usr/bin/env python2

import unittest
from lib import *

class TestPclass(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Chrome()

    @classmethod
    def tearDownClass(self):
        self.driver.quit()

    def test_success(self):
        form = PclassForm(URL, self.driver)

        form.set_student(0, ('gulshan2', 'singh'), 'Grade 1', ('May', '21', '1993'), 'male')

        form.set_fathers_name(['father1', 'father2'])
        form.set_mothers_name(['mother1', 'mother2'])

        form.set_address(('street street', 'city city', 'MI', '11111'))

        form.set_primary_email(('a@a.com', 'a@a.com'))
        form.set_home_phone_number('333-333-3333')

        form.submit()

        try:
            WebDriverWait(self.driver, 3).until(EC.title_is('Success'))
        except Exception as e:
            raw_input() # pause
            raise e


@unittest.skip("Skipping camp test")
class TestCamp(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Chrome()

    @classmethod
    def tearDownClass(self):
        self.driver.quit()

    def test_success(self):
        form = CampForm(URL, self.driver)

        form.set_camper(0, ('gulshan', 'singh'), '9', 'Youth Small', 'male')

        form.set_fathers_name(['father1', 'father2'])
        form.set_mothers_name(['mother1', 'mother2'])

        form.set_address(('street street', 'city city', 'MI', '11111'))

        form.set_primary_email(('a@a.com', 'a@a.com'))
        form.set_cell_phone_number('222-222-2222')
        form.set_home_phone_number('333-333-3333')

        form.submit()

        WebDriverWait(self.driver, 10).until(EC.title_is('Success'))


if __name__ == '__main__':
    unittest.main()
