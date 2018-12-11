const input = `Step P must be finished before step G can begin.
Step X must be finished before step V can begin.
Step H must be finished before step R can begin.
Step O must be finished before step W can begin.
Step C must be finished before step F can begin.
Step U must be finished before step M can begin.
Step E must be finished before step W can begin.
Step F must be finished before step J can begin.
Step W must be finished before step K can begin.
Step R must be finished before step M can begin.
Step I must be finished before step K can begin.
Step D must be finished before step B can begin.
Step Z must be finished before step A can begin.
Step A must be finished before step N can begin.
Step T must be finished before step J can begin.
Step B must be finished before step N can begin.
Step Y must be finished before step M can begin.
Step Q must be finished before step N can begin.
Step G must be finished before step V can begin.
Step J must be finished before step N can begin.
Step M must be finished before step V can begin.
Step N must be finished before step V can begin.
Step K must be finished before step S can begin.
Step V must be finished before step L can begin.
Step S must be finished before step L can begin.
Step W must be finished before step D can begin.
Step A must be finished before step V can begin.
Step T must be finished before step Y can begin.
Step H must be finished before step W can begin.
Step O must be finished before step C can begin.
Step P must be finished before step S can begin.
Step Z must be finished before step N can begin.
Step G must be finished before step K can begin.
Step I must be finished before step T can begin.
Step D must be finished before step M can begin.
Step A must be finished before step Q can begin.
Step O must be finished before step S can begin.
Step N must be finished before step L can begin.
Step V must be finished before step S can begin.
Step M must be finished before step N can begin.
Step A must be finished before step B can begin.
Step H must be finished before step B can begin.
Step H must be finished before step G can begin.
Step Q must be finished before step M can begin.
Step U must be finished before step E can begin.
Step C must be finished before step S can begin.
Step M must be finished before step L can begin.
Step T must be finished before step L can begin.
Step I must be finished before step N can begin.
Step Y must be finished before step N can begin.
Step K must be finished before step V can begin.
Step U must be finished before step B can begin.
Step H must be finished before step Z can begin.
Step H must be finished before step Y can begin.
Step E must be finished before step F can begin.
Step F must be finished before step Q can begin.
Step R must be finished before step G can begin.
Step T must be finished before step S can begin.
Step T must be finished before step Q can begin.
Step X must be finished before step H can begin.
Step Q must be finished before step S can begin.
Step Q must be finished before step J can begin.
Step G must be finished before step S can begin.
Step D must be finished before step S can begin.
Step A must be finished before step J can begin.
Step I must be finished before step Y can begin.
Step U must be finished before step K can begin.
Step P must be finished before step R can begin.
Step A must be finished before step T can begin.
Step J must be finished before step K can begin.
Step Z must be finished before step J can begin.
Step Z must be finished before step V can begin.
Step P must be finished before step X can begin.
Step E must be finished before step I can begin.
Step G must be finished before step L can begin.
Step G must be finished before step N can begin.
Step J must be finished before step L can begin.
Step I must be finished before step Q can begin.
Step Q must be finished before step K can begin.
Step B must be finished before step J can begin.
Step R must be finished before step T can begin.
Step Z must be finished before step K can begin.
Step J must be finished before step V can begin.
Step R must be finished before step L can begin.
Step R must be finished before step N can begin.
Step W must be finished before step Q can begin.
Step U must be finished before step W can begin.
Step Y must be finished before step V can begin.
Step C must be finished before step T can begin.
Step X must be finished before step B can begin.
Step M must be finished before step S can begin.
Step B must be finished before step K can begin.
Step D must be finished before step N can begin.
Step P must be finished before step U can begin.
Step N must be finished before step K can begin.
Step M must be finished before step K can begin.
Step C must be finished before step A can begin.
Step W must be finished before step B can begin.
Step C must be finished before step Y can begin.
Step T must be finished before step V can begin.
Step W must be finished before step M can begin.`;
const charNum = 26;

