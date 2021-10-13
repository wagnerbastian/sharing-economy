"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var fs = require("fs");
var data = __importStar(require("../../config.json"));
var Logger = /** @class */ (function () {
    function Logger() {
        this.config = data.default;
    }
    Logger.prototype.system = function (data) {
        console.log(new Date().toISOString() + ' - ' + data);
    };
    Logger.prototype.logStep = function (step) {
        if (step === 1) {
            console.log('');
            process.stdout.write(new Date().toISOString() + ": Calculating steps:.");
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
        fs.writeFile(this.config.simulationData.name + "-run.json", JSON.stringify(data), function () { });
        var result = JSON.parse(JSON.stringify(data));
        result.strategyDistribution = [];
        fs.writeFile(this.config.simulationData.name + "-result.json", JSON.stringify(result), function () { });
    };
    Logger.prototype.write = function (data, name) {
        fs.writeFile(name, JSON.stringify(data), function () { });
    };
    Logger.prototype.inline = function (data) {
        process.stdout.write(data);
    };
    return Logger;
}());
exports.Logger = Logger;
