import type { Grid } from "./grid"

type Order = -1 | 0 | 1;

export const lst : number[][] = [];

export type PathType = "V" | "Ddn" | "H" | "Dup";

export type Mark = "X" | "O" | " ";

export const width = 7, height = 6, connect_number = 4, num_directions = 4;

function ordering<T>(a: T, b : T) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}

export function intToPath(n : number) : PathType {
    switch(n) {
        case 0 : return 'V';
        case 1 : return 'Ddn';
        case 2 : return 'H';
        case 3 : return 'Dup';
        default: return 'V';
    }
}

export function pathToInt(t : PathType) : number {
    switch(t) {
        case 'V'  : return 0;
        case 'Ddn': return 1;
        case 'H'  : return 2;
        case 'Dup': return 3;
        default   : return -1;
    }
}

export function isInteger(n : any) : boolean {
    return (Number(n) === parseInt(n) && isFinite(n));
}

export abstract class Subscriber {
    abstract update(context : Publisher) : void;
}

export abstract class Publisher {
    abstract notifySubscribers() : void;
    abstract attach(o : Subscriber) : void;
    abstract detach() : void;
}

export class Segment {
    constructor(x : number,y: number, type : PathType) {
        this.#endX = x;
        this.#endY = y;
        this.#length = 0;
        this.#type = type;
    }

