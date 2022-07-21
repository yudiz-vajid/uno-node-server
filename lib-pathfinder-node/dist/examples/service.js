"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PFServer_1 = __importDefault(require("../grpc/PFServer"));
var path_1 = __importDefault(require("path"));
var index_1 = __importDefault(require("../index"));
function main() {
    index_1.default.initialize({
        appName: "service-dashboard",
        protosToLoad: [
            {
                name: "service-1",
                path: __dirname + "../../protos/HelloService.proto",
            },
            {
                name: "service-1",
                path: __dirname + "../../protos/GreeterService.proto",
            },
            {
                name: "service-third-party",
                path: __dirname + "../../protos/HelloService.proto",
            },
        ],
    });
    var server = new PFServer_1.default("service-1", 50051);
    server
        .addService(__dirname + "../../protos/HelloService.proto", path_1.default.join(__dirname, "methods.js"))
        .addService(__dirname + "../../protos/GreeterService.proto", path_1.default.join(__dirname, "methods.js"))
        .start();
    var server2 = new PFServer_1.default("service-third-party", 50052);
    server2
        .addService(__dirname + "../../protos/HelloService.proto", path_1.default.join(__dirname, "methods2.js"))
        .start();
}
main();
