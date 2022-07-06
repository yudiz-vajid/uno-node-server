"use strict";
function sayHello2(call, callback) {
    callback(null, { message: "Hello Service 2: " + call.request.name });
}
module.exports = {
    sayHello: sayHello2,
};