    clone() : Segment {
        let clone = new Segment(this.#endX, this.#endY, this.#type);
        clone.#length = this.#length;
        return clone;
    }
    
    isExtendable(g : Grid) : number {
        let count = 0;
        let dx = 0, dy = 0;
        switch(this.#type) {
            case 'H': 
                dx = 1; break;
            case 'V':
                dy = 1; break;
            case 'Dup':
                dx = 1; dy = 1; break;
            case 'Ddn':
                dx = -1; dy = 1; break;
            default: break;
        }
        let x1 = this.#endX;
        let y1 = this.#endY;
        let x2 = x1 + this.#length * - dx;
        let y2 = y1 + this.#length * - dy;

        if ((g.isInRange(x1 + dx)) && y1 + dy < height && g.theGrid[y1 + dy][x1 + dx].getMark() === ' ') {
            ++count;
        }
        if ((g.isInRange(x2 - dx))&& 0 <= y2 - dy && g.theGrid[y2 - dy][x2 - dx].getMark() === ' ') {
            ++count;
        }
        return count;
    }
    getX() : number { return this.#endX; };
    getY() : number { return this.#endY; }
    addLength(amount : number): void {
        this.#length += amount;
    }
    setLength(amount : number) : void  {
        this.#length = amount;
    } 
    getLength() : number {
        return this.#length;
    }
    getType() : PathType {
        return this.#type;
    }
    #endX;
    #endY;
    #length;
    #type;
}

export class Square extends Publisher {
    constructor(x : number, y : number) {
        super();
        this.#type = " ";
        this.#row = y;
        this.#col = x;
        this.#subscribers = [];
        this.segments = [];
        this.winningSegment = null;
    }

    clone() : Square {
        let clone = new Square(this.#col, this.#row);
        // do NOT clone subscribers!!!!
        clone.#type = this.#type;
        clone.#row = this.#row;
        clone.#col = this.#col;
        clone.segments = this.segments.map(segment=>segment.clone());
        clone.winningSegment = this.winningSegment;
        return clone;
    }

    undoSegments(g : Grid) {
        let x0 = this.#col, y0 = this.#row;
        let Ds = {
            'V'   : [0,1],
            'Dup' : [1,1],
            'H'   : [1,0],
            'Ddn' : [-1,1]
        }
        for (let i = 0; i < num_directions; ++i) {
            let t = intToPath(i);
            let [dx,dy] = Ds[t];
            let x = x0, y = y0;
            let new_length = 0;
            // look for forward segment
            while (! g.theGrid[y][x].getPath(t)) {
                x += dx;
                y += dy;
                ++new_length;
            }
            const prev_len = g.theGrid[y][x].getPath(t).getLength()
            g.theGrid[y][x].getPath(t).setLength(new_length);
            // find previous segment
            x = x0 - Ds[t][0], y = y0 - Ds[t][1];
            if (!g.isInGridRange(x,y) || this.#type !== g.theGrid[y][x].getMark()) {
                continue;
            }
            g.theGrid[y][x].segments[i] = new Segment(x,y,t);
            g.theGrid[y][x].getPath(t).setLength(prev_len - new_length - 1);
        }
    }

    getPathFromInt(n : number) {
        return this.segments[n]
    }

    getPath(t : PathType) : Segment {
        if (!(0 <= pathToInt(t) && pathToInt(t) < num_directions)) return null;
        return this.segments[pathToInt(t)];
    }

    getRow(): number {
        return this.#row;
    }
    getCol(): number {
        return this.#col;
    }
    findType(x: number, y: number): PathType {
        let y_diff = y - this.#row;
        let x_diff = x - this.#col;

        if (x_diff == 0) return "V";
        else if (x_diff == y_diff) return "Dup";
        else if (x_diff == -y_diff) return "Ddn";
        else return "H";
    }
    compare(s : Square) : Order {
        return ordering<number>(this.getRow(),s.getRow()) ||
            ordering<number>(this.getCol(),s.getCol())
    }
    setType(isX : boolean): void {
        this.#type = isX ? 'X' : 'O';
    }

    reset() : void {
        this.#type = " ";
        this.#subscribers = [];
        this.segments = [];
        this.winningSegment = null;
    }

    // extends a Squares segments in specified direction (as needed) on play
    extend(g : Grid, t : PathType, x : number, y : number) : void {
        let other : Square = g.theGrid[y][x];
        if (!other.getPath(t)) return;
        if (other.getMark() !== this.#type) {
            return;
        }

        let A : Square, B : Square;

        if (this.compare(other) > 0) {
            A = this;
            B = other;
        } else { 
            A = other;
            B = this;
        }
        
        // extend A with B.segments
        // - add B's length to A's length
        // - check for win
        // - delete B's segments
        A.getPath(t).addLength(B.getPath(t).getLength()); 
        if (A.getPath(t).getLength() >= connect_number) {
            this.winningSegment = A.getPath(t);
            g.setWinner(this.#type);
        }
        delete B.segments[pathToInt(t)];
    }

    getMark(): Mark {
        return this.#type;
    }

    getPlayed(): boolean {
        return this.#type !== " ";
    }

    getX() : number {
        return this.#col;
    }

    getY() : number {
        return this.#row;
    }
    print() : void {
        console.log(this.getMark())
    }

    getNeigbours(g: Grid, mark? :  Mark) : [ PathType, number, number ][] {
        let arr :  [ PathType, number, number ][] = []
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                // not in range
                if (!g.isInGridRange(this.#col + j, this.#row + i)) continue;
                // not this
                if ((i === 0) && (j === 0)) continue;
                if (g.theGrid[i + this.#row][j + this.#col].getMark() === ' ') continue;
                if (mark && (g.theGrid[i + this.#row][j + this.#col].getMark() !== mark)) continue;
                arr.push([this.findType(this.#col + j, this.#row + i),this.#col + j,this.#row + i]);
            }
        }
        return arr;
    }

    // gets closest neighbours with segment information 
    getSegmentWithInfo(g : Grid, t : PathType) : [ type: PathType, x: number, y : number ][] {
        let arr1 : [ type: PathType, x: number, y : number ] = null;
        let arr2 : [ type: PathType, x: number, y : number ] = null;  
        let x0 = this.getCol(); let y0 = this.getRow();
        let Ds : {[t in PathType] : [number,number]} = {
            'H'   : [1,0],
            'V'   : [0,1],
            'Dup' : [1,1],
            'Ddn' : [-1,1]
        }
        let [dx, dy] = Ds[t];
        // forwards
        let x = x0 + dx;
        let y = y0 + dy;
        while (g.isInGridRange(x,y)) {; 
            if (g.theGrid[y][x].getMark() === ' ') break;
            if (g.theGrid[y][x].getPath(t) &&
                g.theGrid[y][x].getMark() === 'X') {
                arr1 = [ t,x,y ];
            } else if (g.theGrid[y][x].getPath(t)) {
                arr2 = [ t,x,y ];
            }
            x += dx;
            y += dy;
        } 
        // backwards
        x = x0 - dx;
        y = y0 - dy;
        while (g.isInGridRange(x,y)) {
            if (g.theGrid[y][x].getMark() === ' ') break;
            if (g.theGrid[y][x].getPath(t) &&
                g.theGrid[y][x].getMark() === 'X') {
                arr1 = [ t,x,y ];
            } else if (g.theGrid[y][x].getPath(t)) {
                arr2 = [ t,x,y ];
            }
            x -= dx;
            y -= dy;
        }         
        return [  arr1, arr2 ];
    }

    update(g : Grid): void {
        this.setType(g.getXTurn());
        // create segments
        if (! this.segments.length) {
            this.segments = new Array<Segment>(num_directions);
            for (let i = 0; i < num_directions; ++i) { 
                this.segments[i] = new Segment(this.#col,this.#row,intToPath(i));
                this.segments[i].addLength(1);
            }
        }

        // get neighbours
        let neighbours = this.getNeigbours(g,this.#type);

        // extend segments in every direction
        for (let neighbour of neighbours) {
            let [t,x0,y0] = neighbour;
            let Ds = {
                'H': [1, 0],
                'V': [0, 1],
                'Dup': [1, 1],
                'Ddn': [-1, 1]
            };
            let [dx, dy] = Ds[t];
            let x = x0; let y = y0;
            while (! g.theGrid[y][x].getPath(t)) {
                x += dx;
                y += dy;
            }
            this.extend(g,t,x,y);
        }
    }
    attach(g : Subscriber): void {
        this.#subscribers.push(g);
    }
    
    detach(): void {
        this.#subscribers = [];
    }
    notifySubscribers(): void {
        for (let subscriber of this.#subscribers) {
            subscriber.update(this) // Square's subs (Grid) updated (with Square)
        }
    }
    #subscribers : Subscriber[];
    #type : Mark;
    #row : number;
    #col : number;
    segments : Segment[];
    winningSegment : Segment | null;
}