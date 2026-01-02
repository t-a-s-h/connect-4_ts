import { Subscriber, Publisher, Square, height, width, Segment } from "./connect_4.js";
import type { Mark } from "./connect_4.js";
import { Interface } from "./interface.js";

export type MoveDelta = {
    game_over : boolean,
    winner : Mark,
    recent_square : Square | null,
    x_turn : boolean
}

export class Grid implements Subscriber, Publisher {
    constructor(intf: Interface | null = null) {
        this.#xTurn = true;
        this.#num_played = 0;
        this.#verticalHeights = Array(width).fill(0);
        this.#gameOver = false;
        this.#winner = " ";
        this.#subscribers = [];
        this.#intf = intf;
        this.#recent_square = null;        
        this.theGrid = new Array(height).fill(null).map((_,i)=>new Array(width).fill(null).map((_,j)=>{
            return new Square(j,i)
        }))
        if (this.#intf) this.attach(this.#intf);
    }

    getVerticalHeight(x :number) { 
        if (!(0 <= x && x < width)) return 0;
        return this.#verticalHeights[x];
     };

    hasIntf() { return this.#intf !== null }

    clone() : Grid { // Does **NOT** clone intf : Interface
        
        let clone = new Grid;
        clone.#xTurn = this.#xTurn;
        clone.#num_played = this.#num_played;
        clone.#verticalHeights = [...this.#verticalHeights];
        clone.#gameOver = this.#gameOver;
        clone.#winner = this.#winner;
        clone.#subscribers = [...this.#subscribers];
        clone.#intf = null;
        clone.#recent_square = this.#recent_square ? this.#recent_square.clone() :null;;
        clone.theGrid = new Array(height).fill(null).map((_,i)=>new Array(width).fill(null).map((_,j)=>{
            let s = this.theGrid[i][j].clone();
            return s;
        }))
        return clone;
    }

    createMoveDelta() : MoveDelta {
        return {
            recent_square : this.#recent_square,
            game_over : this.#gameOver,
            winner : this.#winner,
            x_turn :  this.#xTurn
        }
    }
    
    isDraw(): boolean {
        if (this.#num_played >= height * width) {
            return true;
        }
        return false; 
    }

    isInRange(n: number): boolean {
        return 0 <= n && n < width && this.#verticalHeights[n] < height;
    }

    isInGridRange(x: number, y : number) {
        return 0 <= x && x < width && 0 <= y && y < this.#verticalHeights[x];
    }

    incNumPlayed(): number {
        return ++this.#num_played;
    }

    isGameOver(): boolean {
        this.#gameOver = (this.isDraw() || this.getWinner() !== ' ');
        return this.#gameOver;
    }

    setGameOver(): void {
        this.#gameOver = true;
    }

    undoSetSquare(delta : MoveDelta) {
        const s = this.#recent_square;
        if (s.getMark() === ' ') return // safeguard
        s.undoSegments(this);
        s.reset();
        s.notifySubscribers();
        s.detach();
        --this.#verticalHeights[s.getCol()];
        --this.#num_played;
        this.#xTurn = delta.x_turn;
        this.#recent_square = delta.recent_square;
        this.#winner = delta.winner;
        this.#gameOver = delta.game_over;
    }

    // needs to check vertical heights w/i Grid
    setSquare(x: number, to_print : boolean = true): MoveDelta {
        const moveDelta = this.createMoveDelta()
        if (this.#verticalHeights[x] >= height) {
            console.log("too high");
        }
        let y = this.#verticalHeights[x];
        ++this.#verticalHeights[x];
        this.incNumPlayed();
        let s = this.theGrid[y][x];
        s.attach(this);
        s.update(this); // Square's internal's updated with Grid, calls extend, calls s.detach
        s.notifySubscribers(); // Square notifies Grid, sets correct turn
        this.#recent_square = s;
        if (to_print) this.notifySubscribers();
        return moveDelta;
    }

    getRecentSquare() {
        return this.#recent_square;
    }

    getWinner(): Mark {
        return this.#winner;
    }

    update(s: Square): void {
        this.#xTurn ? s.setType(true) : s.setType(false);
        this.setXTurn();
    }

    getXTurn(): boolean {
        return this.#xTurn;
    }

    setXTurn(): void {
         this.#xTurn = !this.#xTurn;
    }

    setWinner(m: Mark): void {
        this.#winner = m;
    }

    attach(o: Subscriber): void {
        this.#subscribers.push(o);
    }

    detach(): void {
        this.#subscribers = [];
    }

    notifySubscribers(): void {
        for (let subscriber of this.#subscribers) {
            subscriber.update(this) // Grid updates Display (with Grid)
        }
    }

    print() : void { // for CLI only
        if (! this.#intf) return;
        if (this.#intf.type === 'GUI') return;
        for (let i = height - 1; i >= 0; --i) {
            for (let j = 0; j < width; ++j) {
                this.#intf.write(this.theGrid[i][j].getMark() + " ");

            }
            this.#intf.write("\n")
        }
        for (let i = 0; i < width; ++i) {
            this.#intf.write(i + " ");
        }
        this.#intf.write("\n");
    }

    #xTurn: boolean;
    #num_played: number;
    #verticalHeights : number[];
    #gameOver: boolean;
    #winner: Mark;
    #subscribers: Subscriber[] // incluced Display and GUI;
    #intf: Interface | null;
    #recent_square : Square | null;
    theGrid: Square[][];
}