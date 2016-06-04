/// <reference path="common.ts"/>

function get_json_data(student, jsonData): void {
    jsonData['class'] = student.className;
    jsonData['birthday'] = student.birthday;
}

$(function() {
    new App('student', 'https://api.parse.com/1/classes/Student', 'Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ', 'kl750bfRK2bF7fHKpmvEwhV9nePqXi81Ad4At8Xp', get_json_data);
});
