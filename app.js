// Tvuj original kod dle tutorialu

document.addEventListener('DOMContentLoaded', () =>{
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    'url(images/gold.svg)',
    'url(images/chinese.svg)',
    'url(images/copper.svg)',
    'url(images/silver.svg)',
    'url(images/gold.svg)'
  ]
  // const colors = [
  //   'orange',
  //   'red',
  //   'purple',
  //   'green',
  //   'blue'
  // ]
// Vykreslujes tetrominoes
  const lTetromino = [
    [1,width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4;
  let currentRotation = 0;
  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundImage = colors[random] //
    });
  }
 
 // undraw the Tetromino 
 function undraw(){
   current.forEach(index => {
     squares[currentPosition + index].classList.remove('tetromino')
     squares[currentPosition + index].style.backgroundImage = ''//
   });
 }

 // assign function to keyCodes (pokud se dotknes jakekoliv klavesy!)
 function control(e) {
   if(e.keyCode === 37){
     moveLeft();
   }
   else if(e.keyCode === 38){
     rotate();
   }
   else if(e.keyCode === 39){
     moveRight();
   }
   else if(e.keyCode === 40){
     moveDown();
   }
 }
 document.addEventListener('keyup', control);

 //move down function
 function moveDown(){
   undraw();
   currentPosition += width;
   draw();
   freeze();
 }
 //freeze function (kdyz se to dotkne dna nebo druheho bloku, tak se to zastavi)
 function freeze(){
   if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
     current.forEach(index => squares[currentPosition + index].classList.add('taken'))
     random = nextRandom;
     nextRandom = Math.floor(Math.random() * theTetrominoes.length)
     current = theTetrominoes[random][currentRotation]
     currentPosition = 4;
     draw();
     displayShape();
     addScore();
     gameOver()  
   }
 }

 //posunuti vlevo, dokud se nedotkne "steny" nebo bloku, jinak by to pokracovalo v array!
 function moveLeft(){
   undraw();
   const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

 if(!isAtLeftEdge) currentPosition -=1 

 if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
   currentPosition +=1
 }
 draw();
}
 //posunuti vravo, dokud se nedotkne "steny" nebo bloku, jinak by to pokracovalo v array!
 function moveRight(){
   undraw();
   const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

 if(!isAtRightEdge) currentPosition +=1 
 if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
   currentPosition -=1
 }
 draw();
}
///FIX ROTATION OF TETROMINOS A THE EDGE (neni v tutorialu nasel jsi v kodu) 
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()) {            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
    }
    else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  }
// rotate the tetromino
function rotate(){
  undraw();
  currentRotation ++;
  if(currentRotation === current.length) { //pokud dosahne rotaci 4 jde zpet na 0
    currentRotation = 0
  }
  current = theTetrominoes[random][currentRotation]
  checkRotatedPosition();
  draw(); 
}



// ukaze Ti dalsi tetromino v mini gridu
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// Tetrominos bez rotaci
const upNextTetrominoes = [
  [1,displayWidth+1, displayWidth*2+1, 2], //lTetromino
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
  [1, displayWidth, displayWidth+1, displayWidth*2], //tTetromino
  [0, 1, displayWidth, displayWidth+1], //oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]
// zobrazeni tvaru v mini-grid
function displayShape() {
  //remove any trace of a tetromino form the entire grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundImage = ''; //
  })
  upNextTetrominoes[nextRandom].forEach(index =>{
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom] //
  })
}

// Funkce tlacitek
startBtn.addEventListener('click', () => {
 if (timerId) {
   clearInterval(timerId)
   timerId = null
 } else {
   draw()
   timerId = setInterval(moveDown, 800)
   nextRandom = Math.floor(Math.random()*theTetrominoes.length)
   displayShape();
 }
 })
// pridavas score
 function addScore(){
   for (let i = 0; i < 199; i +=width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))) {
      score +=10
      scoreDisplay.innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundImage = ''//
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
   }
 }
 // game over
 function gameOver() {
   if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
   scoreDisplay.innerHTML = 'end'
   clearInterval(timerId)
 }
}
});