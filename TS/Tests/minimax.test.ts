import { Display } from "../main types/CLI.js";
import { Grid } from "../main types/grid.js";
import { minimax } from "../minimax/mm.js";

// testing minimax against itself.

let str = "";

let str2 = "";

// const default_o = 4;

const start = 7;
const end = 7;

for (let i = start; i <= end; ++i) {
    let xwin = 0;
    let owin = 0;
    let draw = 0;

    for (let j = 4; j <= 4; ++j) {
        let movesX = [];
        let movesO = [];
        let g = new Grid(new Display);
        let isX = false;
        while (!g.isGameOver()) {
            console.log(`depth ${i} vs. depth ${j}`)
            isX = !isX;
            if (isX) {
                let { move,value } = minimax(g,i,isX);
                g.setSquare(move,true);
                console.log( move, value )
                movesX.push(move)
            } else {
                let { move,value } = minimax(g,j,isX);
                g.setSquare(move,true);
                console.log( move, value ) 
                movesO.push(move)  
            }
        }
        str += `depth ${i} as x vs depth ${j} as o: ${g.getWinner() !== ' ' ? `${g.getWinner()} wins!\n` : 'draw.\n'}`
        console.table([movesX,movesO])

        switch (g.getWinner()) {
            case 'X': 
                ++xwin;
                console.log("X wins");
                break;
            case 'O': 
                ++owin;
                console.log("O wins");
                break;
            default:
                ++draw
                console.log("draw");
                break;     
        }
    }
    str2 += `depth:  ${i}: ${xwin}, ${owin}, ${draw}\n`
}
console.log(str2);
console.log(str);