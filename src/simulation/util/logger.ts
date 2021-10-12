const fs = require("fs");
export class Logger {

    system(data: string): void {
        console.log('- ' + data);
    }


    logStep(step: number): void {
        if (step === 1) {
            console.log('');
            process.stdout.write(`Calculating steps:.`);
        }

        if (step % 10 === 0) {
            process.stdout.write(`.`);
        }

        if (step % 100 === 0) {
            process.stdout.write(`${step}`);
        }
    }

    writeFile(data: any): void {
        fs.writeFile("run.json", JSON.stringify(data), function(){})
    }
}