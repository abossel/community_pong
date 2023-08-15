import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  sendKeyUp,
  sendKeyDown,
  sendKeyRelease,
  clickPlayer1,
  clickPlayer2,
  clickStart,
} from './GameEvents'

export default function Game(props: any) {
  return (
    <div>
      <Box sx={{ m: 1, flexDirection: 'column' }} {...props}>
        <Box sx={{ m: 1, border: 1 }}>
          <canvas id='game_canvas' width='640' height='480'></canvas>
        </Box>
        <Box sx={{ m: 0, flexDirection: 'row' }} {...props}>
          <Button id='player_up' variant='contained' onMouseDown={sendKeyUp} onMouseUp={sendKeyRelease} sx={{ m: 1 }}>⬆</Button>
          <Button id='player_dn' variant='contained' onMouseDown={sendKeyDown} onMouseUp={sendKeyRelease} sx={{ m: 1 }}>⬇</Button>
        </Box>
        <Box sx={{ m: 0, flexDirection: 'row' }} {...props}>
          <Button id='player1' variant='contained' onClick={clickPlayer1} sx={{ m: 1 }}>Player 1</Button>
          <Button id='player2' variant='contained' onClick={clickPlayer2} sx={{ m: 1 }}>Player 2</Button>
        </Box>
        <Button id='game_start' variant='contained' onClick={clickStart} sx={{ m: 1 }}>Start</Button>
      </Box>
    </div>
  )
}
