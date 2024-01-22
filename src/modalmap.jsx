import React from 'react';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ImageOverlay,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Modalmap = ({
  chosenElement,
  // latitude,
  // longitude,
  // setLatitude,
  // setLongitude,
  isMapLoaded,
  setIsMapLoaded,
}) => {
  // Use a unique key based on the closeModal prop. needed to rerender the map
  // const mapKey = closeModal ? 'closed' : 'open';
  let [latitude, setLatitude] = useState('');
  let [longitude, setLongitude] = useState('');

  let geo_Api_Key = import.meta.env.VITE_GEO_KEY;
  let geo_Api_Key_Version_Two = import.meta.env.VITE_GEOTWO_KEY;

  let city = chosenElement.contact.address.city;
  let state = chosenElement.contact.address.state;
  let address1 = chosenElement.contact.address.address1;
  let address2 = chosenElement.contact.address.address2;
  let country = chosenElement.contact.address.country;
  let postcode = chosenElement.contact.address.postcode;
  // console.log(postcode);
  const example = '1600 Pennsylvania Ave NW, Washington DC';

  //  defines the geographic bounds (coordinates) where the image should be placed on the map. It specifies the top-left and bottom-right corners of the image overlay in terms of latitude and longitude.
  const imageBounds = [
    [latitude - 0.01, longitude - 0.01],
    [latitude + 0.01, longitude + 0.01],
  ];

  useEffect(() => {
    async function geo() {
      // if address1 and address2 are falsy values, this will do something
      // if (!address2 && !address1) {
      const finalAddress = ` ${
        address1 ? address1 : ''
      } ${city}, ${state} ${postcode}`;
      // console.log(finalAddress);
      const encodedAddress = encodeURIComponent(finalAddress);
      // console.log(encodedAddress);

      try {
        let response = await axios.get(
          // `https://geocode.maps.co/search?q=${finalAddress}&api_key=${geo_Api_Key_Version_Two}`

          // working `http://api.positionstack.com/v1/forward?access_key=${geo_Api_Key}&query=1600%20Pennsylvania%20Ave%20NW,%20Washington%20DC`
          `http://api.positionstack.com/v1/forward?access_key=${geo_Api_Key}&query=${finalAddress}`
        );

        // console.log(response);

        if (response.data.data.length > 0) {
          // use parsefloat to turn decimal strings into decimal numbers. dont use parseInt, because you will lose the decimals

          // uncomment to see the api data
          // console.log(response.data.data, 'data!!');

          setLatitude(response.data.data[0].latitude);
          setLongitude(response.data.data[0].longitude);
        }
      } catch (error) {
        console.error('Error fetching geolocation:', error);
      }
    }
    // }

    geo();
  }, []);

  const mapKey = latitude + longitude;

  return (
    <>
      {latitude && longitude && (
        <MapContainer
          key={mapKey}
          className="modalmap"
          style={{ height: '400px' }}
          zoom={13}
          center={[latitude, longitude]}
          scrollWheelZoom={true}
          fadeAnimation={true}
          markerZoomAnimation={true}
          whenReady={() => {
            // Code to execute when the map is done loading

            setIsMapLoaded(true);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>

          {/* Add ImageOverlay this code below allows an image to appear on the map */}
          {
            // <ImageOverlay
            //   url={chosenElement.photos[0].small}
            //   bounds={imageBounds}
            //   className="custom-image-overlay"
            // />
          }
        </MapContainer>
      )}
    </>
  );
};
