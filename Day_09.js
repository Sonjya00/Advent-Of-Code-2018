// Fixed variables
const winningNum = 23;
let marblesOrder = [0];

// Given variables
const sample = {
  players: 9,
  marbles: 25
};

const part1 = {
  players: 418,
  marbles: 71339
};

const part2 = {
  players: 418,
  marbles: 7133900
};

function newGame(players, marbles) {
  let scores = []; // array to keep track of all players scores
  let currentPlayer = 0; // current player turn

  // Set up initial marble
  let currentMarble = { value: 0, prevMarble: null, nextMarble: null };
  currentMarble.prevMarble = currentMarble;
  currentMarble.nextMarble = currentMarble;

  for (let i = 1; i <= marbles; i++) {
    // Check if the current marble's value is a multiple of 23
    const isMultiple = i % winningNum === 0 ? true : false;
    switch (isMultiple) {
      // If it is, add score to current player
      case true:
        currentMarble = getMarbleToRemove(currentMarble); // Go back to the marble to remove
        const newScore = i + currentMarble.value;
        currentMarble = removeMarble(currentMarble); // Remove by editing surrounding marbles values
        // check if current player already has a score recorded
        scores[currentPlayer]
          ? (scores[currentPlayer] += newScore)
          : (scores[currentPlayer] = newScore);
        break;
      // If it's not a multiple of 23, current player only places the next marble
      case false:
        currentMarble = addMarble(i); // Add new marble as current marble nextMarble
        break;
    }
    // Check whose turn is next
    currentPlayer === players - 1 ? (currentPlayer = 0) : currentPlayer++;
  }

  // Go back of 7 marbles to get to the marble to remove
  function getMarbleToRemove(marble) {
    for (let i = 0; i < 7; i++) {
      marble = marble.prevMarble;
    }
    return marble;
  }

  // Remove marble by editing the marbles before and next to it to have each other as prev and next marbles
  function removeMarble(marble) {
    marble.prevMarble.nextMarble = marble.nextMarble;
    marble.nextMarble.prevMarble = marble.prevMarble;
    // Current marble becomes the marble right next to the marble just removed
    return marble.nextMarble;
  }

  function addMarble(newMarbleValue) {
    // Create new marble
    let newMarble = {
      value: newMarbleValue, // new marble's value
      prevMarble: currentMarble.nextMarble, //  new marble's marble on the left
      nextMarble: currentMarble.nextMarble.nextMarble // new marble's marble on the right
    };
    // Add new marble data to the adjacent marbles
    currentMarble.nextMarble.nextMarble.prevMarble = newMarble;
    currentMarble.nextMarble.nextMarble = newMarble;
    // Set new marble to be the current one
    return newMarble;
  }

  const winnerScore = scores.reduce((a, b) => (a > b ? a : b));
  console.log(winnerScore);
}

newGame(sample.players, sample.marbles);
newGame(part1.players, part1.marbles);
newGame(part2.players, part1.marbles);
