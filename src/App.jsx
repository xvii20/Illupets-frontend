import React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MyMapComponent } from './map';
import 'leaflet/dist/leaflet.css';
import Navbar from './navbar';
import { Layout } from './layout';
import { stateOptions } from './states';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  NavLink,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import Mainbody from './mainbody';
import { CircularProgress, Box } from '@mui/material';
import Forgotpassword from './forgotpassword.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import Favorites from './favorites.jsx';
import Favoritepet from './favoritepet.jsx';

let Lazyload = React.lazy(function () {
  return import('./mainbody.jsx');
});
function App() {
  let [closeModal, setCloseModal] = useState(false);
  let [mapView, setMapView] = useState(false);
  let [gridView, setGridView] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertLoggedInSuccessful, setAlertLoggedInSuccessful] = useState(false);
  const [alertRegistrationSuccessful, setAlertRegistrationSuccessful] =
    useState(false);

  useEffect(() => {
    // Sets up an authentication state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      // console.log(user, 'user from the app component');
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              mapView={mapView}
              setMapView={setMapView}
              closeModal={closeModal}
              setCloseModal={setCloseModal}
              setAlertLoggedInSuccessful={setAlertLoggedInSuccessful}
              alertLoggedInSuccessful={alertLoggedInSuccessful}
              setAlertRegistrationSuccessful={setAlertRegistrationSuccessful}
              alertRegistrationSuccessful={alertRegistrationSuccessful}
            />
          }
        >
          <Route
            index
            element={
              <React.Suspense fallback="">
                <Lazyload
                  closeModal={closeModal}
                  setCloseModal={setCloseModal}
                  mapView={mapView}
                  setMapView={setMapView}
                  gridView={gridView}
                  setGridView={setGridView}
                />
              </React.Suspense>
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login
                  alertLoggedInSuccessful={alertLoggedInSuccessful}
                  setAlertLoggedInSuccessful={setAlertLoggedInSuccessful}
                  closeModal={closeModal}
                  setCloseModal={setCloseModal}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Register
                  alertRegistrationSuccessful={alertRegistrationSuccessful}
                  setAlertRegistrationSuccessful={
                    setAlertRegistrationSuccessful
                  }
                />
              )
            }
          />

          <Route path="/forgotpassword" element={<Forgotpassword />} />

          <Route
            path="/:uid/favorites"
            element={user ? <Favorites /> : <Navigate to="/" />}
          />

          <Route
            path="/:uid/:id/favoritepet"
            element={user ? <Favoritepet /> : <Navigate to="/" />}
          />
        </Route>{' '}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
