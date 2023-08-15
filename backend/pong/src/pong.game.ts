import { Server } from 'socket.io';
import {
  GameUser,
  GameState,
} from './pong.interface';
import {
  Pong,
  Phase,
  Keypress,
} from './pong.enum';
import {
  startGameLoop,
  stopGameLoop,
} from './pong.gameloop';
import {
  gameDeltaUpdate,
  batWithWallCollision,
  ballWithWallCollision,
  ballWithBatCollision,
  player1Lose,
  player2Lose,
} from './pong.collision';

let _pongUsers = new Map<string, GameUser>();
let _pongState = new Map<string, GameState>();
let _pongServer: Server;

export function setServer(server: Server)
{
  _pongServer = server;
}

export function addGameUser(
  id: string,
  name: string,
  room: string,
)
{
  // add the user to the user list
  var user: GameUser = {
    id: id,
    name: name,
    room: room,
    team: Keypress.viewer,
    keypress: Keypress.release,
  };
  _pongUsers.set(id, user);

  // create the room if it doesn't exist
  if (!_pongState.has(room))
    resetGameState(room);

  // start the game loop
  startGameLoop(gameUpdate);
}

export function deleteGameUser(
  id: string,
)
{
  // get a copy of the room name
  var room: string = _pongUsers.get(id).room;

  // delete the user
  _pongUsers.delete(id);

  // if the room is not empty then return
  for (let user of _pongUsers.values())
  {
    if (user.room == room)
      return;
  }

  // delete the room
  _pongState.delete(room);

  // if there are no room stop the loop
  if (_pongState.size == 0)
    stopGameLoop();
}

function gameUpdate(delta: number)
{
  for (let [room, state] of _pongState)
  {
    state.update = false;
    state = gameDeltaUpdate(state, delta);
    state = batWithWallCollision(state);
    state = ballWithWallCollision(state);
    state = ballWithBatCollision(state);
    _pongState.set(room, state);
    if (player1Lose(state))
    {
      state.player2.score++;
      setGamePhase(room, Phase.waiting);
      hideGameBall(room);
      state.update = true;
    }
    if (player2Lose(state))
    {
      state.player1.score++;
      setGamePhase(room, Phase.waiting);
      hideGameBall(room);
      state.update = true;
    }
    if (state.update)
      sendGameState(_pongServer, room);
  }
}

export function setGameUserTeam(
  id: string,
  team: string,
)
{
  var user: GameUser = _pongUsers.get(id);
  user.team = team;
  _pongUsers.set(id, user);
}

export function setGamePhase(
  room: string,
  phase: string,
)
{
  var state: GameState = _pongState.get(room);
  state.phase = phase;
  _pongState.set(room, state);
}

export function resetGameBall(
  room: string,
)
{
  var state: GameState = _pongState.get(room);
	var angle = Math.random() * (Math.PI / 4);

  state.ball.position.x = 0.2;
  state.ball.position.y = 0.5;
  state.ball.direction.x = -Math.cos(angle) * Pong.BALL_SPEED;
  state.ball.direction.y = Math.sin(angle) * Pong.BALL_SPEED;
  state.ball.visible = true;
  _pongState.set(room, state);
}

export function hideGameBall(
  room: string,
)
{
  var state: GameState = _pongState.get(room);

  state.ball.position.x = 0;
  state.ball.position.y = 0.5;
  state.ball.direction.x = 0;
  state.ball.direction.y = 0;
  state.ball.visible = false;
  _pongState.set(room, state);
}

export function resetGameState(
  room: string,
)
{
  var state: GameState = {
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
      position: { x: 0, y: -1, },
      direction: { x: 0, y: 0, },
      visible: false,
    },
    phase: Phase.waiting,
    update: false,
  };

  _pongState.set(room, state);
}

export function sendGameState(
  server: Server,
  room: string,
)
{
  server.to(room).emit('pong_state', _pongState.get(room));
  console.log(_pongState.get(room))
}

function clamp1(n: number)
  : number
{
  if (n >= 1)
    return 1;
  if (n <= -1)
    return -1;
  return 0;
}

export function receiveGameKeypress(
  server: Server,
  id: string,
  keypress: string,
)
{
  var update:boolean = false;
  var direction1:number;
  var direction2:number;

  // check if user exists;
  if (!_pongUsers.has(id))
    return;

  var user: GameUser = _pongUsers.get(id);

  // if keypress is the same then no change to game state
  if (user.keypress == keypress)
    return;

  // change the user keypress state
  user.keypress = keypress;

  // if user selects team set team
  if (keypress == Keypress.player1 && user.team == Keypress.viewer)
  {
    user.team = Keypress.player1;
    update = true;
  }

  if (keypress == Keypress.player2 && user.team == Keypress.viewer)
  {
    user.team = Keypress.player2;
    update = true;
  }

  _pongUsers.set(id, user);

  // if user clicks start game
  if (keypress == Keypress.start && user.team != Keypress.viewer &&
      _pongState.get(user.room).phase == Phase.waiting)
  {
    for (let other of _pongUsers.values())
    {
      if (other.team != user.team && other.team != Keypress.viewer)
      {
        resetGameBall(user.room);
        setGamePhase(user.room, Phase.play);
        update = true;
      }
    }
  }

  if (update)
  {
    sendGameState(server, user.room);
    return;
  }

  // recalculate the current direction for all users in that room
  direction1 = 0;
  direction2 = 0;

  for (let other of _pongUsers.values())
  {
    if (other.room == user.room)
    {
      if (other.keypress == Keypress.up)
      {
        if (other.team == Keypress.player1)
          direction1--;
        else if (other.team == Keypress.player2)
          direction2--;
      }
      else if (other.keypress == Keypress.down)
      {
        if (other.team == Keypress.player1)
          direction1++;
        else if (other.team == Keypress.player2)
          direction2++;
      }
    }
  }

  // clamp directions between 1 and -1
  direction1 = clamp1(direction1);
  direction2 = clamp1(direction2);

  var state: GameState = _pongState.get(user.room);
  // if directions haven't changed return
  if (direction1 == state.player1.direction.y &&
      direction2 == state.player2.direction.y)
    return ;

  // change the direction of the player based on the inputs
  state.player1.direction.y = direction1;
  state.player2.direction.y = direction2;
  _pongState.set(user.room, state);

  sendGameState(server, user.room);
}
