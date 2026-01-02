import { isInteger } from "./connect_4.js";
import { Grid } from "./grid.js";
import { ANNOUNCE_TURN, ANNOUNCE_WIN, CMD_INVALID, 
    DRAW, GAME_END, GET_INPUT, GET_INPUT_GUI, 
    MOVE_INVALID, START_GAME } 
    from "./text_constants.js"
import { Interface } from "./interface.js";
import { minimax } from "../minimax/mm.js";

export async function run(intf: Interface) {

    intf.write(START_GAME);
    let g = new Grid(intf);
    g.print();
    let play_over = false;
    while (! play_over) {

        while(!g.isGameOver()) { 
            if (g.getXTurn()) {
                intf.write(intf.type === 'CLI' ? GET_INPUT : GET_INPUT_GUI);
                let s : string = await intf.getInput(ANNOUNCE_TURN(g.getXTurn()));
                let n = parseInt(s);
                if (isInteger(Number(n)) && g.isInRange(Number(n))) {
                    g.setSquare(n);
                } else if (isInteger(n)) {
                    intf.write(MOVE_INVALID);
                } else {
                    switch(s) {
                        case 'Q':
                            g.setGameOver();
                            intf.write(GAME_END);
                            break;
                        default: intf.write(CMD_INVALID)
                    }
                }
            }
            else {
                let { value,move } = minimax(g,4,false);
                intf.write(ANNOUNCE_TURN(g.getXTurn()))

                // wait 0.5 seconds before play
                await (async () => {
                    return new Promise((resolve)=> {
                        setTimeout(resolve,500)
                    })
                })();

                g.setSquare(move);
            }
        }


        let m = g.getWinner();
        if (m !== " ") {
            intf.write(ANNOUNCE_WIN(m))
        }
        if (g.isDraw()) {
            intf.write(DRAW);
        }

        if (intf.type === "GUI") {
            
            // wait 1.5 seconds before announcement
            await (async () => {
                return new Promise((resolve)=> {
                    setTimeout(resolve,1500)
                })
            })();
            
            let s : string = await intf.prompt("Play again?")
            if (!s) break;
            g = new Grid(intf);
            g.print();
            intf.clear();
        }

        else if (intf.type === "CLI") {
            let s : string = await intf.getInput("Play again? [y n]\n")
            if (s) {
                g = new Grid(intf);
                g.print();
                intf.clear();
            }
        }
    }
}