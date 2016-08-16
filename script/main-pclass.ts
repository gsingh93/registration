/// <reference path="common.ts"/>

class PclassApp extends App {
    constructor(app_id: string, api_key: string) {
        super('https://api.parse.com/1/classes/Student', app_id, api_key);
    }

    protected get_json_data(student: Student, jsonData: Object): void {
        jsonData['class'] = student.className;
        jsonData['birthday'] = student.birthday;
    }

    protected create_registrant(id: number): Registrant {
        return new Student($('#student-' + id).assertOne());
    }

    protected get_id(): string {
        return 'student';
    }
}

$(function() {
    new PclassApp('Ok0XAGbx2gAEkRKbgMCb4PJ1GDrmWco7bTzuvXZQ', 'kl750bfRK2bF7fHKpmvEwhV9nePqXi81Ad4At8Xp');
});
