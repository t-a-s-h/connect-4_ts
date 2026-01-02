import { isInteger } from "./connect_4.js";
import { Grid } from "./grid.js";
import { Interface } from "./interface.js";
import { stdout as output, stdin as input } from "node:process";
import readline from "node:readline";

let rl = readline.createInterface({
    output, input
})

function col_enter(text : string) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
        rl.question(text,
            async (answer) => {
                if (! answer.length || typeof answer !== "string") {
                    reject("Please enter a valid entry.")
                }
                else if (isInteger(answer)) resolve(answer)
                else resolve(answer[0].toUpperCase());
                rl.pause();
        })
    })
}

export class Display implements Interface {

    constructor() {
        this.type = 'CLI';
    }

    clear() {
        
    }

    async prompt(text: string) {
        return new Promise( resolve => text);
    }

    write(text: string, add : boolean = false) : void {
        output.write(text);
    }

    async getInput(text : string) : Promise<string> {
        while (true) {
            try {
                return await col_enter(text);
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    update(g: Grid): void {
        g.print();
    }

    type: "GUI" | "CLI";
}