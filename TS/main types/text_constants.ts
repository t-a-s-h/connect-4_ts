import { Mark } from "./connect_4.js"

const START_GAME = "Welcome to Connect 4!\n";

const GET_INPUT = "Pick a move to play or enter q to quit.\n";

const GET_INPUT_GUI = "Click to play.\n";

const ANNOUNCE_TURN = function(isX : Boolean) {
    return `${isX ? 'X' : 'O'}'s turn.\n`;
}

const ANNOUNCE_WIN = function(player : Mark) {
    return `${player === 'X' ? 'X' : 'O'} wins!\n`;
}

const DRAW = "Draw.";

const MOVE_INVALID = "Invalid move; pick again.\n";

const CMD_INVALID = "Invalid command. Pick again\n"

const GAME_END = "Game ended. Bye.\n";

export {
    START_GAME,
    GET_INPUT,
    GET_INPUT_GUI,
    ANNOUNCE_TURN,
    ANNOUNCE_WIN,
    DRAW,
    MOVE_INVALID,
    GAME_END,
    CMD_INVALID
}