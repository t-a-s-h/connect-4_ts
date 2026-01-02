import { expect } from "chai";
import { Segment } from "../main types/connect_4.js";
import { Grid } from "../main types/grid.js";

describe(`undoSegments should disconnect Square from attached segments by
    - replacing each segment on Square by a segment from the rest of the Grid
    - decrementing appropriate segments`,
() => {

    it('should do its basic job', ()=> {
        const g = new Grid;
        g.setSquare(0);
        g.setSquare(1);
        g.setSquare(0);
        g.setSquare(1);
        let [x,y] = [0,2];
        let A = [   
                new Segment(x,y,'H'),
                new Segment(x,y,'V'),
                new Segment(x,y,'V'),
                new Segment(x,y,'V')
            ];
        A.map(a => a.setLength(1));
        g.setSquare(0);
        g.theGrid[y][x].undoSegments(g);
        expect(g.theGrid[y][x].segments).to.have.deep.members(
            A
        );
    });
    it ('should do its basic job, incl. when the removed square is in the middle of a segment', ()=> {
        const g = new Grid;
        g.setSquare(0);
        g.setSquare(5);
        g.setSquare(1);
        g.setSquare(5);
        g.setSquare(3);
        g.setSquare(6);
        g.setSquare(4);
        g.setSquare(6);
        g.setSquare(2);

        // Square to have its segments deleted
        let [x,y] = [2,0];
        let X = g.theGrid[y][x];

        // segments at (0,1) after deletion should look like
        let [x1,y1] = [1,0];
        let A = [
            new Segment(x1,y1,'H'), new Segment(x1,y1,'V'), new Segment(x1,y1,'Dup'), new Segment(x1,y1,'Ddn')
        ];
        A[0].addLength(2);
        A[0].addLength(1);
        A[0].addLength(1);
        A[0].addLength(1);

        // segments at (0,4) after deletion should look like
        let [x2,y2] = [4,0]
        let B = [
            new Segment(x2,y2,'H'), new Segment(x2,y2,'V'), new Segment(x2,y2,'Dup'), new Segment(x2,y2,'Ddn')
        ]
        B[0].addLength(2);
        B[0].addLength(1);
        B[0].addLength(1);
        B[0].addLength(1);

        X.undoSegments(g);

        // expect (0,1) segments to look like it supposed to after deletion of (0,2)
        expect(g.theGrid[y1][x1].segments).to.have.deep.members(A);

        // expect (0,4) segments to look like it supposed to after deletion of (0,2)
        expect(g.theGrid[y2][x2].segments).to.have.deep.members(B);
    });
    it('should undo a win', ()=> {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(2);
        g.setSquare(3);
        g.setSquare(2);
        g.setSquare(3);
        g.setSquare(2);

        const G = g.clone();
        let delta = g.setSquare(3);
        g.undoSetSquare(delta);

        expect(G).to.deep.equal(g);
        expect(G).to.deep.equal(g);
    });
        it('should allow a win', ()=> {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(2);
        g.setSquare(3);
        g.setSquare(2);
        g.setSquare(3);

        //opposing player
        let delta = g.setSquare(3);

        g.undoSetSquare(delta);

        g.setSquare(2);
        g.setSquare(3);

        expect(g.isGameOver()).to.equal(true);
        expect(g.getWinner()).to.equal('X')



    })
})