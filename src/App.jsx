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

let Lazyload = React.lazy(function () {
  return import('./mainbody.jsx');
});
function App() {
  let [closeModal, setCloseModal] = useState(false);
  let [mapView, setMapView] = useState(false);
  let [gridView, setGridView] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              mapView={mapView}
              setMapView={setMapView}
              gridView={gridView}
              setGridView={setGridView}
              closeModal={closeModal}
              setCloseModal={setCloseModal}
            />
          }
        >
          {' '}
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
        </Route>{' '}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
