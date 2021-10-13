const fs = require("fs");
import * as data from '../../config.json';
import { Config } from '../module';


export class Logger {
    config = (data as any).default as Config;

    system(data: string): void {
        console.log(new Date().toISOString() + ' - ' + data);
    }


    logStep(step: number): void {
        if (step === 1) {
            console.log('');
            process.stdout.write(`${new Date().toISOString()}: Calculating steps:.`);
        } else if (step < 10) {
            process.stdout.write(`.`);
        } else if (step === 10) {
            process.stdout.write(`${step}`);
        } else if (step < 30 && step % 2 === 0) {
            process.stdout.write(`.`);
        } else if (step === 30) {
            process.stdout.write(`${step}`);
        } else if (step === 50) {
            process.stdout.write(`${step}`);
        } else if (step % 100 === 0) {
            process.stdout.write(`${step}`);
        } else if (step % 10 === 0) {
            process.stdout.write(`.`);
        }
        
        

        
    }

    writeFile(data: any): void {
        fs.writeFile(this.config.simulationData.name + "-run.json", JSON.stringify(data), function(){})

        const result = JSON.parse(JSON.stringify(data));
        result.strategyDistribution = [];
        fs.writeFile(this.config.simulationData.name + "-result.json", JSON.stringify(result), function(){})

    }

    write(data: any, name: string): void {
        fs.writeFile(name, JSON.stringify(data), function(){})
    }

    inline(data: string): void {
        process.stdout.write(data);
    }
}
