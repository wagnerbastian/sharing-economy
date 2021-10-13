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
exports.Analyzer = void 0;
var data = __importStar(require("../../config.json"));
var Analyzer = /** @class */ (function () {
    function Analyzer() {
        this.config = data.default;
    }
    Analyzer.prototype.analyzeRun = function (info) {
        var finalDistribution = this.getDistributionAnalysis(info);
        console.log(finalDistribution);
    };
    /**
     * Gibt den Durchschnitt der Strategieverteile über alle Wiederholungen zurück. Der Prozentsatz is in der Config definiert.
     * @param info Populationinfo
     * @returns Analysierte Finale Verteilung der Strategie
     */
    Analyzer.prototype.getDistributionAnalysis = function (info) {
        var _this = this;
        var distributions = [];
        info.strategyDistribution.forEach(function (rep) {
            var distribution = {
                tc: 0,
                tp: 0,
                uc: 0,
                up: 0
            };
            var index = Math.floor((1 - _this.config.analysis.analyseLastPercentage) * rep.distributions.length);
            var counter = 0;
            for (index; index < rep.distributions.length; index++) {
                counter++;
                distribution.tc += rep.distributions[index].tc;
                distribution.tp += rep.distributions[index].tp;
                distribution.uc += rep.distributions[index].uc;
                distribution.up += rep.distributions[index].up;
            }
            distribution.tc = distribution.tc / counter;
            distribution.tp = distribution.tp / counter;
            distribution.uc = distribution.uc / counter;
            distribution.up = distribution.up / counter;
            distributions.push(distribution);
        });
        var distribution = {
            tc: 0,
            tp: 0,
            uc: 0,
            up: 0
        };
        var counter = 0;
        for (var index = 0; index < distributions.length; index++) {
            counter++;
            distribution.tc += distributions[index].tc;
            distribution.tp += distributions[index].tp;
            distribution.uc += distributions[index].uc;
            distribution.up += distributions[index].up;
        }
        distribution.tc = distribution.tc / counter;
        distribution.tp = distribution.tp / counter;
        distribution.uc = distribution.uc / counter;
        distribution.up = distribution.up / counter;
        return distribution;
    };
    return Analyzer;
}());
exports.Analyzer = Analyzer;
