import React from 'react';
import {
  Stack,
  Typography,
  IconButton,
  Box,
  Paper,
  TextField,
  Button,
  Link,
  Tooltip,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

export default function Forgotpassword() {
  const [emailValue, setEmailValue] = useState('');
  const [openEmailHasBeenSentModal, setOpenEmailHasBeenSentModal] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setEmailValue(e.target.value);
  }

  // password reset
  async function handleSubmit(e) {
    e.preventDefault();

    // console.log(emailValue, 'email value');

    try {
      auth.useDeviceLanguage();

      let response = await sendPasswordResetEmail(auth, emailValue);
      // console.log('email has been sent');

      setOpenEmailHasBeenSentModal(true);
      // console.log(response, 'response ');
    } catch (error) {
      // console.log(error);
    }
  }

  // closes the mui alert
  const handleClose = () => {
    setOpenEmailHasBeenSentModal(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Stack
        sx={{
          position: 'relative',
          width: '600px',
          marginTop: '75px',
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Go Back to Login Page">
          <IconButton
            sx={{ position: 'absolute', left: '10px', top: '20px' }}
            onClick={function () {
              navigate('/login');
            }}
          >
            {' '}
            <ArrowBackRoundedIcon />
          </IconButton>
        </Tooltip>

        <form onSubmit={handleSubmit}>
          <Stack sx={{ marginTop: '100px' }} spacing={2}>
            <Stack
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              sx={{
                paddingLeft: '10px',
                '@media (max-width: 337px)': {
                  paddingLeft: '20px',
                  paddingRight: '10px',
                },
              }}
            >
              <Typography sx={{}}>
                A reset password link will be sent to your E-mail address
              </Typography>
            </Stack>
            <Stack display="flex" alignItems="center">
              <TextField
                label="Enter your email"
                required
                type="email"
                size="small"
                value={emailValue}
                onChange={handleChange}
                sx={{
                  backgroundColor: '#fdfdfd',
                  width: '400px',
                  '@media (max-width: 429px)': {
                    width: '350px',
                  },
                  '@media (max-width: 365px)': {
                    width: '300px',
                  },
                }}
              >
                {' '}
              </TextField>
            </Stack>
            <Stack display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                sx={{
                  // backgroundColor: 'black',
                  width: '300px',
                  marginTop: '10px',
                  // '&:hover': {
                  //   backgroundColor: '#333333',
                  // },
                }}
              >
                {' '}
                Reset Password{' '}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
      <Snackbar
        open={openEmailHasBeenSentModal}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="success"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Reset Link Has Been Sent</AlertTitle>
          The Password Reset Link Has Been Successfully Sent To The Email
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
