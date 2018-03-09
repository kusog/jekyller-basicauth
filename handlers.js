'use strict';
const secrets = require('./secrets');
const uuid = require('uuid/v4');
var users = null;
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type":"application/json"
    };

module.exports.login = (event, context, callback) => {
    function checkLogin() {
        var userId = event.userId,
            pwd = event.pwd;

        if(!userId && event.body) {
            var msg = (typeof event.body == "string") ? JSON.parse(event.body) : event.body;
            userId = msg.userId;
            pwd = msg.pwd;
        }            

        var user = users[userId],
            msg = null;

        console.log("user:" + userId + " pwd:" + pwd);
        console.log("users found: " + (users ? "yes":"no"));
        console.log("user is" + (user ? "found":"not found"));
        if(user && user.pwd == pwd) {
            console.log("found match");
            if(user.status === 0) {
                callback(null, {statusCode: 403, headers: headers });
            }
            else {
                secrets.createToken(user).then(function(token) {
                    msg = {
                        userId: user.userId,
                        token: token,
                        displayName: user.displayName,
                        role: user.role
                    };
                    const response = {
                        statusCode: 200,
                        headers: headers,
                        body: JSON.stringify(msg),
                    };
                    callback(null, response);
                });
            }
        }
        else {
            callback(null, {statusCode: 404, headers: headers });
        }
    }

    if(users) {
        checkLogin();
    }
    else {
        secrets.getSecrets("userbase.txt").then((configUsers) => {
            users = configUsers.users;
            checkLogin();
        });
    }
};

module.exports.verifyToken = (event, context, callback) => {
    function verify() {
        var token = event.headers.jktoken;
        console.log("token:" + token);
        var isValid = false;

        secrets.inspectToken(token).then(function(rawToken) {
            if(users && users[rawToken.userId]) {
                isValid = true;
            }

            const response = {
                statusCode: isValid?200:404,
                headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type":"application/json"
                },
                body: "",
            };

            callback(null, response);        
        });
    }

    if(users) {
        verify();
    }
    else {
        secrets.getSecrets("userbase.txt").then((configUsers) => {
            users = configUsers.users;
            verify();
        });
    }
};