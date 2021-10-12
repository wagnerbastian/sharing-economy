"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var fs = require("fs");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.system = function (data) {
        console.log('- ' + data);
    };
    Logger.prototype.logStep = function (step) {
        if (step === 1) {
            console.log('');
            process.stdout.write("Calculating steps:.");
        }
        if (step % 10 === 0) {
            process.stdout.write(".");
        }
        if (step % 100 === 0) {
            process.stdout.write("" + step);
        }
    };
    Logger.prototype.writeFile = function (data) {
        fs.writeFile("run.json", JSON.stringify(data), function () { });
    };
    return Logger;
}());
exports.Logger = Logger;
