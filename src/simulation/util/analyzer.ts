import * as data from '../../config.json';
import {
    Config,
    PopulationInfo,
    Strategy,
    StrategyDistribution
} from '../module';

export class Analyzer {
    config = (data as any).default as Config;


    analyzeRun(info: PopulationInfo): void {
        
        const finalDistribution = this.getDistributionAnalysis(info);
        console.log(finalDistribution);
        
    }

    /**
     * Gibt den Durchschnitt der Strategieverteile über alle Wiederholungen zurück. Der Prozentsatz is in der Config definiert.
     * @param info Populationinfo
     * @returns Analysierte Finale Verteilung der Strategie
     */
    private getDistributionAnalysis(info: PopulationInfo): StrategyDistribution {
        const distributions: StrategyDistribution[] = [];


        info.strategyDistribution.forEach(rep => {
            const distribution: StrategyDistribution = {
                tc: 0,
                tp: 0,
                uc: 0,
                up: 0
            };

            let index = Math.floor((1 - this.config.analysis.analyseLastPercentage) * rep.distributions.length);
            let counter = 0;
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

        const distribution: StrategyDistribution = {
            tc: 0,
            tp: 0,
            uc: 0,
            up: 0
        };

        let counter = 0;
        for (let index = 0; index < distributions.length; index++) {
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
    }

}