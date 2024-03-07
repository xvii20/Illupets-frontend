import React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MyMapComponent } from './map';
import 'leaflet/dist/leaflet.css';
import Navbar from './navbar';
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export function Layout({
  gridView,
  setGridView,
  mapView,
  setMapView,
  closeModal,
  setCloseModal,
  alertLoggedInSuccessful,
  setAlertLoggedInSuccessful,
  alertRegistrationSuccessful,
  setAlertRegistrationSuccessful,
}) {
  const handleLoggedInClose = () => {
    setAlertLoggedInSuccessful(false);
  };

  function handleCloseSuccessfulRegisteredAlert() {
    setAlertRegistrationSuccessful(false);
  }

  return (
    <div>
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
      {alertLoggedInSuccessful ? (
        <Snackbar
          open={alertLoggedInSuccessful}
          autoHideDuration={6000}
          onClose={handleLoggedInClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ textAlign: 'center' }}
        >
          <MuiAlert
            onClose={handleLoggedInClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            <AlertTitle>Success</AlertTitle>
            You Have Successfully Logged In
          </MuiAlert>
        </Snackbar>
      ) : (
        ''
      )}
      <Navbar
        mapView={mapView}
        setMapView={setMapView}
        gridView={gridView}
        setGridView={setGridView}
        closeModal={closeModal}
        setCloseModal={setCloseModal}
      />{' '}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
