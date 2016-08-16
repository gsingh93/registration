/// <reference path="common.ts"/>

class CampApp extends App {
    constructor(app_id: string, api_key: string) {
        super('https://api.parse.com/1/classes/Camper', app_id, api_key);
    }

    protected get_json_data(camper: Camper, jsonData: Object): void {
        jsonData['tshirt'] = camper.tShirt;
        jsonData['age'] = camper.age;

        jsonData['skills'] = camper.skills;

        var seva = $('#seva').find('input:checkbox:checked + span').toArray();
        seva = seva.map((x) => $(x).text());
        jsonData['seva'] = seva.join(', ');
    }

    protected create_registrant(id: number): Registrant {
        return new Camper($('#camper-' + id).assertOne());
    }

    protected get_id(): string {
        return 'camper';
    }
}

$(function() {
    new CampApp('FbjjHNuoHVX3uFDdR8DORpLkEUSRfKlBNdVNS3CW', 'LaxlJiBcl5syLBNv0pdKlJSLdogODutKLnSHOuNH');
});
