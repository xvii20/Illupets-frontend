import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from './getcurrentuser';
import {
  Stack,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import noimage from './No-Image-Placeholder.png';

export default function Favoritepet() {
  const location = useLocation();

  const petObj = location.state;

  // console.log(petObj, 'pettobj');

  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);

  // the selected pet image that the user clicked
  const [selectedImage, setSelectedImage] = useState('');

  // if the user clicks on a pet photo, a modal opens
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);

  const [bbox, setBbox] = useState(null); // State to store the bounding box coordinates

  // console.log(petObj);

  // console.log(petObj.latitude);

  if (petObj.images.length > 0) {
    useEffect(() => {
      setSelectedImage(petObj.images.slice(0, 3)[selectedIndex].medium);
    }, [selectedIndex, petObj.images]);
  } else if (petObj.images.length == 0) {
    useEffect(() => {
      setSelectedImage('No image availble');
    }, []);
  }

  // when user uses arrowkey left, the modal image switches to the left, and when the user uses arrowkey right, the modal image switches to the right
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        // console.log(event.key, 'event key');
        setSelectedIndex((prevIndex) => {
          if (prevIndex === 0) {
            return petObj.images?.slice(0, 3).length - 1;
          } else {
            return prevIndex - 1;
          }
        });
      } else if (event.key === 'ArrowRight') {
        setSelectedIndex((prevIndex) => {
          if (prevIndex === petObj.images.slice(0, 3).length - 1) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, petObj.images]);

  const displayStyle = imageModalIsOpen ? 'block' : 'none';
  const backgroundfaded = imageModalIsOpen ? 'rgba(0, 0, 0, 0.5)' : '';
  return (
    <Stack
      sx={{
        marginTop: '64px',

        backgroundColor: backgroundfaded,
        height: '100vh',
      }}
      alignItems="center"
    >
      <Paper
        elevation={3}
        // onClick={function () {
        //   if (imageModalIsOpen) {
        //     setImageModalIsOpen(false);
        //     return;
        //   }
        //   return;
        // }}
        sx={{
          maxWidth: '1000px',
          marginTop: '10px',
          width: '90vw',
          height: '900px',
          maxHeight: '1075px',
          // overflow: 'scroll',
          position: 'relative',
          '@media (min-width: 1091px)': {
            height: '700px',
          },
          '@media (max-width: 1091px)': {
            height: '950px',
            width: '95vw',
          },
          '@media (max-width: 505px)': {
            height: '1050px',
          },
          '@media (max-height: 1030px)': {
            overflow: 'auto',
          },
        }}
      >
        <Stack
          className="favoritepetmodal" // modal overlay
          sx={{
            display: displayStyle,
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '999',
          }}
          // onClick={function () {
          //   setImageModalIsOpen(false);
          // }}
        >
          <Stack
            className="favoritepetmodal-content"
            sx={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)', // Centers the modal
              backgroundColor: 'white',
              padding: '20px',

              borderRadius: '8px',
              width: '300px',
              height: '350px',
              paddingTop: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Stack
              display="flex"
              direction="row"
              justifyContent="end"
              sx={{ marginBottom: '5px' }}
            >
              <IconButton
                onClick={function () {
                  setImageModalIsOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack
              sx={{
                height: '300px',
                //  outline: '2px solid pink',
                width: '300px',
                position: 'absolute',
                top: '50px',
                marginTop: '10px',
              }}
            >
              <IconButton
                onClick={() => {
                  setSelectedIndex((prevIndex) => {
                    if (prevIndex === petObj.images.slice(0, 3).length - 1) {
                      return 0;
                    } else {
                      return prevIndex + 1;
                    }
                  });
                  setSelectedImage(
                    petObj.images.slice(0, 3)[selectedIndex].medium
                  );
                }}
                aria-label="Arrowforward"
                sx={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  right: '0',
                  color: 'white',
                  borderRadius: '0px',
                  transition: 'background-color 100ms ease-in-out',

                  '&:hover': {
                    backgroundColor: 'rgb(0,0,0,0.2)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  setSelectedIndex((prevIndex) => {
                    if (prevIndex === 0) {
                      return petObj.images.slice(0, 3).length - 1;
                    } else {
                      return prevIndex - 1;
                    }
                  });
                  // console.log(selectedIndex, 'index');
                  setSelectedImage(
                    petObj.images.slice(0, 3)[selectedIndex].medium
                  );
                  // console.log(
                  //   petObj.images.slice(0, 3)[selectedIndex].medium,
                  //   'sliced'
                  // );
                  // console.log(selectedImage, 'selected img');
                }}
                aria-label="ArrowLeft"
                sx={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  left: '0',
                  color: 'white',
                  borderRadius: '0px',
                  transition: 'background-color 100ms ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgb(0,0,0,0.2)',
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>

              <img
                alt="Pet Image"
                src={selectedImage}
                aria-label="Pet Image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  border: '2px groove black',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />
            </Stack>
            {/* <Button
              className="close-btn"
              onClick={function () {
                setImageModalIsOpen(false);
              }}
            >
              Close
            </Button> */}
          </Stack>
        </Stack>

        <Tooltip title="Go Back To Favorites">
          <IconButton
            sx={{ position: 'absolute', top: '10px', left: '10px' }}
            onClick={function () {
              navigate(`/${getCurrentUser()}/favorites`);
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
        </Tooltip>

        <Stack
          sx={{
            height: '90vh',
            position: 'absolute',
            right: '330px',
            // overflow: 'auto',
          }}
        >
          <Divider
            orientation="vertical"
            sx={{
              height: '700px',
              '@media (max-width: 1091px)': {
                display: 'none',
              },
            }}
          />
        </Stack>

        <Stack
          display="flex"
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{
            '@media (max-width: 1091px)': {
              justifyContent: 'center',
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              // display: 'flex',
              // gap: '60px',
              justifyContent: 'start',
              //    outline: '2px solid blue',
              width: '66%',
              height: '220px',
              paddingTop: '80px',
              overflow: 'auto',
              flexWrap: 'wrap',
              gap: '6px',
              '@media (max-width: 1091px)': {
                width: '100%',
                justifyContent: 'center',
              },
            }}
          >
            {petObj.images.length == 0 ? (
              <div
                style={{
                  // marginLeft: '20px',
                  // width: '170px',
                  minWidth: '160px',
                  marginLeft: '20px',
                  height: '200px',
                  maxWidth: '200px',
                }}
              >
                <img
                  alt="Pet Avatar"
                  src={noimage}
                  aria-label="Pet Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    border: '2px groove black',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={function () {
                    setImageModalIsOpen(true);
                    setSelectedImage(noimage);
                    setSelectedIndex(index);
                  }}
                />
              </div>
            ) : (
              petObj.images.map(function (element, index) {
                return (
                  <div
                    style={{
                      // marginLeft: '20px',
                      // width: '170px',
                      minWidth: '160px',
                      marginLeft: '20px',
                      height: '200px',
                      maxWidth: '200px',
                    }}
                  >
                    <img
                      alt="Pet Avatar"
                      src={element.medium}
                      aria-label="Pet Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: '2px groove black',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={function () {
                        setImageModalIsOpen(true);
                        setSelectedImage(element.medium);
                        setSelectedIndex(index);
                      }}
                    />
                  </div>
                );
              })
            )}
          </Stack>

          <Stack
            sx={{
              width: '300px',
              height: '400px',
              border: '2px solid black',
              borderRadius: '4px',
              position: 'absolute',

              right: '10px',
              top: '30px',
              '@media (max-width: 1091px)': {
                display: 'none',
              },
            }}
          >
            <MapContainer
              style={{ height: '100%', width: '100%' }}
              zoom={13}
              // center={[latitude, longitude]}
              center={[petObj.latitude, petObj.longitude]}
              scrollWheelZoom={true}
              fadeAnimation={true}
              markerZoomAnimation={true}
              // whenReady={() => {
              //   setIsMapLoaded(true);
              // }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[petObj.latitude, petObj.longitude]}>
                {' '}
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
            <Stack display="flex" alignItems="center">
              {' '}
              {/* <Typography variant="body1"> Approximate Location </Typography> */}
              <Typography variant="body1"> Location: {petObj.city} </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            marginTop: '10px',
            width: '67%',
            '@media (max-width: 1091px)': {
              width: '100%',
            },
          }}
        />

        <Stack
          sx={{
            '@media (max-width: 1091px)': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
          <Stack
            direction="column"
            sx={{
              width: '66%',
              justifyContent: 'center',
              alignItems: 'center',

              borderRadius: '4px',
              marginTop: '10px',
              display: 'flex',
            }}
          >
            <Stack direction="row" display="flex" justifyContent="center">
              {' '}
              <Typography variant="body1"> Description</Typography>
            </Stack>

            <Typography sx={{ paddingLeft: '10px', lineHeight: '30px' }}>
              {' '}
              {petObj.description ? petObj.description : 'N/A'}
            </Typography>
          </Stack>
        </Stack>

        <Divider />
        <Stack sx={{ paddingLeft: '10px', marginTop: '15px' }}>
          <Typography> State: {petObj.state ? petObj.state : 'N/A'}</Typography>
        </Stack>
        <Stack
          sx={{ paddingLeft: '10px', marginTop: '15px', overflow: 'auto' }}
        >
          <Typography> Email: {petObj.email ? petObj.email : 'N/A'}</Typography>
        </Stack>
        <Stack sx={{ paddingLeft: '10px', marginTop: '15px' }}>
          <Typography> Phone: {petObj.phone ? petObj.phone : 'N/A'}</Typography>
        </Stack>
        <Stack sx={{ paddingLeft: '10px', marginTop: '15px' }}>
          <Typography> City: {petObj.city}</Typography>
        </Stack>

        <Stack
          sx={{
            width: '95%',
            height: '300px',

            borderRadius: '4px',
            display: 'none',
            paddingBottom: '130px',
            '@media (max-width: 1091px)': {
              display: 'block',
              marginLeft: '10px',
              marginTop: '10px',
            },
            '@media (max-width: 535px)': {
              marginLeft: '3px',
            },
          }}
        >
          <MapContainer
            style={{ height: '100%', width: '100%', border: '2px solid black' }}
            zoom={13}
            center={[petObj.latitude, petObj.longitude]}
            scrollWheelZoom={true}
            fadeAnimation={true}
            markerZoomAnimation={true}
            // whenReady={() => {
            //   setIsMapLoaded(true);
            // }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[petObj.latitude, petObj.longitude]}>
              {' '}
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            {/* {bbox && (
            <Rectangle
              bounds={[
                [bbox[1], bbox[0]],
                [bbox[3], bbox[2]],
              ]}
              color="red"
            />
          )} */}
          </MapContainer>
          <Stack display="flex" alignItems="center">
            {' '}
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              {' '}
              Location: {petObj.city}{' '}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
