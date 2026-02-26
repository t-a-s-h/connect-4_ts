# Connect 4
A simple game of connect 4 that was made too complex. Lets you to play against the computer (using the minimax algorithm).
## Tech
TypeScript.
## Run
### Option 1
- view demo [here](https://t-a-s-h.github.io/connect-4_ts/)
### Option 2
- Download [here](https://github.com/t-a-s-h/connect-4_ts/archive/refs/heads/main.zip).
- Unzip folder.
- Navigate to unzipped folder in terminal.
- Run `npm start`
## Current status
 #working #needs_ui_improvements 
## Notes
- Attempt to scale Observer pattern used in Tic-Tac-Toe-Observer.
- In retrospect, the Observer pattern is not really needed and overcomplicates the code.
- Because this game uses larger objects to maintain state, that depend largely on each other, creating a proper heuristic for the minimax implementation was more difficult than required and slowed the AI down significantly.
	- It also made implementing minimax require refactoring the code to add an undo function in order to avoid copious copying of objects.
## Future considerations
### UI / UX improvements
- The current version is not compatible with all screen sizes. This should be fixed.