const inputArray = input.split("\n");
const regexp = /[[A-Z]{1}/g;

// PART ONE

// Get an array of entries where each entry is represented by an object
let data = inputArray.map(entry => {
  return {
    firstDo: entry.match(regexp)[1],
    thenDo: entry.match(regexp)[2]
  };
});

// Get an array with all letters
let allChars = [];
data.forEach(entry => {
  if (allChars.indexOf(entry.firstDo) === -1) {
    allChars.push(entry.firstDo);
  }
  if (allChars.indexOf(entry.thenDo) === -1) {
    allChars.push(entry.thenDo);
  }
});
allChars = allChars.sort();

// PART ONE

// Create an empty array which will contain the steps order
let instructionsOrder = [];
// Create copies of the data and of the array of letters for the 1st part
let dataOne = data.slice();
let allCharsOne = allChars.slice();

// The outher loop will run until all letters are listed in instructionsOrder
while (instructionsOrder.length < charNum) {
  let i = 0;
  // The inner loop will run until we have data to process
  while (dataOne.length > 0) {
    // Analyze each letter to find out if there is an entry that says that
    // current task letter requires another task first
    const letter = allCharsOne[i];
    const requiredTasks = dataOne.find(entry => {
      return entry.thenDo === letter;
    });
    // In case no required task is found, the letter is added at the end of instructionsOrder,
    // and is removed by the letters array.
    // Also, any task that had that letter as requirement will be removed from data,
    // as the requirement has been fulfilled.
    if (!requiredTasks) {
      instructionsOrder.push(letter);
      allCharsOne = allCharsOne.filter(letterTwo => letterTwo !== letter);
      dataOne = dataOne.filter(entryTwo => entryTwo.firstDo !== letter);
      // In case a letter was added, start analyze from the first letter still available
      // in an alphabetic order
      i = 0;
    } else {
      // Otherwise, proceed to the next letter
      i++;
    }
  }
  // In case all data has been processed and deleted, add the remaining letters
  // to instructionsOrder in alphabetical order
  if (dataOne.length === 0) {
    allCharsOne.forEach(char => instructionsOrder.push(char));
  }
}

instructionsOrder = instructionsOrder.join("");
console.log(`The first answer is: ${instructionsOrder}`);

// PART TWO

// Create a copy of the original data to use for this part
let dataTwo = data.slice();
// Create a new array where to push the steps in order
let instructionsOrderTwo = [];

// Create an object containing each letter and the time needed
// for them to be completed
let allCharsPlus = allChars.map((letter, index) => {
  const requiredSteps = [];
  const time = index + 60 + 1;
  data.forEach(entry => {
    if (entry.thenDo === letter) {
      requiredSteps.push(entry.firstDo);
    }
  });
  return { letter: letter, time: time, requiredSteps: requiredSteps };
});

// Create an array of elves where to temporarily store the current tasks
// and the remaining time for them to be free to take on a new one.
// The JustConcludedTask flag solves an issue where the time would be calculated incorrectly
// in case an elf takes on more task each loop
let elves = [
  { currentTask: "none", justConcludedTask: false },
  { currentTask: "none", justConcludedTask: false },
  { currentTask: "none", justConcludedTask: false },
  { currentTask: "none", justConcludedTask: false },
  { currentTask: "none", justConcludedTask: false }
];

// Variable used to keep track of the elapsed time
let totTime = 0;

// The outher loop will run until all letters are listed in instructionsOrder
while (instructionsOrderTwo.length < charNum) {
  // Check if each step has their requirements already fulfilled
  // by comparing what's required with the array that stores the steps in order
  let stepsAvailable = allCharsPlus.filter(char => {
    const requirements = char.requiredSteps.filter(entry => {
      return instructionsOrderTwo.includes(entry);
    });
    if (requirements.length === char.requiredSteps.length) {
      return char;
    }
  });
  // Loop over the steps ready to be initiated
  stepsAvailable.forEach(step => {
    // Check if an elf is already working on this task
    let workingElf = elves.find(elf => {
      return elf.currentTask === step.letter;
    });
    // Case A: if an elf has already been assigned to it,
    // subtract 1 second to the time required for this task to be completed
    if (workingElf) {
      step.time--;
      console.log(
        `An elf is already working for ${step.letter}, ${
          step.time
        } seconds left.`
      );
    }
    // Case B: no elf is working on this, so get a free elf to do it.
    if (!workingElf) {
      workingElf = elves.find(elf => {
        return elf.currentTask === "none";
      });
      // If there's a free elf, then start the process.
      // Subtract one second only if this elf hasn't just finished another task,
      // ot too much might be subtracted for tasks assigned to this elf.
      if (workingElf) {
        workingElf.currentTask = step.letter;
        if (!workingElf.justConcludedTask) {
          step.time--;
        }
        // If no available elf is found, do nothing. We'll try to assign this task
        // to someone the next loop
      } else {
        console.log(
          `No elf available for ${step.letter} at the moment, ${
            step.time
          } seconds left.`
        );
      }
      console.log(
        `An elf is now working on ${step.letter} , ${step.time} seconds left.`
      );
    }
    // In case the time to complete the task has passed, add it to the completed task list,
    // delete this character from the array of characters to be checked and all the entries
    // of the original input that include this task as requirement.
    // Reset the elf's task to make it free and set the justConcludedTask flag to true
    // so that if the elf takes another task this round, no time will be subtracted
    if (step.time === 0) {
      instructionsOrderTwo.push(step.letter);
      console.log(`Adding ${step.letter}`);
      allCharsPlus = allCharsPlus.filter(char => char.letter !== step.letter);
      dataTwo = dataTwo.filter(entryTwo => entryTwo.firstDo !== step.letter);
      workingElf.currentTask = "none";
      workingElf.justConcludedTask = true;
    }
  });
  // Reset the elves flag
  elves.forEach(elf => (elf.justConcludedTask = false));
  // Add time before restarting the loop
  totTime++;
}
// In case all data has been processed and deleted, add the remaining letters
// to instructionsOrder in alphabetical order
if (dataTwo.length === 0) {
  allCharsPlus.forEach(letter => instructionsOrderTwo.push(letter.letter));
}
console.log(`The second answer is: ${totTime}`);
