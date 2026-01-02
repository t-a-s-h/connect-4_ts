import { expect } from "chai";
import { Grid } from "../main types/grid.js";
import { pathToInt } from "../main types/connect_4.js";

const notExtendable = 0;
const singlyExtendable = 1;
const doublyExtendable = 2;

describe("Segment's isExtendable function", ()=> { 

    const g = new Grid;
    g.setSquare(3);
    g.setSquare(3);
    g.setSquare(4);
    g.setSquare(4);
    g.setSquare(4);
    g.setSquare(5);

    // looks like
    //      0   1   2   3   4   5   6
    //      ...
    //  3:  .   .   .   .   .   .   .
    //  2:  .   .   .   .   x   .   .
    //  1:  .   .   .   o   o   .   .
    //  0:  .   .   .   x   x   o   .

    const a = g.theGrid[0][3];
    const b = g.theGrid[0][4];
    const c = g.theGrid[0][5];
    const d = g.theGrid[1][3];
    const e = g.theGrid[1][4];
    const f = g.theGrid[2][4];
    it('should return 2 when the segment is doubly Extendable upwards (or rightwards)', () => {
        const result = e.segments[pathToInt('H')].isExtendable(g);
        expect(result).to.be.equal(doublyExtendable);
    })
    it('should return 0 when the segment is NOT Extendable', ()=> {
        const result = e.segments[pathToInt('V')].isExtendable(g);
        expect(result).to.be.equal(notExtendable);
    })
    it('should return 2 when the segment is doubly Extendable downwards of leftwards', ()=> {
        const result = f.segments[pathToInt('H')].isExtendable(g);
        expect(result).to.be.equal(doublyExtendable);
    })
    it('should return 1 when the segment is singly Extendable downwards of leftwards', ()=> {
        const result = f.segments[pathToInt('V')].isExtendable(g);
        expect(result).to.be.equal(singlyExtendable);
    })
    it('should return true when the segment is singly Extendable downwards of leftwards', ()=> {
        const result = b.segments[pathToInt('H')].isExtendable(g);
        expect(result).to.be.equal(singlyExtendable);
    })
})