import { expect } from "chai";
import { Display } from "../main types/CLI.js";
import { Grid } from "../main types/grid.js";
import { minimax, isOpponentWin, isDoubleWin, isTerminal, isWin } from "../minimax/mm.js";


describe('Next turn', ()=> {
    it ('should go for obvious block', ()=> {
        const g = new Grid(new Display)

        g.setSquare(6)
        g.setSquare(2)
        g.setSquare(2)
        g.setSquare(3)
        g.setSquare(6)
        g.setSquare(5)
        g.setSquare(2)
        g.setSquare(3)
        g.setSquare(1)
        g.setSquare(0)
        g.setSquare(1)
        g.setSquare(0) // o
        g.setSquare(0) // x
        let M = minimax(g,1,false)

        let { move } = M
        expect(move).to.equal(4);
    })
})

describe('isOpponentWin', ()=> {
    it ('should detect opponent win', () => {
        const g = new Grid

        g.setSquare(2)
        g.setSquare(1)
        g.setSquare(0)
        g.setSquare(1)
        g.setSquare(0)
        g.setSquare(1)
        g.setSquare(0) // x
        g.setSquare(1) // o

        expect(isOpponentWin(g,true)).to.equal(true)
    })
})

describe('isWin', ()=> {
    it('should detect win', () => {
        const g = new Grid;

        g.setSquare(1) 
        g.setSquare(4)
        g.setSquare(3)
        g.setSquare(4)
        g.setSquare(2)
        g.setSquare(1)
        g.setSquare(3)
        g.setSquare(0)
        g.setSquare(3)
        g.setSquare(3)
        g.setSquare(5)
        g.setSquare(2)
        g.setSquare(2)
        g.setSquare(2)
        g.setSquare(5)
        g.setSquare(0)
        g.setSquare(1)
        g.setSquare(1)
        g.setSquare(3)
        g.setSquare(3)
        g.setSquare(4) // x

        expect(isWin(g)).to.equal(true);

    })
})