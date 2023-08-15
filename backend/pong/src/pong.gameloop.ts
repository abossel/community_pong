var _gameLoopRun: boolean = false;
var _gameLoopFunc: (delta: number) => void;
var _gameLoopPrev: number;
var _gameLoopID: any;

export function startGameLoop(callback: (delta: number) => void)
{
  if (_gameLoopRun)
    return;

  _gameLoopRun = true;
  _gameLoopFunc = callback;
  _gameLoopPrev = Date.now();
  _gameLoopID = setInterval(gameLoop, 50);
}

export function stopGameLoop()
{
  if (!_gameLoopRun)
    return;

  _gameLoopRun = false;
  clearInterval(_gameLoopID);
}

function gameLoop()
{
  var now: number = Date.now();
  _gameLoopFunc(now - _gameLoopPrev);
  _gameLoopPrev = now;
}
