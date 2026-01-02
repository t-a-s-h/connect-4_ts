import { expect } from 'chai'
import { Grid } from '../main types/grid.js'
import { getHeuristic } from '../minimax/mm.js';

const MaxScore = 250;
const NeutralScore = 10;
const MidBonus = 5;

describe('Heuristic function on a positive board', ()=> {
    it('should return `MaxScore` with a winning board', ()=>{
        const g = new Grid;
        g.setSquare(0);
        g.setSquare(1);
        g.setSquare(0);
        g.setSquare(2);
        g.setSquare(0);
        g.setSquare(3);
        g.setSquare(0);

        const result = getHeuristic(g,0);
        expect(result).to.equal(MaxScore);
    });
    it('should return `MaxScore` when a double win is possible', ()=> {
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

        const result = getHeuristic(g,0);
        expect(result).to.be.equal(MaxScore);
    })
    it('should return -`MaxScore` with a winning board for minimizing player', ()=>{
        const g = new Grid;
        g.setSquare(6)
        g.setSquare(0);
        g.setSquare(1);
        g.setSquare(0);
        g.setSquare(2);
        g.setSquare(0);
        g.setSquare(3);
        g.setSquare(0);
        const result = getHeuristic(g,0);
        expect(result).to.equal(-MaxScore);
    });
    it('should return -`MaxScore` when a double win is possible for minimizing player', ()=> {
        const g = new Grid;
        g.setSquare(3);
        g.setSquare(0);
        g.setSquare(5);
        g.setSquare(1);
        g.setSquare(5);
        g.setSquare(0);
        g.setSquare(6);
        g.setSquare(2);
        g.setSquare(6);
        g.setSquare(0); 

        const result = getHeuristic(g,0);
        expect(result).to.be.equal(-MaxScore);
    })
})

describe('Heuristic function on a neutral board', () => {
    it('should return at least `NeutralScore` on a board with a segment of length 2 or more', ()=> {
        const g = new Grid;
        g.setSquare(0);
        g.setSquare(1);
        g.setSquare(0);
        g.setSquare(2);
        g.setSquare(0);
        const result = getHeuristic(g,0);
        expect(result).to.be.at.least(NeutralScore);
    });
    it('should return at least `NeutralScore` * 2 on a board with two segments of length 2 or more', ()=> {
        const g = new Grid;
        g.setSquare(2);
        g.setSquare(1);
        g.setSquare(2);
        g.setSquare(0);
        g.setSquare(3);
        g.setSquare(1);
        g.setSquare(3);

        const result = getHeuristic(g,0);
        expect(result).to.be.at.least(NeutralScore * 2);
    });
    it('should return -`NeutralScore` * 2 with same for minimizing player', () => {
        const g = new Grid;
        g.setSquare(6);
        g.setSquare(2);
        g.setSquare(1);
        g.setSquare(2);
        g.setSquare(0);
        g.setSquare(3);
        g.setSquare(1);
        g.setSquare(3);

        const result = getHeuristic(g,0);
        expect(result).to.be.at.most(- NeutralScore * 2);
    })
    it('should give a middle column bonus', ()=> {
        const g1 = new Grid;
        g1.setSquare(3);
        const g2 = new Grid;
        g2.setSquare(2);
        const g3 = new Grid;
        g3.setSquare(4);

        const result1 = getHeuristic(g1,0);
        expect(result1).to.be.equal(MidBonus);
        const result2 = getHeuristic(g2,0);
        expect(result2).to.be.equal(MidBonus);
        const result3 = getHeuristic(g3,0);
        expect(result3).to.be.equal(MidBonus);
    })
    it('should _not_ give a middle column bonus to outer columns', ()=> {
        const g1 = new Grid;
        g1.setSquare(0);
        const g2 = new Grid;
        g2.setSquare(1);
        const g3 = new Grid;
        g3.setSquare(6);

        const result1 = getHeuristic(g1,0);
        expect(result1).to.be.equal(0);
        const result2 = getHeuristic(g2,0);
        expect(result2).to.be.equal(0);
        const result3 = getHeuristic(g3,0);
        expect(result3).to.be.equal(0);
    });
    it('should return 0 for a draw', ()=> {
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
        g.setSquare(6)

        const result = getHeuristic(g,0);
        expect(result).to.be.equal(0)
    })
})