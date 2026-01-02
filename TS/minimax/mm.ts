import { width, PathType, Mark } from "../main types/connect_4.js";
import { Grid } from "../main types/grid.js";

// should pick moves in this order
// starting from middle, moving outwards
const priority = [3,2,4,1,5,0,6] as const;

export function isWin(g: Grid) : boolean {
    return g.isGameOver() && ! g.isDraw()
}

export function isDoubleWin(g: Grid, isX : boolean) : boolean {
    const mark =  isX ? 'X' : 'O' ;
    let win_count = 0;
    for (let x = 0; x < width; ++x) {
        if (! g.isInRange(x)) continue;
        g.setXTurn();
        let delta = g.setSquare(x,false)
        if (g.isGameOver() && g.getWinner() === mark) {
            ++win_count;
        }
        g.undoSetSquare(delta);
    }
    return win_count >= 2;
}

export function isOpponentDoubleWin(g: Grid, isX : boolean) : boolean {
    const mark =  isX ? 'O' : 'X' ;
    let win_count = 0;
    for (let x = 0; x < width; ++x) {
        if (! g.isInRange(x)) continue;
        let delta = g.setSquare(x,false)
        if (g.isGameOver() && g.getWinner() === mark) {
            ++win_count;
        }
        g.undoSetSquare(delta);
    }
    return win_count >= 2;
}

export function isOpponentWin(g : Grid, isX : boolean) : boolean {
    const opp_mark =  isX ? 'O' : 'X' ;
    for (let x = 0; x < width; ++x) {
        if (! g.isInRange(x)) continue;
        let delta = g.setSquare(x,false)
        if (g.isGameOver() && g.getWinner() === opp_mark) {
            g.undoSetSquare(delta);
            return true;
        }
        g.undoSetSquare(delta);
    }
    return false;
}

function getHeuristic(g : Grid,depth : number) {
    let val = 0, score = 0;
    let isX = !g.getXTurn(); // because player just played
    const plr_squares = {} as { [ key in PathType ] : number}
    const opp_squares = {} as { [ key in PathType ] : number}
    let plr : Mark = isX ? 'X' : 'O'
    let opp : Mark = isX ? 'O' : 'X'

    let neighbours_same : [PathType, number,number][] = g.getRecentSquare().getNeigbours(g,plr);
    let neighbours_opp : [PathType, number,number][] = g.getRecentSquare().getNeigbours(g,opp);

    let neighbours: [PathType, number,number][] = []

    for (let [t,x,y] of neighbours_same) {
        neighbours.push(...g.theGrid[y][x].getSegmentWithInfo(g,t));
    }

    for (let [t,x,y] of neighbours_opp) {
        neighbours.push(...g.theGrid[y][x].getSegmentWithInfo(g,t));
    }

    if (g.isDraw()) {
        return 0;
    }

    else if (isWin(g)) {
        score = 250;
    }

    else if (isOpponentWin(g,isX)) {
        score = -250;
    }

    else if (isDoubleWin(g,isX)) {
        score = 250;
    }

    else if (isOpponentDoubleWin(g,isX)) {
        score = -250;
    }

    // reward play in middle columns
    switch (g.getRecentSquare().getCol()){
        case 2:
        case 3:
        case 4: val += 5; break
        default: break;
    }

    for (let neighbour of neighbours) {
        if (! neighbour) continue;
        let [t,x,y] = neighbour
        if (! g.theGrid[y][x].getPath(t)) continue;
        if ((g.theGrid[y][x].getMark() === 'X') === isX) {
            plr_squares[t] ? plr_squares[t] += g.theGrid[y][x].getPath(t).getLength() :
                plr_squares[t] = g.theGrid[y][x].getPath(t).getLength()
        } else {
            opp_squares[t] ? opp_squares[t] += g.theGrid[y][x].getPath(t).getLength() :
                opp_squares[t] = g.theGrid[y][x].getPath(t).getLength()
        }
    }

    for (let [segment, length] of Object.entries(plr_squares)) {
        switch(length) {
            case 1: break;
            case 2: val += 5; break;
            default: val += 25; break;
        }
    }

    for (let [s, length] of Object.entries(opp_squares)) {
        let t = s as PathType
        switch(length) {
            case 1: break;
            case 2: val += 5; break;
            default: break;
        }
    }

    // depth starts from max depth
    score = score ? score + depth : val;

    return isX ? score : -score;
}

export function isTerminal(g: Grid) : boolean {
    return g.isGameOver();
}

type mm_return = {value: number, move: (number | null)}

// should pick moves in priority order
// starts from middle, moves outwards
// priority = [3,2,4,1,5,0,6];
function minimax (g : Grid, depth : number, isMaximizing : boolean = true, alpha : number = -Infinity, beta : number = Infinity) : mm_return {
    if (depth === 0 || isTerminal(g)) {
        return { value : getHeuristic(g, depth), move : null };
    }

    let best : mm_return = { value : isMaximizing ? -Infinity : Infinity, move : null}

    if (isMaximizing) {
        let max_value = -Infinity;
        for (let x of priority) {
            if (!g.isInRange(x)) continue;
            let delta = g.setSquare(x,false);
            let { value } = minimax(g, depth - 1, false,alpha,beta);
            g.undoSetSquare(delta);
            if (value > max_value) {
                max_value = value;
                best.move = x
            }
            alpha = Math.min(value, alpha);
            if (beta <= alpha) {
                break;
            }   
        }
        best.value = max_value;
    } else {
        let min_value = Infinity;
        for (let x of priority) {
            if (!g.isInRange(x)) continue;
            let delta = g.setSquare(x,false);
            let { value } = minimax(g, depth - 1, true,alpha,beta)
            g.undoSetSquare(delta);
            if (value < min_value) {
                min_value = value;
                best.move = x
            }  
            beta = Math.min(value, beta);
            if (beta <= alpha) {
                break;
            }
        } 
        best.value = min_value;
    }
    return best;
}

export { 
    getHeuristic,
    minimax,
}