const {Given, When, Then} = require('@cucumber/cucumber')
const sqljs = require('../.././sql.js')
const commonSteps = require('./commonSteps.js');
var INDEX_DB_NAME = "nonExistingDB"
var newuser;
var error;

Given('I have created a user with Name {string} and Surname {string}', function (name, surname) {
    newuser = new sqljs.DBUser(name, surname);
});

commonSteps['I don\'t have a database'];

When('I am trying to add the user to the database', async function () {
    try {
        await sqljs.index_create_user(newuser, INDEX_DB_NAME);
    } catch (err) {
        console.log(INDEX_DB_NAME);
        error = err.message;
    } 
});

Then('the user addition operation should fail', function () {
    if (!error.includes("Unknown database")) {
        throw new Error("Expected failure due to non-existent database, but got: " + error);
    } 
});

