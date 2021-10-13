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
        else if (step < 10) {
            process.stdout.write(".");
        }
        else if (step === 10) {
            process.stdout.write("" + step);
        }
        else if (step < 30 && step % 2 === 0) {
            process.stdout.write(".");
        }
        else if (step === 30) {
            process.stdout.write("" + step);
        }
        else if (step === 50) {
            process.stdout.write("" + step);
        }
        else if (step % 100 === 0) {
            process.stdout.write("" + step);
        }
        else if (step % 10 === 0) {
            process.stdout.write(".");
        }
    };
    Logger.prototype.writeFile = function (data) {
        fs.writeFile("run.json", JSON.stringify(data), function () { });
        var result = JSON.parse(JSON.stringify(data));
        result.strategyDistribution = [];
        fs.writeFile("result.json", JSON.stringify(result), function () { });
    };
    return Logger;
}());
exports.Logger = Logger;
