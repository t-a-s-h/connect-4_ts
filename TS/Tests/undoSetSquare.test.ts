import { expect } from "chai";
import { Grid } from "../main types/grid.js";

describe('undoSetSquare function', ()=> {
    it('should undo recently placed square', ()=> {
        const g = new Grid;
        const G = g.clone();
        let delta = g.setSquare(3);
        g.undoSetSquare(delta);
        expect(g).to.deep.equal(G);
    });
    it('should undo two recently placed squares', ()=> {
        const g = new Grid;
        const G = g.clone();
        let delta1 = g.setSquare(3);
        g.undoSetSquare(delta1);
        let delta2 = g.setSquare(3);
        g.undoSetSquare(delta2)
        expect(g).to.deep.equal(G);
        expect(delta1).to.deep.equal(delta2);
    });
    it('should work after both pieces play', ()=> {
        const g = new Grid;
        g.setSquare(3);
        const G = g.clone();
        let delta = g.setSquare(3);
        g.undoSetSquare(delta);
        expect(g).to.deep.equal(G);
    });
    it('should do more complicated cases', ()=> {
        const h = new Grid;
        h.setSquare(3);
        h.setSquare(1);
        h.setSquare(2);
        h.setSquare(1);
        let A = h.clone();
        let delta = h.setSquare(0);
        h.undoSetSquare(delta);
        expect(A).to.deep.equal(h);
    });
    it('should work with segments of length > 1', ()=> {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(6);
        g.setSquare(2);
        g.setSquare(6);
        g.setSquare(1);
        g.setSquare(5)

        let A = g.clone();
        let delta = g.setSquare(0);
        g.undoSetSquare(delta);
        expect(A).to.deep.equal(g);
    })
    it('should work in the middle of segments', ()=> {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(6);
        g.setSquare(0);
        g.setSquare(6);
        g.setSquare(1);
        g.setSquare(5)

        let A = g.clone();
        let delta = g.setSquare(2);
        g.undoSetSquare(delta);
        expect(A).to.deep.equal(g);
    })
    it('should work here', ()=> {
        const g = new Grid;
        g.setSquare(3)
        g.setSquare(3)
        g.setSquare(2)
        g.setSquare(4)
        g.setSquare(1)
        g.setSquare(0)
        g.setSquare(2)
        g.setSquare(2)
        g.setSquare(3)
        g.setSquare(2)
        g.setSquare(3)
        g.setSquare(3)
        g.setSquare(3)
        g.setSquare(2)
        g.setSquare(2)
        g.setSquare(4)
        g.setSquare(4)
        g.setSquare(4)
        g.setSquare(4)
        g.setSquare(4)
        g.setSquare(5)
        g.setSquare(1)
        g.setSquare(1)
        g.setSquare(5)
        g.setSquare(1)
        g.setSquare(1)
        g.setSquare(1)
        g.setSquare(5)
        g.setSquare(5)
        g.setSquare(5)
        g.setSquare(5)
        g.setSquare(6)
        g.setSquare(6)
        g.setSquare(6)
        g.setSquare(0)
        g.setSquare(6)
        g.setSquare(0)
        g.setSquare(0)
        g.setSquare(0)
        g.setSquare(0)
        g.setSquare(6)

        const G = g.clone();
        let delta = g.setSquare(6)
        g.undoSetSquare(delta);
        expect(g).to.deep.equal(G);
    });
})
//# sourceMappingURL=undoSetSquare.test.js.map