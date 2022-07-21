"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importDefault(require(".."));
__1.default.initialize({
    appName: "vpn-test",
});
function main() {
    console.log("Testing VPN Support enabled");
    __1.default.getInstance()
        .getServerUrl("service-we-stream")
        .then(function (url) {
        console.log("We Stream server URL : ", url);
    })
        .catch(function (e) {
        console.log("This should never get printed");
        console.error("Error while service discovery for we stream: ", e);
    });
    __1.default.getInstance()
        .getServerUrl("service-third-party")
        .then(function (url) {
        console.log("Service third party server URL : ", url);
    })
        .catch(function (e) {
        console.log("This should never get printed");
        console.error("Error while service discovery for third party: ", e);
    });
}
console.time("VPN_TEST");
main();
console.timeEnd("VPN_TEST");
