const input = `46, 246
349, 99
245, 65
241, 253
127, 128
295, 69
205, 74
167, 72
103, 186
101, 242
256, 75
122, 359
132, 318
163, 219
87, 309
283, 324
164, 342
255, 174
187, 305
145, 195
69, 266
137, 239
241, 232
97, 319
264, 347
256, 214
217, 47
109, 118
244, 120
132, 310
247, 309
185, 138
215, 323
184, 51
268, 188
54, 226
262, 347
206, 260
213, 175
302, 277
188, 275
352, 143
217, 49
296, 237
349, 339
179, 309
227, 329
226, 346
306, 238
48, 163`;

// const input = `1, 1
// 1, 6
// 8, 3
// 3, 4
// 5, 5
// 8, 9`;

// Get initial array of coordinates
const inputArray = input.split("\n").map(entry => {
  entry = entry.split(",").map(num => parseInt(num));
  return { x: entry[0], y: entry[1] };
});

// MANHATTAN DISTANCE
// Given two sets of coordinates [x1, y1] and [x2, y2];
// --> (Absolute of x1-x2) + (absolute of y1-y2)
// Ex: distance btwn B and C = 1-8 + 6-3 => 7+3 => 10

// Helper function to get the Manhattan distance between two coordinates
function getManhattanDistance(coordA, coordB) {
  const ManhattanDistance =
    Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y);
  return ManhattanDistance;
}

// PART ONE

// Get highest/lowest coordinates in each directions
function findExtremities(arr) {
  const left = arr.reduce((coordA, coordB) =>
    coordA.x < coordB.x ? coordA : coordB
  );
  const right = arr.reduce((coordA, coordB) =>
    coordA.x > coordB.x ? coordA : coordB
  );
  const up = arr.reduce((coordA, coordB) =>
    coordA.y < coordB.y ? coordA : coordB
  );
  const down = arr.reduce((coordA, coordB) =>
    coordA.y > coordB.y ? coordA : coordB
  );
  const extremities = {
    left: left.x,
    right: right.x,
    up: up.y,
    down: down.y
  };
  return extremities;
}
const extremities = findExtremities(inputArray);

// Filter the input array to get a new array
// containing the coordinates that have a finite areas
function getFiniteAreasCoord(arr, coordExt) {
  let limited = arr.filter((coord, index) => {
    // Get coordinates of the current point in the perimeter
    const extremLeft = { x: coordExt.left, y: coord.y };
    const extremRight = { x: coordExt.right, y: coord.y };
    const extremUp = { x: coord.x, y: coordExt.up };
    const extremDown = { x: coord.x, y: coordExt.down };
    // Get the distance from the perimeter coordinates
    const currentCordExtremLeftMD = getManhattanDistance(coord, extremLeft);
    const currentCordExtremRightMD = getManhattanDistance(coord, extremRight);
    const currentCordExtremUpMD = getManhattanDistance(coord, extremUp);
    const currentCordExtremDownMD = getManhattanDistance(coord, extremDown);

    // get an array including all coords except this one
    const allOtherCoord = arr.slice();
    allOtherCoord.splice(index, 1);

    // get all the distances between the other cords and the perimeter coords
    const allExtremeLeftMD = allOtherCoord.map(coord =>
      getManhattanDistance(coord, extremLeft)
    );
    const allExtremeRightMD = allOtherCoord.map(coord =>
      getManhattanDistance(coord, extremRight)
    );
    const allExtremeUpMD = allOtherCoord.map(coord =>
      getManhattanDistance(coord, extremUp)
    );
    const allExtremeDownMD = allOtherCoord.map(coord =>
      getManhattanDistance(coord, extremDown)
    );

    // if there's any coords whose MD is lower
    // than the MD between the current coord and the perimeter,
    // it means that the current coords area is limited at some points.
    // eles, it would extend beyond the boundaries and be infinite
    if (
      Math.min(...allExtremeLeftMD) <= currentCordExtremLeftMD &&
      Math.min(...allExtremeRightMD) <= currentCordExtremRightMD &&
      Math.min(...allExtremeUpMD) <= currentCordExtremUpMD &&
      Math.min(...allExtremeDownMD) <= currentCordExtremDownMD
    ) {
      return coord;
    }
  });
  return limited;
}
const finiteAreaCoords = getFiniteAreasCoord(inputArray, extremities);

// Get an array of all the coordinates of the area within the extremeties
function getAllCoords(extr) {
  const allCoords = [];
  for (let i = extr.up; i <= extr.down; i++) {
    for (let j = extr.left; j <= extr.right; j++) {
      allCoords.push({ x: i, y: j });
    }
  }
  return allCoords;
}
const allCoords = getAllCoords(extremities);

// Get all the coords contained in each finite area
function getFiniteAreasCoords() {
  // loop over the coordinates that have a finite areas
  const allFiniteAreas = finiteAreaCoords.map(currentC => {
    // loop over all the coordinates in the whole perimeter
    // to see which one belongs to the currenc coord area
    let currencCoordArea = allCoords.filter(coord => {
      const currentCoordMD = getManhattanDistance(currentC, coord);

      // get an array including all coords except this one
      const allOtherCoord = inputArray.slice();
      const currentCIndex = inputArray.findIndex(
        i => i.x === currentC.x && i.y === currentC.y
      );
      allOtherCoord.splice(currentCIndex, 1);

      const allOtherCoordMD = allOtherCoord.map(otherC =>
        getManhattanDistance(otherC, coord)
      );

      if (Math.min(...allOtherCoordMD) > currentCoordMD) {
        return coord;
      }
    });
    return { coord: currentC, area: currencCoordArea };
  });
  return allFiniteAreas;
}
const allFiniteAreas = getFiniteAreasCoords();

// Get final result
const resultOne = allFiniteAreas.reduce((a, b) =>
  a.area.length > b.area.length ? a : b
);
console.log(`The first answer is: ${resultOne.area.length}`);

// PART TWO

// Make an array of an area even bigger
const allCoordTwo = getAllCoords({
  left: -0,
  right: 1000,
  up: 0,
  down: 1000
});

// Add up all the coordinates whose sums of the MDs to all the
// defined sets of coordinates is less than 10000
function getSafeArea() {
  let areaSize = 0;
  allCoordTwo.forEach(coord => {
    let count = 0;
    inputArray.forEach(input => {
      count += getManhattanDistance(coord, input);
    });
    if (count < 10000) {
      areaSize++;
    }
  });
  return areaSize;
}

const resultTwo = getSafeArea();
console.log(`The second answer is: ${resultTwo}`);
