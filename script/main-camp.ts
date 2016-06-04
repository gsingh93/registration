/// <reference path="common.ts"/>

function get_json_data(camper, jsonData): void {
    jsonData['tshirt'] = camper.tShirt;
    jsonData['age'] = camper.age;

    // TODO: Get and check langar seva, and skills
}

$(function() {
    new App('camper', 'https://api.parse.com/1/classes/Camper', 'FbjjHNuoHVX3uFDdR8DORpLkEUSRfKlBNdVNS3CW', 'LaxlJiBcl5syLBNv0pdKlJSLdogODutKLnSHOuNH', get_json_data);
});
