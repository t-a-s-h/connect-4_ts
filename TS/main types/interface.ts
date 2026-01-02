import { Subscriber } from "./connect_4";

export interface Interface extends Subscriber {
    type : 'GUI' | 'CLI';
    write(text: string, add? : boolean) : void;
    getInput(prompt: string) : any;
    prompt(test: string, options?: string[]) : Promise<any>;
    clear(): void;
}