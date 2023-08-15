import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Copyright from './Copyright';
// import Chat from './Chat';
import Game from './Game';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        {/* <Grid container spacing={0}>
          <Grid item xs={12} md={8} lg={8}>
            <Game />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Chat />
          </Grid>
        </Grid> */}
        <Game />
      </Box>
    </div>
  )
}

export default App
