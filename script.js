// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// mk
let mkWidth = 41;
let mkHeight = 57;
let mkX = 50;
let mkY = boardHeight - mkHeight;
let mkImg;

let mk = {
  x: mkX,
  y: mkY,
  width: mkWidth,
  height: mkHeight,
};

// candles
let candlesArray = [];

let candle1Width = 28;
let candle2Width = 100;
let candle3Width = 68;

let candleHeight = 100;
let candleX = 700;
let candleY = boardHeight - candleHeight;

let candle1Img;
let candle2Img;
let candle3Img;

//physics
let velocityX = -6;
let velocityY = 0;
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext('2d');

  //   context.fillStyle = 'green';
  //   context.fillRect(mk.x, mk.y, mk.width, mk.height);

  mkImg = new Image();
  mkImg.src = 'mk.png';
  mkImg.onload = function () {
    context.drawImage(mkImg, mk.x, mk.y, mk.width, mk.height);
  };

  candle1Img = new Image();
  candle1Img.src = 'candle01.png';

  candle2Img = new Image();
  candle2Img.src = 'candle02.png';

  candle3Img = new Image();
  candle3Img.src = 'candle03.png';

  requestAnimationFrame(update);
  setInterval(placeCandles, 500); //1000 milliseconds = 1 sec
  document.addEventListener('keydown', moveMk);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  //mk
  velocityY += gravity;
  mk.y = Math.min(mk.y + velocityY, mkY); //apply gravity to current mk.y, making sure it doesn't exceed the ground
  context.drawImage(mkImg, mk.x, mk.y, mk.width, mk.height);

  //candles
  for (let i = 0; i < candlesArray.length; i++) {
    let candle = candlesArray[i];
    candle.x += velocityX;

    context.drawImage(
      candle.img,
      candle.x,
      candle.y,
      candle.width,
      candle.height,
    );

    if (detectCollision(mk, candle)) {
      gameOver = true;
      mkImg.src = 'mkdead.png';
      mkImg.onload = function () {
        context.drawImage(mkImg, mk.x, mk.y, mk.width, mk.height);
      };
    }
  }

  //score
  context.fillStyle = 'black';
  context.font = '20px courier';
  score++;
  context.fillText(score, 5, 20);

  //gameover
  context.fillStyle = 'red';
  context.font = '30px courier bold';
  gameOverText = 'It is over! Jeets Won!';

  if (gameOver == true) {
    context.fillText(gameOverText, 250, 70);
  }
}

function moveMk(e) {
  if (gameOver) {
    return;
  }

  if (
    (e.code == 'Space' || e.keyCode == 32 || e.code == 'ArrowUp') &&
    mk.y == mkY
  ) {
    //jump
    velocityY = -10;
  }
}

function placeCandles() {
  if (gameOver) {
    return;
  }

  // place candles
  let candle = {
    img: null,
    x: candleX,
    y: candleY,
    width: null,
    height: candleHeight,
  };

  let placeCandlesChance = Math.random();

  if (placeCandlesChance > 0.9) {
    candle.img = candle3Img;
    candle.width = candle3Width;
    candlesArray.push(candle);
  } else if (placeCandlesChance > 0.7) {
    candle.img = candle2Img;
    candle.width = candle2Width;
    candlesArray.push(candle);
  } else if (placeCandlesChance > 0.5) {
    candle.img = candle1Img;
    candle.width = candle1Width;
    candlesArray.push(candle);
  }

  if (candlesArray.length > 5) {
    candlesArray.shift(); //Remove the first element from the array so that the array doesn't constanly grow
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && // a's top right coner passes b's top left corner
    a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y // a's bottom left corner passes b's top left corner
  );
}
