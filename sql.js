var mysql = require('mysql2/promise');

// Stworzona baza danych
async function workOnDataBase(sql) {
    var connection = await mysql.createConnection({
        host: "localhost",
        user: "root",  // wpisz własne
        password: "rooter",   // wpisz własne
    });

    try {
        var result = await connection.query(sql);
        return result
    } finally {
        await connection.end();
    }
}

// funkcja do wysyłania żądan do bazy danych
async function action(sql, data, query_values) {
    var connection = await mysql.createConnection({
        host: "localhost",
        user: "root",   //wpisz własne
        password: "rooter",    //wpisz własne na zmiane hasła w sql: ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
        database: data
    });

    try {
        var result = await connection.query(sql, query_values);
        return result;
    } finally {
        await connection.end();
    }
}

// Dodane na potrzeby index.js
class DBUser {
    constructor(name, surname) { 
        // if(name == null || surname == null) { throw new Error("Name and surname cannot be nulls."); }
        if(typeof name !== 'string' || typeof surname !== 'string') { throw new Error("Name and surname must be of string types."); }
        if(name.length === 0 || surname.length === 0) { throw new Error("Name and surname must be at least 1 character long."); }
        this.name = name;
        this.surname = surname;
    }
}

async function index_create_db(name) {
    try {
        await workOnDataBase(`CREATE DATABASE IF NOT EXISTS ${name}`);
        await action("CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), surname VARCHAR(255))", name);
    } catch (err) {
        console.error(err);
    }
}

async function index_get_user(user, name) {
    if(!(user instanceof DBUser)) { throw new Error("User parameter must be of type DBUser."); }
    
    const [rows] = await action(
        'SELECT * FROM `users` WHERE `name` = ? AND `surname` = ?', 
        name,
        [user.name, user.surname]);

    return rows;
}

async function index_get_all_users(name) {
   const [rows] = await action(
        'SELECT * FROM `users`', name
   ) 
   return rows
}

async function index_create(user, name) {
    if(!(user instanceof DBUser)) { throw new Error("User parameter must be of type DBUser."); }
    
    const [result] = await action(
        'INSERT INTO `users` (`name`, `surname`) VALUES (?, ?)', 
        name,
        [user.name, user.surname]);

    return result;
}

async function index_delete(user, name) {
    if(!(user instanceof DBUser)) { throw new Error("User parameter must be of type DBUser."); }
    
    const [result] = await action(
        'DELETE FROM users WHERE `name` = ? AND `surname` = ?', 
        name,
        [user.name, user.surname]);

    return result;
}

async function index_update(user, userChanged, name) {
    if(!(user instanceof DBUser)) { throw new Error("User parameter must be of type DBUser."); }
    
    const [result] = await action(
        'UPDATE users SET `name` = ?, `surname` = ? WHERE `name` = ? AND `surname` = ?',
        name,
        [userChanged.name, userChanged.surname, user.name, user.surname]);
    return result;
}

// Dodane na potrzeby index.js

module.exports = {
    workOnDataBase,
    action,

    //Dodane na potrzeby index.js
    index_update, index_delete, index_create_db, index_get_user, index_get_all_users, index_create, DBUser
};

