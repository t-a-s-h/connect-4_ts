import { expect } from "chai";
import { Grid } from "../main types/grid.js";
import { PathType, Square } from "../main types/connect_4.js";

function getMinimal(s : Square,t: Square) : [ type: PathType, x : number, y : number ] {
    return [ s.findType(t.getCol(), t.getRow()), s.getCol(), s.getRow()]
}

function getMinArr(arr : Square[], s: Square) {
    let a = []
    for (let item of arr) {
        a.push(getMinimal(item,s))
    }
    return a;
}

describe('getClosestSegments function', () => {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(3);
        g.setSquare(4);
        g.setSquare(4);
        g.setSquare(4);
        g.setSquare(5);
        g.setSquare(2);

        // looks like
        //      0   1   2   3   4   5   6
        //      ...
        //  3:  .   .   .   .   .   .   .
        //  2:  .   .   .   x   x   .   .
        //  1:  .   .   .   o   o   .   .
        //  0:  .   .   .   x   x   o   .

        const a = g.theGrid[0][3];
        const b = g.theGrid[0][4];
        const c = g.theGrid[0][5];
        const d = g.theGrid[1][3];
        const e = g.theGrid[1][4];
        const f = g.theGrid[2][4];
        const h = g.theGrid[2][3];
    it('should return a squares neighbours', ()=> {
        const result = h.getSegmentWithInfo(g,'H');
        const expected = [f].map(x=>getMinimal(x,h))
        expect(result).to.have.deep.members([...expected, null]);
    });
    it('should work for more complicated cases', ()=> {
        const result = e.getSegmentWithInfo(g,'H');
        expect(result).to.have.deep.members([null,null]);
    });
})
describe('More complicated getClosestSegments tests', ()=> {
    it('should work with segments over length 1', ()=> {

        // looks like
        //      0   1   2   3   4   5   6
        //      ...
        //  3:  .   .   .   .   .   .   .
        //  2:  x   .   .   .   .   o   .
        //  1:  x   .   .   .   .   o   o
        //  0:  x   x   x   .   .   o   o

            const g = new Grid;
            g.setSquare(0);
            g.setSquare(5);
            g.setSquare(1);
            g.setSquare(5);
            g.setSquare(0);
            g.setSquare(6);
            g.setSquare(2);
            g.setSquare(6);
            g.setSquare(0);
            g.setSquare(5);

            let x = g.theGrid[0][0];
            let a = g.theGrid[1][0];
            let b = g.theGrid[2][0];
            
            const result = x.getSegmentWithInfo(g,'V');
            const expected = getMinimal(b,x);
            expect(result).to.have.deep.members([expected, null]);
    });
    it('should work with neighbours of opposite type', ()=> {

        // looks like
        //      0   1   2   3   4   5   6
        //      ...
        //  3:  .   .   .   .   .   .   .
        //  2:  o   .   .   .   .   x   .
        //  1:  o   .   .   .   .   x   o
        //  0:  x   o   o   .   .   x   x
        
        const g = new Grid;
        g.setSquare(0);
        g.setSquare(0);
        g.setSquare(5);
        g.setSquare(0);
        g.setSquare(5);
        g.setSquare(1);
        g.setSquare(5);
        g.setSquare(6);
        g.setSquare(6);
        g.setSquare(2);

        let x = g.theGrid[0][0];
        let a = g.theGrid[0][1];
        let b = g.theGrid[0][2];
        
        const result = x.getSegmentWithInfo(g,'H');
        const expected = [b].map(o=>getMinimal(o,x));
        expect(result).to.have.deep.members([null,...expected]);

    })
});

describe('getNeighbours function', () => {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(3);
        g.setSquare(4);
        g.setSquare(4);
        g.setSquare(4);
        g.setSquare(5);
        g.setSquare(2);

        // looks like
        //      0   1   2   3   4   5   6
        //      ...
        //  3:  .   .   .   .   .   .   .
        //  2:  .   .   .   x   x   .   .
        //  1:  .   .   .   o   o   .   .
        //  0:  .   .   .   x   x   o   .

        const a = g.theGrid[0][3];
        const b = g.theGrid[0][4];
        const c = g.theGrid[0][5];
        const d = g.theGrid[1][3];
        const e = g.theGrid[1][4];
        const f = g.theGrid[2][4];
        const h = g.theGrid[2][3];
    it('should return a squares neighbours', ()=> {
        const result = f.getNeigbours(g);
        const expected = [d,e].map(x=>getMinimal(x,f))
        expect(result).to.have.deep.members(expected);
    });
    it('should work for more complicated cases', ()=> {
        const result = e.getNeigbours(g);
        const expected = [a,b,c,d,f].map(x=>getMinimal(x,e));
        expect(result).to.have.deep.members(expected);
    });
})