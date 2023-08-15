import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

export default function Chat(props: any) {
  return (
    <div>
      <Box sx={{ m: 1, flexDirection: 'column' }} {...props}>
        <OutlinedInput
          id='chat_output'
          multiline={true}
          minRows={15}
          readOnly={true}
          fullWidth={true}
          sx={{ m: 1 }}
        />
        <OutlinedInput
          id='chat_input'
          placeholder='Chat'
          fullWidth={true}
          sx={{ m: 1 }}
          endAdornment={
            <InputAdornment position='end'>
              <Button variant='contained'>Send</Button>
            </InputAdornment>
          }
        />
      </Box>
    </div>
  )
}
