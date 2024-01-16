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

export function Layout({
  gridView,
  setGridView,
  mapView,
  setMapView,
  closeModal,
  setCloseModal,
}) {
  return (
    <div>
      <Navbar
        mapView={mapView}
        setMapView={setMapView}
        gridView={gridView}
        setGridView={setGridView}
        closeModal={closeModal}
        setCloseModal={setCloseModal}
      />{' '}
      {/* Navbar appears on all routes */}
      <main>
        <Outlet /> {/* Child route components will be rendered here */}
      </main>
    </div>
  );
}
