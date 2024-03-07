import React from 'react';
import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Avatar,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
  sendPasswordResetEmail,
  inMemoryPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { getCurrentUser } from './getcurrentuser';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SvgComponent from './googlesvg';
import PetsIcon from '@mui/icons-material/Pets';

import GoogleCircleIcon from './googleicon';
import DOMPurify from 'dompurify';
import axios from 'axios';

export default function Login({
  setAlertLoggedInSuccessful,
  alertLoggedInSuccessful,
  closeModal,
  setCloseModal,
}) {
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState(null);
  const [alertErrorOpen, setErrorAlertOpen] = useState(false); // used for the error modal
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [alertLoggedIn, setAlertLoggedIn] = useState(false);
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  const randomColorTwo =
    '#' + Math.floor(Math.random() * 16777215).toString(16);

  const randomColorThree =
    '#' + Math.floor(Math.random() * 16777215).toString(16);

  const randomColorFour =
    '#' + Math.floor(Math.random() * 16777215).toString(16);

  const randomColorFive =
    '#' + Math.floor(Math.random() * 16777215).toString(16);

  const [iconColor, setIconColor] = useState(randomColor);
  const [iconColorTwo, setIconColorTwo] = useState(randomColorTwo);
  const [iconColorThree, setIconColorThree] = useState(randomColorThree);
  const [iconColorFour, setIconColorFour] = useState(randomColorFour);
  const [iconColorFive, setIconColorFive] = useState(randomColorFive);
  const [iconColorSix, setIconColorSix] = useState(randomColor);

  let navigate = useNavigate();

  // closes the mui alert
  const handleErrorClose = () => {
    setErrorAlertOpen(false);
  };

  const handleIconClick = () => {
    // generates a random color when an pet paw icon is clicked
    // Updates the pet paw to the random color when clicked
    setIconColor(randomColor);
  };
  const handleIconClickTwo = () => {
    setIconColorTwo(randomColor);
  };
  const handleIconClickThree = () => {
    setIconColorThree(randomColor);
  };
  const handleIconClickFour = () => {
    setIconColorFour(randomColor);
  };

  const handleIconClickFive = () => {
    setIconColorFive(randomColor);
  };
  const handleIconClickSix = () => {
    setIconColorSix(randomColor);
  };
  const handleLoggedInClose = () => {
    setAlertLoggedInSuccessful(false);
  };

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async (isRememberMeChecked) => {
    try {
      // if the user closes the browser or navigates away from the page, they will need to sign in again when they return.
      if (isRememberMeChecked == false) {
        setPersistence(auth, browserSessionPersistence);
      }

      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      setCloseModal(false);
      // console.log(result);
      // console.log(result.user, 'here is result.user');

      // Checks if the user is signed in
      if (result.user) {
        // console.log('logged in successfully');
        //  setAlertLoggedIn(true);
        setAlertLoggedInSuccessful(true);
        let userid = getCurrentUser();

        const { email } = result.user;

        const BACKENDLOCALHOST_PATH = import.meta.env
          .VITE_BACKENDLOCALHOST_PATH;
        const BACKENDCLOUDSERVERURL_PATH = import.meta.env
          .VITE_BACKENDCLOUDSERVERURL_PATH;

        //  add googleuser to database
        const response = await axios.post(
          `${BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH}/createuser`,
          {
            email: email,
            uid: getCurrentUser(),
          }
        );
        // console.log(response, 'responseq');

        navigate(`/`);
      } else {
        // console.log('authentication failed');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  function handleEmailOnChange(e) {
    setEmailValue(e.target.value); // access the current value of the email input field.
  }

  function handlePasswordOnChange(e) {
    setPasswordValue(e.target.value); // access the current value of the email input field.
  }

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  // for the signinWithEmailandPassword.  this is not the google sign in. this is the original login
  async function handleSubmit(e) {
    e.preventDefault();
    const sanitizedEmailValue = DOMPurify.sanitize(emailValue);
    const sanitizedPasswordValue = DOMPurify.sanitize(passwordValue);

    if (rememberMe == false) {
      setPersistence(auth, browserSessionPersistence);
    }

    try {
      let result = await signInWithEmailAndPassword(
        auth,
        // emailValue,
        sanitizedEmailValue,
        // passwordValue
        sanitizedPasswordValue
      );
      // console.log('Sign in successful!');
      setAlertLoggedInSuccessful(true);
      let uid = getCurrentUser();
      // navigate(`/dashboard/${uid}`);
      setCloseModal(false);
    } catch (error) {
      // console.error('Error signing in:', error);
      console.log(error.message);
      if (error.message == 'Firebase: Error (auth/invalid-credential).') {
        setErrorMessage('Wrong Password or Email');
        setErrorAlertOpen(true);
      }

      if (error.message == 'Firebase: Error (auth/invalid-email).') {
        setErrorMessage('The Contents In The Email Input Is Not A Valid Email');
        setErrorAlertOpen(true);
      }
    }
  }

  return (
    <section className="sektion">
      <Snackbar
        open={alertErrorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ textAlign: 'center' }}
      >
        <MuiAlert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </MuiAlert>
      </Snackbar>

      <Paper
        elevation={4}
        className="loginformdiv"
        sx={{
          borderRadius: '6px',
          '@media (max-width: 523px)': {
            width: '450px',
          },
          '@media (max-width: 465px)': {
            width: '415px',
          },
          '@media (max-width: 424px)': {
            width: '370px',
          },
          '@media (max-width: 376px)': {
            width: '320px',
          },
          '@media (max-width: 331px)': {
            width: '310px',
          },
        }}
      >
        {/* <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-50deg)`,
            top: 40,
            right: 20,
            cursor: 'pointer',
            color: iconColorFive,
          }}
          onClick={handleIconClickFive}
        />

        <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-50deg)`,
            top: 10,
            right: 10,
            cursor: 'pointer',
            color: iconColorSix,
          }}
          onClick={handleIconClickSix}
        /> */}

        <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-45deg)`,
            top: 10,
            left: 30,
            cursor: 'pointer',
            color: iconColor,
          }}
          onClick={handleIconClick}
        />

        <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-45deg)`,
            top: 40,
            left: 40,
            cursor: 'pointer',
            color: iconColorThree,
          }}
          onClick={handleIconClickThree}
        />
        <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-45deg)`,
            bottom: 290,
            right: 38,
            cursor: 'pointer',
            color: iconColorTwo,
          }}
          onClick={handleIconClickTwo}
        />

        <PetsIcon
          sx={{
            position: 'absolute',
            transform: `rotate(-45deg)`,
            bottom: 260,
            right: 24,
            cursor: 'pointer',
            color: iconColorFour,
          }}
          onClick={handleIconClickFour}
        />
        {/* <div className="loginformdiv"> */}
        <form onSubmit={handleSubmit}>
          <div className="loginheaderdiv">
            {' '}
            {/* <h2 className="loginheader"> Login </h2>{' '} */}
            <Typography variant="h5"> Login</Typography>{' '}
          </div>

          <Stack
            spacing={4}
            direction="row"
            justifyContent="center"
            sx={{ marginTop: '20px' }}
          >
            <TextField
              label="Email"
              type="text"
              required
              size="small"
              sx={{
                border: 'none',
                marginTop: '5px',
                backgroundColor: 'white',
                width: '400px',
                outline: 'none',
                borderBottom: '2px solid black',

                '@media (max-width: 424px)': {
                  width: '350px',
                },
                '@media (max-width: 376px)': {
                  width: '300px',
                },
                '& fieldset': { border: 'none' },
              }}
              onChange={handleEmailOnChange}
              value={emailValue}
            />
          </Stack>

          <div className="form-group">
            <Stack
              spacing={4}
              direction="row"
              justifyContent="center"
              sx={{ marginTop: '20px' }}
            >
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                size="small"
                sx={{
                  marginTop: '5px',
                  backgroundColor: 'white',
                  width: '400px',
                  outline: 'none',
                  borderBottom: '2px solid black',
                  '@media (max-width: 424px)': {
                    width: '350px',
                  },
                  '@media (max-width: 376px)': {
                    width: '300px',
                  },
                  '& fieldset': { border: 'none' },
                }}
                value={passwordValue}
                onChange={handlePasswordOnChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon />
                        ) : (
                          <VisibilityRoundedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <div className="logincomponentremembermediv">
              {' '}
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                id="logincomponentcheckbox"
              />{' '}
              <label htmlFor="logincomponentcheckbox"> Remember Me </label>{' '}
              <p
                className="mediaforgotyourpasswordforlogincomponent"
                onClick={function () {
                  navigate('/forgotpassword');
                }}
              >
                {' '}
                Forgot Your Password?{' '}
              </p>{' '}
            </div>
          </div>

          <div className="forgotyourpasswordforlogincomponentdiv">
            {' '}
            <p
              className="forgotyourpasswordforlogincomponent"
              onClick={function () {
                navigate('/forgotpassword');
              }}
              style={{ width: 'fit-content' }}
            >
              {' '}
              Forgot Your Password?{' '}
            </p>{' '}
          </div>

          <div className="logincomponentloginbuttondiv">
            {' '}
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="logincomponentloginbutton"
            >
              Login
            </Button>{' '}
          </div>

          <div className="googlebuttondiv">
            <div className="medialogincomponentloginbuttondiv">
              {' '}
              <button type="submit" className="medialogincomponentloginbutton">
                Login
              </button>{' '}
            </div>

            <Stack
              sx={{ marginBottom: '10px', marginTop: '20px' }}
              display="flex"
              direction="row"
              justifyContent="center"
            >
              <Typography> Or Sign Up Using </Typography>{' '}
            </Stack>

            <Stack>
              <button
                className="gsi-material-button"
                onClick={async function () {
                  let finalresult = await signInWithGoogle(rememberMe);
                  // console.log(finalresult, 'finalresult');
                }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <GoogleCircleIcon />
                  </div>
                  <span style={{ display: 'none' }}>Sign in with Google</span>
                </div>
              </button>
            </Stack>

            {/* <button
              className="gsi-material-button"
              onClick={async function () {
                let finalresult = await signInWithGoogle(rememberMe);
                console.log(finalresult, 'finalresult');
              }}
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <SvgComponent />
                </div>
                <span className="gsi-material-button-contents">
                  Sign in with Google
                </span>
                <span style={{ display: 'none' }}>Sign in with Google</span>
              </div>
            </button> */}
          </div>
          <div className="createanaccountdiv">
            {' '}
            Don't have an account?{' '}
            <span
              onClick={() => {
                navigate('/register');
              }}
            >
              {' '}
              Sign Up
            </span>
          </div>
        </form>
        {/* </div> */}
      </Paper>
    </section>
  );
}
