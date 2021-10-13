const fs = require("fs");
export class Logger {

    system(data: string): void {
        console.log('- ' + data);
    }


    logStep(step: number): void {
        if (step === 1) {
            console.log('');
            process.stdout.write(`Calculating steps:.`);
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
        fs.writeFile("run.json", JSON.stringify(data), function(){})

        const result = JSON.parse(JSON.stringify(data));
        result.strategyDistribution = [];
        fs.writeFile("result.json", JSON.stringify(result), function(){})

    }

    write(data: any, name: string): void {
        fs.writeFile(name, JSON.stringify(data), function(){})
    }
}
