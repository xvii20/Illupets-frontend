import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { getCurrentUser } from './getcurrentuser';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DOMPurify from 'dompurify';

export default function Register({
  alertRegistrationSuccessful,
  setAlertRegistrationSuccessful,
}) {
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [userNameValue, setUserNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [missingFieldsAlert, setMissingFieldsAlert] = useState(false);
  const [passwordDoesNotMatchAlertOpen, setPasswordDoesNotMatchAlertOpen] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let navigate = useNavigate();

  // closes the mui alert
  const handleClose = () => {
    setAlertOpen(false);
    setMissingFieldsAlert(false);
    setPasswordDoesNotMatchAlertOpen(false);
  };

  // register the user function
  const register = async (e) => {
    e.preventDefault();

    console.log(emailValue, 'emailvalue');
    if (emailValue == '' || passwordValue == '') {
      setSubmitButtonClicked(true);
      setMissingFieldsAlert(true);
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      setPasswordDoesNotMatchAlertOpen(true);
      return;
    }

    try {
      setSubmitButtonClicked(false);
      setAlertRegistrationSuccessful(true);
      const sanitizedEmailValue = DOMPurify.sanitize(emailValue);
      const sanitizedPasswordValue = DOMPurify.sanitize(passwordValue);

      const createduserinformation = await createUserWithEmailAndPassword(
        auth,
        // emailValue,
        sanitizedEmailValue,
        // passwordValue
        sanitizedPasswordValue
      );

      let userid = getCurrentUser();

      const BACKENDLOCALHOST_PATH = import.meta.env.VITE_BACKENDLOCALHOST_PATH;
      const BACKENDCLOUDSERVERURL_PATH = import.meta.env
        .VITE_BACKENDCLOUDSERVERURL_PATH;

      const response = await axios.post(
        `${BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH}/createuser`,
        {
          email: sanitizedEmailValue,
          uid: userid,
        }
      );
    } catch (error) {
      console.log(error.message);
      if (
        error.message ==
        'Firebase: Password should be at least 6 characters (auth/weak-password).'
      ) {
        setErrorMessage('Password should be atleast 6 characters');
        setAlertOpen(true);
      } else if (
        error.message == 'Firebase: Error (auth/email-already-in-use).'
      ) {
        setErrorMessage('Email already exists please choose another one');
        setAlertOpen(true);
      } else if ((error.message = 'Firebase: Error (auth/invalid-email).')) {
        setErrorMessage('The email is not a valid email address');
        setAlertOpen(true);
      }
    }
  };

  function handleEmailOnChange(e) {
    setEmailValue(e.target.value);
  }

  function handleUserNameOnChange(e) {
    setUserNameValue(e.target.value);
  }

  function handlePasswordOnChange(e) {
    setPasswordValue(e.target.value);
  }

  function handleConfirmPasswordOnChange(e) {
    setConfirmPasswordValue(e.target.value);
  }

  // const handleCheckboxChange = () => {
  //   setRememberMe(!rememberMe);
  // };

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(emailValue, 'email value');
    // console.log(passwordValue, 'password value');

    // console.log('submitted');
  }

  function handleCloseSuccessfulRegisteredAlert() {
    setAlertRegistrationSuccessful(false);
  }

  return (
    <section className="sektion">
      <Snackbar
        open={alertRegistrationSuccessful}
        // autoHideDuration={6000}
        onClose={handleCloseSuccessfulRegisteredAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ textAlign: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseSuccessfulRegisteredAlert}
          severity="success"
          sx={{ width: '100%' }}
        >
          <AlertTitle>Success</AlertTitle>
          You Have Successfully Registered Your Account!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={passwordDoesNotMatchAlertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Error</AlertTitle>
          Password Does Not Match...
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={missingFieldsAlert}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Sets Modal to be at the top center
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Error</AlertTitle>
          The Red Input Field is Empty
        </MuiAlert>
      </Snackbar>
      {/* <div className="loginheaderdiv">
        {' '}
        <h2> Loginx </h2>{' '}
      </div> */}
      <div className="usedforalignment">
        <Tooltip title="Go Back to Login Page">
          <IconButton
            sx={{
              position: 'absolute',
              left: '10px',
              top: '75px',
              '@media (max-height: 360px)': {
                top: '-4px',
              },
            }}
            onClick={function () {
              navigate('/login');
            }}
          >
            {' '}
            {/* <ArrowBackRoundedIcon /> */}
          </IconButton>
        </Tooltip>

        <div className="medialoginformdiv">
          <form className="signupform">
            <div className="createanaccountheaderdiv">
              {' '}
              {/* <h2 className="loginheader"> Signup </h2>{' '} */}
              <Typography
                variant={window.innerHeight <= 465 ? 'h6' : 'h5'}
                color="primary"
              >
                {' '}
                Create an Account
              </Typography>{' '}
            </div>

            <Stack>
              <Stack
                spacing={4}
                direction="row"
                justifyContent="center"
                sx={{
                  marginTop: '20px',
                  '@media (max-height: 460px)': {
                    marginTop: '10px',
                  },
                }}
              >
                <TextField
                  label="Email"
                  error={submitButtonClicked && emailValue === ''}
                  // helperText={
                  //   emailValue === '' && submitButtonClicked == true
                  //     ? 'Please enter your email'
                  //     : ''
                  // }
                  type="email"
                  required
                  size="small"
                  sx={{
                    marginTop: '5px',
                    backgroundColor: 'white',
                    width: '400px',
                    outline: 'none',
                    '@media (max-width: 450px)': {
                      width: '350px',
                    },
                    '@media (max-width: 376px)': {
                      width: '300px',
                    },
                    '& .MuiInput-root': {
                      borderColor:
                        submitButtonClicked && emailValue === '' ? 'red' : '',
                    },
                  }}
                  onChange={handleEmailOnChange}
                  value={emailValue}
                />
              </Stack>

              {/* <Stack spacing={4} direction="row" sx={{ marginTop: '20px' }}>
                <TextField
                  label="Username"
                  type="text"
                  error={submitButtonClicked && userNameValue === ''}
                  required
                  size="small"
                  sx={{
                    marginTop: '5px',
                    backgroundColor: 'white',
                    width: '400px',
                    outline: 'none',
                    '@media (max-width: 450px)': {
                      width: '350px',
                    },
                    '@media (max-width: 376px)': {
                      width: '300px',
                    },
                    '& .MuiInput-root': {
                      borderColor:
                        submitButtonClicked && userNameValue === ''
                          ? 'red'
                          : '',
                    },
                  }}
                  onChange={handleUserNameOnChange}
                  value={userNameValue}
                /> 
              </Stack>*/}
              <Stack spacing={4} direction="row" sx={{ marginTop: '20px' }}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  size="small"
                  error={submitButtonClicked && passwordValue === ''}
                  sx={{
                    marginTop: '5px',
                    backgroundColor: 'white',
                    width: '400px',
                    outline: 'none',
                    '@media (max-width: 450px)': {
                      width: '350px',
                    },
                    '@media (max-width: 376px)': {
                      width: '300px',
                    },
                    '& .MuiInput-root': {
                      borderColor:
                        submitButtonClicked && passwordValue === ''
                          ? 'red'
                          : '',
                    },
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

              <Stack spacing={4} direction="row" sx={{ marginTop: '20px' }}>
                <TextField
                  label="Confirm Password"
                  error={submitButtonClicked && passwordValue === ''}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  size="small"
                  sx={{
                    marginTop: '5px',
                    backgroundColor: 'white',
                    width: '400px',
                    outline: 'none',
                    '@media (max-width: 450px)': {
                      width: '350px',
                    },
                    '@media (max-width: 376px)': {
                      width: '300px',
                    },
                    '& .MuiInput-root': {
                      borderColor:
                        submitButtonClicked && confirmPasswordValue === ''
                          ? 'red'
                          : '',
                    },
                  }}
                  value={confirmPasswordValue}
                  onChange={handleConfirmPasswordOnChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
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
            </Stack>
            <div className="createanaccountcomponentloginbuttondiv">
              {' '}
              {/* <button type="submit" className="logincomponentloginbutton">
              Register
            </button>{' '} */}
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: '250px' }}
                onClick={register}
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
