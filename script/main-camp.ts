/// <reference path="common.ts"/>

function get_json_data(camper, jsonData): void {
    jsonData['tshirt'] = camper.tShirt;
    jsonData['age'] = camper.age;

    jsonData['skills'] = camper.skills;

    var seva = $('#seva').find('input:checkbox:checked + span').toArray();
    seva = seva.map((x) => $(x).text());
    jsonData['seva'] = seva.join(', ');
}

$(function() {
    new App('camper', 'https://api.parse.com/1/classes/Camper', 'FbjjHNuoHVX3uFDdR8DORpLkEUSRfKlBNdVNS3CW', 'LaxlJiBcl5syLBNv0pdKlJSLdogODutKLnSHOuNH', get_json_data);
});
