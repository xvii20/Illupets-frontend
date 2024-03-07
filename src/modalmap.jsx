import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  Circle,
} from 'react-leaflet';
import axios from 'axios';
import { Stack } from '@mui/material';

const Modalmap = ({
  chosenElement,
  isMapLoaded,
  setIsMapLoaded,
  longitude,
  latitude,
  setLongitude,
  setLatitude,
}) => {
  // const [latitude, setLatitude] = useState('x');
  // const [longitude, setLongitude] = useState('x');

  const [bbox, setBbox] = useState(null); // State to store the bounding box coordinates
  const [containerClassName, setContainerClassName] = useState('');

  let mapbox_apikey = import.meta.env.VITE_MAPBOX_KEY;
  const mapboxAccessToken = mapbox_apikey;

  const { address1, city, state, postcode } = chosenElement.contact.address;
  const finalAddress = `${
    address1 ? address1 + ' ' : ''
  }${city}, ${state} ${postcode}`;
  const encodedAddress = encodeURIComponent(finalAddress);

  const fetchData = useMemo(
    () => async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxAccessToken}`
        );
        if (response.data.features.length > 0) {
          // console.log(response.data);
          const [lng, lat] = response.data.features[0].center;

          // Set latitude and longitude
          setLatitude(lat);
          setLongitude(lng);

          // console.log(latitude, 'latitude');
          // console.log(typeof latitude);

          // console.log(longitude, 'longitude');
          // console.log(response.data.features[0], 'bbxox');
          // Set bounding box coordinates if available
          if (response.data.features[0].bbox) {
            setBbox(response.data.features[0].bbox);
          }

          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching geolocation:', error);
      }
    },
    []
  );

  useEffect(() => {
    // Call fetchData when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = 1032; //962;
      const newClassName =
        window.innerWidth <= maxWidth ? 'mediamodalmapcontainer' : 'modalmap';
      setContainerClassName(newClassName);
    };

    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {longitude && latitude ? (
        <Stack sx={{}} className={containerClassName}>
          <MapContainer
            style={{ height: '400px' }}
            zoom={bbox ? 10 : 13}
            center={[latitude, longitude]}
            // center={[40.7128, 74.006]}
            scrollWheelZoom={true}
            fadeAnimation={true}
            markerZoomAnimation={true}
            whenReady={() => {
              setIsMapLoaded(true);
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              {/* <Marker position={[40.7128, 74.006]}> */}{' '}
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            {bbox && (
              <Rectangle
                bounds={[
                  [bbox[1], bbox[0]],
                  [bbox[3], bbox[2]],
                ]}
                color="red"
              />
            )}
          </MapContainer>
        </Stack>
      ) : (
        ''
      )}

      <div>{/* {latitude}, {longitude} */}</div>
    </>
  );
};

export default Modalmap;
