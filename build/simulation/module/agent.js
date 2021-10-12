"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var Agent = /** @class */ (function () {
    function Agent(id) {
        this.id = id;
        this.wealth = 0;
        this.payoffHistory = [];
        this.didTradeInThisStep = false;
    }
    return Agent;
}());
exports.Agent = Agent;
