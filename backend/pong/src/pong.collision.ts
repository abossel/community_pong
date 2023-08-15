import { GameState, Vector } from './pong.interface';
import { Pong } from './pong.enum';

export function gameDeltaUpdate(state: GameState, delta: number)
  : GameState
{
  var seconds: number = delta / 1000;

  state.player1.position.y += (seconds * Pong.BAT_SPEED * state.player1.direction.y);
  state.player2.position.y += (seconds * Pong.BAT_SPEED * state.player2.direction.y);
  state.ball.position.x += (seconds * Pong.BALL_SPEED * state.ball.direction.x);
  state.ball.position.y += (seconds * Pong.BALL_SPEED * state.ball.direction.y);

  return state;
}

export function batWithWallCollision(state: GameState)
  : GameState
{
  var halfbat: number = Pong.SQUARE_SIZE * Pong.BAT_SIZE / 2;

  if (state.player1.position.y < halfbat)
    state.player1.position.y = halfbat;
  if (state.player1.position.y > 1 - halfbat)
    state.player1.position.y = 1 - halfbat;

  if (state.player2.position.y < halfbat)
    state.player2.position.y = halfbat;
  if (state.player2.position.y > 1 - halfbat)
    state.player2.position.y = 1 - halfbat;

  return state;
}

export function ballWithWallCollision(state: GameState)
  : GameState
{
  var halfsquare: number = Pong.SQUARE_SIZE / 2;

  if (state.ball.position.y < halfsquare)
  {
    state.ball.position.y = halfsquare;
    state.ball.direction.y = -state.ball.direction.y;
    state.update = true;
  }
  else if (state.ball.position.y > 1 - halfsquare)
  {
    state.ball.position.y = 1 - halfsquare;
    state.ball.direction.y = -state.ball.direction.y;
    state.update = true;
  }

  return state;
}

export function ballWithBatCollision(state: GameState)
  : GameState
{
  var halfsquare: number = Pong.SQUARE_SIZE / 2;
  var halfbat: number = Pong.SQUARE_SIZE * Pong.BAT_SIZE / 2;

  if (state.ball.position.x - halfsquare < state.player1.position.x + halfsquare &&
      state.ball.position.x - halfsquare > state.player1.position.x)
  {
    if ((state.ball.position.y - halfsquare < state.player1.position.y + halfbat &&
        state.ball.position.y - halfsquare > state.player1.position.y - halfbat) ||
        (state.ball.position.y + halfsquare < state.player1.position.y + halfbat &&
        state.ball.position.y + halfsquare > state.player1.position.y - halfbat))
    {
      state.ball.position.x = state.player1.position.x + Pong.SQUARE_SIZE;
      state.ball.direction.x = -state.ball.direction.x;
      state.update = true;
    }
  }

  if (state.ball.position.x + halfsquare > state.player2.position.x - halfsquare &&
      state.ball.position.x + halfsquare < state.player2.position.x)
  {
    if ((state.ball.position.y - halfsquare < state.player2.position.y + halfbat &&
        state.ball.position.y - halfsquare > state.player2.position.y - halfbat) ||
        (state.ball.position.y + halfsquare < state.player2.position.y + halfbat &&
        state.ball.position.y + halfsquare > state.player2.position.y - halfbat))
    {
      state.ball.position.x = state.player2.position.x - Pong.SQUARE_SIZE;
      state.ball.direction.x = -state.ball.direction.x;
      state.update = true;
    }
  }

  return state;
}

export function player1Lose(state: GameState)
  : boolean
{
  if (state.ball.position.x < state.player1.position.x - (Pong.SQUARE_SIZE * 3))
    return true;
  return false;
}

export function player2Lose(state: GameState)
  : boolean
{
  if (state.ball.position.x > state.player2.position.x + (Pong.SQUARE_SIZE * 3))
    return true;
  return false;
}
