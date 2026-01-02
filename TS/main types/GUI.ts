import { PathType, Segment } from "./connect_4.js";
import { Grid } from "./grid.js"
import { Interface } from "./interface.js";

// on click, get clicked column id
function getClickedCol(e : MouseEvent) : string | null {
    let clicked : HTMLElement | null = e.target as HTMLElement
    let col = clicked.closest(".col");
    if (col) return col.id.match(/[0-6]/)?.[0]?? null;
    return null
}

function col_click(element : HTMLElement) : Promise<string> {
    return new Promise(function(resolve,reject) {
        if (! element) reject;
        let s = null;
        element.addEventListener('click',(e)=> {
            s = getClickedCol(e); 
            if (s) resolve(s); 
            else {
                reject('Please click on a column.')
            }
        })
    });
}

function colourWin(segment : Segment) : void {
    let length = segment.getLength();
    let [x,y] = [segment.getX(), segment.getY()];
    const Ds = {
        'V'   : [0,1],
        'Ddn' : [-1,1],
        'H'   : [1,0],
        'Dup' : [1,1]
    }
    let [dx,dy] = Ds[segment.getType()];
    while (length) {
        let div : HTMLElement = document.querySelector(`div.col-${x}.row-${y}`);
        div.classList.add('winning_square')
        x -= dx; y -= dy;
        --length;
    }
}

export class GUI implements Interface {
    constructor() {
        this.type = 'GUI';
        const display = document.body.querySelector('#game') as HTMLElement;
        this.shadowGUI = new DocumentFragment
        this.theGUI = display;
    }

    replaceText(text: string, original: string | RegExp, replacement: string) : string {
        text = text.replaceAll(original,replacement);
        return text;
    }

    write(text: string, add : boolean = false) : void {    
        const newSquareX = document.createElement('div');
        newSquareX.classList.add("isX")
        const newSquareO = document.createElement('div');
        text = this.replaceText(text,"X",newSquareX.outerHTML);
        text = this.replaceText(text,"O",newSquareO.outerHTML)   
        let prompt : HTMLElement | null = document.querySelector("#prompt");
        if (prompt) add ? prompt.insertAdjacentHTML("afterbegin",`<div>${text}</div>`) :
            prompt.innerHTML = `<div>${text}</div>`;
    }

    async prompt(text: string, options : string[] = ["Yes","No"]) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            let prompt = document.createElement('div');
            let prompt_btn = document.createElement('button');
            prompt.id = "modal";
            prompt_btn.textContent = text
            prompt.append(prompt_btn);
            let answer = false;
            prompt_btn.onclick = () => {
                answer = true;
                prompt.parentElement.removeChild(prompt);
                resolve(answer);
            }
            prompt.append(prompt_btn);
            document.body.append(prompt)
        })
    }

    clear() : void {
        this.theGUI.querySelectorAll('div').forEach(div => div.innerHTML = '')
    } 

    async getInput(text: string) : Promise<string> {
        this.write(text, true);
        if (! this.theGUI) return 'Q';
        while (true) {
            try {
                return await col_click(this.theGUI);
            }
            catch(e) {
                console.log(e);
            }
        }
    }
    // GUI is updated with Grid's information
    // and rendered
    update(g: Grid): void { 
        if (! this.theGUI || ! g.hasIntf()) return;
        const s = g.getRecentSquare();
        if (! s) return;
        const col = this.theGUI.querySelector(`#col-${s.getCol()}`);
        const newSquare = document.createElement('div');
        newSquare.classList.add(`col-${s.getCol()}`, `row-${s.getRow()}`)
        if (s.getMark() === "X") newSquare.classList.add("isX")
        if (col) col.append(newSquare)
        if (s.winningSegment) {
            colourWin(s.winningSegment)
        }
    }

    type: "GUI" | "CLI";
    theGUI : HTMLElement | null;
    shadowGUI : DocumentFragment;
}