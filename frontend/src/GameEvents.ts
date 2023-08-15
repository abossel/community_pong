import {
  io,
  Socket,
} from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  GameInstruction,
  GameState,
} from '../../backend/pong/src/pong.interface';
import {
    Keypress,
    Phase,
    Pong,
} from '../../backend/pong/src/pong.enum';
import {
  render,
} from './GameRender';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');

var _state: GameState = {
  player1: {
    position: { x: -Pong.BAT_OFFSET, y: 0.5, },
    direction: { x: 0, y: 0, },
    score: 0,
  },
  player2: {
    position: { x: Pong.BAT_OFFSET, y: 0.5, },
    direction: { x: 0, y: 0, },
    score: 0,
  },
  ball: {
    position: { x: 0, y: 0, },
    direction: { x: 0, y: 0, },
    visible: false,
  },
  phase: Phase.waiting,
  update: false,
};

var _prevTime: number = Date.now();

socket.on('pong_state', (e) => {
  _state = e;
	console.log(e);
});

export function sendKeyUp()
{
  var payload: GameInstruction = { keypress: Keypress.up };

  socket.emit('pong_keypress', payload);
}

export function sendKeyDown()
{
  var payload: GameInstruction = { keypress: Keypress.down };

  socket.emit('pong_keypress', payload);
}

export function sendKeyRelease()
{
  var payload: GameInstruction = { keypress: Keypress.release };

  socket.emit('pong_keypress', payload);
}

export function clickPlayer1()
{
  var payload: GameInstruction = { keypress: Keypress.player1 };

  socket.emit('pong_keypress', payload);
}

export function clickPlayer2()
{
  var payload: GameInstruction = { keypress: Keypress.player2 };

  socket.emit('pong_keypress', payload);
}

export function clickStart()
{
  var payload: GameInstruction = { keypress: Keypress.start };

  socket.emit('pong_keypress', payload);
}

function loop(now: number)
{
	var canvas = <HTMLCanvasElement>document.querySelector('#game_canvas');
	var delta = now - _prevTime;

  if (canvas != null)
	  render(canvas, _state, delta);

	_prevTime = now;
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
