import {
  Pong,
} from '../../backend/pong/src/pong.enum';
import {
  GameState,
} from '../../backend/pong/src/pong.interface';
import {
  gameDeltaUpdate,
  batWithWallCollision,
  ballWithWallCollision,
  ballWithBatCollision,
} from '../../backend/pong/src/pong.collision';

function drawBackground(canvas: HTMLCanvasElement)
{
  var canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    canvas2d.fillStyle = "#000000";
    canvas2d.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawSquare(canvas: HTMLCanvasElement, x: number, y: number)
{
  var canvas2d = canvas.getContext("2d");
  var square = canvas.height * Pong.SQUARE_SIZE;
  var halfsquare = square / 2;

  if (canvas2d != null)
  {
    canvas2d.fillStyle = "#ffffff";
    canvas2d.fillRect(Math.round((canvas.width / 2) + (x * canvas.height) - halfsquare),
                      Math.round((y * canvas.height) - halfsquare),
                      Math.round(square), Math.round(square));
  }
}

function drawBat(canvas: HTMLCanvasElement, x: number, y: number)
{
  var limit = Math.floor(Pong.BAT_SIZE / 2);

  drawSquare(canvas, x, y);
  while (limit > 0)
  {
    drawSquare(canvas, x, y - (Pong.SQUARE_SIZE * limit));
    drawSquare(canvas, x, y + (Pong.SQUARE_SIZE * limit));
    limit--;
  }
}

function drawNet(canvas: HTMLCanvasElement)
{
  var canvas2d = canvas.getContext("2d");

  if (canvas2d != null)
  {
    for (var height: number = 0; height < 1 + Pong.SQUARE_SIZE; height += Pong.SQUARE_SIZE * 2)
      drawSquare(canvas, 0, height);
  }
}

function drawNumberSquares(canvas: HTMLCanvasElement, x: number, y: number, num: number[][], print: boolean)
{
  var canvas2d = canvas.getContext("2d");
  var width = num[0].length;
  var height = num.length;

  if (canvas2d != null)
  {
    canvas2d.fillStyle = "#ffffff";
    for (var ys = 0; ys < height; ys++)
    {
      for (var xs = 0; xs < width; xs++)
      {
        if (print && num[ys][xs] == 1)
          drawSquare(canvas, x + (xs * Pong.SQUARE_SIZE), y + (ys * Pong.SQUARE_SIZE));
      }
    }
  }
  return (width * Pong.SQUARE_SIZE);
}

function drawNumberSingle(canvas: HTMLCanvasElement, x: number, y: number, n: number, print: boolean)
{
  var num = [ [0],
              [0],
              [0],
              [0],
              [0] ];

  switch (n)
  {
    case 0:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 1:
      num = [ [1],
              [1],
              [1],
              [1],
              [1] ];
      break;
    case 2:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1] ];
      break;
    case 3:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case 4:
      num = [ [1, 0, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case 5:
      num = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [0, 0, 1],
              [1, 1, 1] ];
      break;
    case 6:
      num = [ [1, 1, 1],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 7:
      num = [ [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
    case 8:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1] ];
      break;
    case 9:
      num = [ [1, 1, 1],
              [1, 0, 1],
              [1, 1, 1],
              [0, 0, 1],
              [0, 0, 1] ];
      break;
  }
  return (drawNumberSquares(canvas, x, y, num, print));
}

function drawNumber(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  var str = n.toString();
  var len = str.length;
  var off = 0;
  var hsq = Pong.SQUARE_SIZE / 2;

  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawNumberSingle(canvas, x + off + hsq, y + hsq, -1, true);
    off += drawNumberSingle(canvas, x + off + hsq, y + hsq, parseInt(str[i]), true);
  }
}

function drawNumberRev(canvas: HTMLCanvasElement, x: number, y: number, n: number)
{
  var str = n.toString();
  var len = str.length;
  var off = 0;

  // this loop measures the length of the offset
  for (var i = 0; i < len; i++)
  {
    if (i != 0)
      off += drawNumberSingle(canvas, x + off, y, -1, false);
    off += drawNumberSingle(canvas, x + off, y, parseInt(str[i]), false);
  }
  // draw the number with the offset
  drawNumber(canvas, x - off - (Pong.SQUARE_SIZE / 2), y, n);
}

export function render(canvas: HTMLCanvasElement, state: GameState, delta: number)
{
  state = gameDeltaUpdate(state, delta);
  state = batWithWallCollision(state);
  state = ballWithWallCollision(state);
  state = ballWithBatCollision(state);

  drawBackground(canvas);
  drawNet(canvas);
  drawNumberRev(canvas, -Pong.SCORE_OFFSET, Pong.SCORE_OFFSET, state.player1.score);
  drawNumber(canvas, Pong.SCORE_OFFSET, Pong.SCORE_OFFSET, state.player2.score);
  drawBat(canvas, state.player1.position.x, state.player1.position.y);
  drawBat(canvas, state.player2.position.x, state.player2.position.y);
  if (state.ball.visible)
    drawSquare(canvas, state.ball.position.x, state.ball.position.y);
}
