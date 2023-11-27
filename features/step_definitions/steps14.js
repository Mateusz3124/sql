const { Given, When, Then } = require('@cucumber/cucumber')
const sqljs = require('../../sql.js')
const commonSteps = require('./commonSteps.js');
const INDEX_DB_NAME = "mytest";
var newuser;
var error;

Given('a invalid user too long surname and correct name', function () {
    name = "ala"
    surname = "a";
    for (i = 0; i < 255; i++) {
        surname = surname + "a";    }
    
    newuser = new sqljs.DBUser(name, surname);
});

commonSteps['I have a database'];

When('I am trying to add the user with this information to the database', async function () {
    try {
        await sqljs.index_create_user(newuser, INDEX_DB_NAME);
    } catch (err) {
        error = err.message;
    }
});

Then('database should return error that surname is too long', async function () {
    if (!error.includes("Data too long")) {
        throw new Error("Expected failure due to too long data, but got: " + error);
    }
    await sqljs.workOnDataBase("DROP DATABASE IF EXISTS mytest");
});

