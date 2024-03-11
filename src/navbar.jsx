import React from 'react';
import SvgComponent from './svg';
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Drawer,
  Link,
  Skeleton,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// // Alert titles
// import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  FacebookAuthProvider,
  browserSessionPersistence,
  setPersistence,
  sendPasswordResetEmail,
  inMemoryPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { getCurrentUser } from './getcurrentuser';
import { logOut } from './firebase';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockIcon from '@mui/icons-material/Lock';

export default function Navbar({
  gridView,
  setGridView,
  mapView,
  setMapView,
  closeModal,
  setCloseModal,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPic, setUserPic] = useState('');
  const [alertLoggedOutOpen, setAlertLoggedOutOpen] = useState(false);
  const [favoritesBlockedModal, setFavoritesBlockedModal] = useState(false);

  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        //
        setUserEmail(data.email);

        setSkeletonLoading(false);
      } else {
        setSkeletonLoading(false);
      }
    });
  }, []);

  const open = Boolean(anchorEl);

  // console.log(window.location.pathname);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // closes the mui alert
  const handleCloseLoggedOutMuiAlert = () => {
    setAlertLoggedOutOpen(false);
  };

  const navigate = useNavigate();

  function toggleModal() {
    setCloseModal((prevState) => !prevState);
  }

  function toggleGridView() {
    setGridView((prevState) => !prevState);
  }

  function handleCloseFavoritesBlockedModal() {
    setFavoritesBlockedModal(false);
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {' '}
          <IconButton
            size="large"
            aria-label="logo"
            color="inherit"
            onClick={() => {
              window.location.href = '/';
            }}
            sx={{ cursor: 'pointer' }}
          >
            <PetsIcon sx={{ marginBottom: '6px' }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Illupets
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              '@media (max-width: 537px)': {
                display: 'none',
              },
            }}
          >
            <Button
              color="inherit"
              sx={{ top: '2px' }}
              id="account-button"
              onClick={handleClick}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              endIcon={<KeyboardArrowDownIcon sx={{ marginBottom: '4px' }} />}
            >
              {' '}
              Account
            </Button>
            {window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/forgotpassword') ||
            window.location.pathname.includes('/register') ||
            window.location.pathname.includes('/favoritepet') ||
            window.location.pathname.includes('/favorites') ? (
              ''
            ) : (
              <Button color="inherit" onClick={toggleModal}>
                {' '}
                {closeModal ? 'Open Filter' : 'Close Filter'}
              </Button>
            )}
          </Stack>
          <Menu
            id="resources-menu"
            anchorEl={anchorEl}
            open={open}
            MenuListProps={{ 'aria-labelledby': 'resources-button' }}
            onClose={handleClose}
          >
            <MenuItem
              onClick={function () {
                // navigate('/');
                window.location.href = '/';

                handleClose();
              }}
              sx={{
                paddingBottom: '10px',
                paddingTop: '10px',
                paddingLeft: '40px',
                paddingRight: '40px',
                color: '#1976d2',
              }}
            >
              {' '}
              Home{' '}
            </MenuItem>

            {auth.currentUser ? (
              ''
            ) : skeletonLoading ? (
              <Skeleton
                variant="text"
                sx={{
                  // paddingBottom: '10px',
                  // paddingTop: '10px',
                  // paddingLeft: '40px',
                  // paddingRight: '40px',
                  width: '60px',
                  marginLeft: '32px',
                  height: '21px',
                }}
              />
            ) : (
              <MenuItem
                onClick={function () {
                  navigate('/register');
                  handleClose();
                }}
                sx={{
                  paddingBottom: '10px',
                  paddingTop: '10px',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  color: '#1976d2',
                }}
              >
                {' '}
                Register{' '}
              </MenuItem>
            )}
            {auth.currentUser ? (
              skeletonLoading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    // paddingBottom: '10px',
                    // paddingTop: '10px',
                    // paddingLeft: '40px',
                    // paddingRight: '40px',
                    color: '#1976d2',
                    width: '60px',
                    marginLeft: '35px',
                  }}
                />
              ) : (
                <MenuItem
                  onClick={function () {
                    logOut();
                    setAlertLoggedOutOpen(true);
                    // console.log('logged out successful');
                    setUserEmail('');
                    handleClose();
                    // setCloseModal(false);
                  }}
                  sx={{
                    paddingBottom: '10px',
                    paddingTop: '10px',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    color: '#1976d2',
                  }}
                >
                  {' '}
                  Logout{' '}
                </MenuItem>
              )
            ) : skeletonLoading ? (
              <Skeleton
                variant="text"
                sx={{
                  // paddingBottom: '10px',
                  // paddingTop: '10px',
                  // paddingLeft: '40px',
                  // paddingRight: '40px',
                  color: '#1976d2',
                  width: '60px',
                  marginTop: '15px',
                  marginLeft: '33px',
                  height: '22px',
                }}
              />
            ) : (
              <MenuItem
                onClick={function () {
                  navigate('/login');
                  handleClose();
                }}
                sx={{
                  paddingBottom: '10px',
                  paddingTop: '10px',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  color: '#1976d2',
                }}
              >
                {' '}
                Login{' '}
              </MenuItem>
            )}

            <MenuItem
              sx={{
                paddingBottom: '10px',
                paddingTop: '10px',
                paddingLeft: '40px',
                paddingRight: '40px',
                color: '#1976d2',
              }}
              onClick={function () {
                if (auth.currentUser) {
                  navigate(`/${getCurrentUser()}/favorites`);
                  handleClose();
                } else {
                  setFavoritesBlockedModal(true);
                }
              }}
            >
              {auth.currentUser ? (
                skeletonLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      // paddingBottom: '10px',
                      // paddingTop: '10px',
                      // paddingLeft: '40px',
                      // paddingRight: '40px',
                      width: '60px',
                      marginLeft: '-5px',
                      height: '15px',
                    }}
                  />
                ) : (
                  ' Favorites'
                )
              ) : skeletonLoading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    // paddingBottom: '10px',
                    // paddingTop: '10px',
                    // paddingLeft: '40px',
                    // paddingRight: '40px',
                    width: '60px',
                    marginLeft: '-5px',
                    height: '15px',
                  }}
                />
              ) : skeletonLoading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    // paddingBottom: '10px',
                    // paddingTop: '10px',
                    // paddingLeft: '40px',
                    // paddingRight: '40px',
                    color: '#1976d2',
                    width: '60px',
                    marginLeft: '-8px',
                    height: '22px',
                  }}
                />
              ) : (
                <>
                  <Stack
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ position: 'relative' }}
                  >
                    <LockIcon
                      sx={{
                        height: '20px',
                        position: 'absolute',
                        left: '-30px',
                        color: '#1976d2',
                      }}
                    />
                    Favorites
                  </Stack>
                </>
              )}
            </MenuItem>
          </Menu>
          <button
            className={`hamburger-menu ${menuOpen ? 'open' : ''}`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </button>
        </Toolbar>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setMenuOpen(false);
          }}
        >
          <Box sx={{ width: '250px' }}>
            <Stack sx={{ marginTop: '80px' }}>
              <Link
                component="button"
                onClick={function () {
                  // navigate(`/`);
                  window.location.href = '/';
                  setMenuOpen(!menuOpen);
                  setIsDrawerOpen(!isDrawerOpen);
                }}
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: '#f3f3f3',
                  },
                  height: '50px',
                  borderRadius: '4px',
                  marginLeft: '5px',
                  marginRight: '5px',
                }}
              >
                {/* <AssignmentIndIcon sx={{ marginRight: '5px' }} /> */}
                <Typography variant="body1"> Home</Typography>
              </Link>
            </Stack>
            <Stack
              sx={{
                marginTop: '0px',
              }}
            >
              {auth.currentUser ? (
                ''
              ) : skeletonLoading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    // paddingBottom: '10px',
                    // paddingTop: '10px',
                    // paddingLeft: '40px',
                    // paddingRight: '40px',
                    width: '70px',
                    marginLeft: '89px',
                    height: '22px',
                  }}
                />
              ) : (
                <Link
                  underline="hover"
                  component="button"
                  onClick={() => {
                    navigate(`/register`);
                    setMenuOpen(!menuOpen);
                    setIsDrawerOpen(!isDrawerOpen);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#f3f3f3',
                    },
                    height: '50px',
                    borderRadius: '4px',
                    marginLeft: '5px',
                    marginRight: '5px',
                  }}
                >
                  <Typography variant="body1"> Register</Typography>
                </Link>
              )}
              {auth.currentUser ? (
                skeletonLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      // paddingBottom: '10px',
                      // paddingTop: '10px',
                      // paddingLeft: '40px',
                      // paddingRight: '40px',
                      width: '70px',
                      marginLeft: '89px',
                      height: '22px',
                    }}
                  />
                ) : (
                  <Link
                    underline="hover"
                    onClick={function () {
                      logOut();
                      setAlertLoggedOutOpen(true);
                      // console.log('logged out successful');
                      setUserEmail('');
                      setMenuOpen(!menuOpen);
                      setIsDrawerOpen(!isDrawerOpen);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: '#f3f3f3',
                      },
                      height: '50px',
                      borderRadius: '4px',
                      marginLeft: '5px',
                      marginRight: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    {' '}
                    Logout{' '}
                  </Link>
                )
              ) : skeletonLoading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    // paddingBottom: '10px',
                    // paddingTop: '10px',
                    // paddingLeft: '40px',
                    // paddingRight: '40px',
                    width: '70px',
                    marginLeft: '89px',
                    height: '22px',
                  }}
                />
              ) : (
                <Link
                  underline="hover"
                  component="button"
                  onClick={() => {
                    navigate(`/login`);
                    setMenuOpen(!menuOpen);
                    setIsDrawerOpen(!isDrawerOpen);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#f3f3f3',
                    },
                    height: '50px',
                    borderRadius: '4px',
                    marginLeft: '5px',
                    marginRight: '5px',
                  }}
                >
                  {/* <LoginIcon sx={{ marginRight: '5px' }} /> */}
                  <Typography variant="body1">Login</Typography>
                </Link>
              )}
            </Stack>

            <Stack sx={{ marginTop: '0px' }}>
              <Link
                underline="hover"
                component="button"
                onClick={function () {
                  if (auth.currentUser) {
                    navigate(`/${getCurrentUser()}/favorites`);
                    setMenuOpen(!menuOpen);
                    setIsDrawerOpen(!isDrawerOpen);
                  } else {
                    setFavoritesBlockedModal(true);
                  }
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f3f3f3 ',
                  },
                  height: '50px',
                  borderRadius: '4px',
                  marginLeft: '5px',
                  marginRight: '5px',
                  marginBottom: '0px',
                }}
              >
                {auth.currentUser ? (
                  skeletonLoading ? (
                    <Skeleton
                      variant="text"
                      sx={{
                        // paddingBottom: '10px',
                        // paddingTop: '10px',
                        // paddingLeft: '40px',
                        // paddingRight: '40px',
                        width: '90px',
                        marginLeft: '75px',
                        height: '22px',
                      }}
                    />
                  ) : (
                    <Typography variant="body1"> Favorites </Typography>
                  )
                ) : skeletonLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      // paddingBottom: '10px',
                      // paddingTop: '10px',
                      // paddingLeft: '40px',
                      // paddingRight: '40px',
                      width: '90px',
                      marginLeft: '75px',
                      height: '22px',
                    }}
                  />
                ) : (
                  <Stack sx={{ position: 'relative' }}>
                    <LockIcon
                      sx={{
                        height: '20px',
                        position: 'absolute',
                        left: '53px',
                      }}
                    />{' '}
                    <Typography variant="body1"> Favorites </Typography>
                  </Stack>
                )}
              </Link>
            </Stack>
          </Box>
        </Drawer>
      </AppBar>

      <Snackbar
        open={alertLoggedOutOpen}
        autoHideDuration={6000}
        onClose={handleCloseLoggedOutMuiAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseLoggedOutMuiAlert}
          severity="success"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Success</AlertTitle>
          You Have Successfully Logged Out
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={favoritesBlockedModal}
        autoHideDuration={6000}
        onClose={handleCloseFavoritesBlockedModal}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseFavoritesBlockedModal}
          severity="error"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Locked Content</AlertTitle>
          To Access Favorites Page, You need to log in
        </MuiAlert>
      </Snackbar>
    </>
  );
}
