import React from 'react';
import { reverseStateAbbreviations } from './states';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { MyMapComponent } from './map';
import Modalmap from './modalmap';
import { useState, useEffect } from 'react';
// import Imagemodal from './imagemodal';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Stack,
  IconButton,
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Skeleton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getCurrentUser } from './getcurrentuser';
import axios from 'axios';
import { auth } from './firebase';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Modal = ({
  imageModal,
  setImageModal,
  chosenElement,
  setChosenElement,
}) => {
  let geo_Api_Key = import.meta.env.VITE_GEO_KEY;
  let geo_Api_Key_Version_Two = import.meta.env.VITE_GEOTWO_KEY;

  const [miniImageloading, setMiniImageLoading] = useState(true);

  // both of these useStates is for the image Modal, for when the user clicks on the pictures
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [favorited, setFavorited] = useState(false);
  const [heartLoading, setHeartLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false); // snackbar modal
  const [alertRemovedOpen, setAlertRemovedOpen] = useState(false); // snackbar modal for unfavoriting a pet

  const BACKENDLOCALHOST_PATH = import.meta.env.VITE_BACKENDLOCALHOST_PATH;
  const BACKENDCLOUDSERVERURL_PATH = import.meta.env
    .VITE_BACKENDCLOUDSERVERURL_PATH;

  {
    chosenElement.photos.length == 0
      ? ''
      : useEffect(() => {
          setSelectedImage(
            chosenElement.photos.slice(0, 3)[selectedIndex].medium
          );
        }, [selectedIndex, chosenElement.photos]);
  }

  if (!imageModal) {
    return null;
  }

  useEffect(() => {
    const fetchHeartData = async () => {
      // console.log(getCurrentUser(), 'getcurrentuserfunction');

      try {
        const response = await axios.get(
          `${
            BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH
          }/${getCurrentUser()}/findid/${chosenElement.id}`
        );
        // console.log(response);
        if (response) {
          setFavorited(true);
          setHeartLoading(false);
          return;
        } else {
          setFavorited();
          setHeartLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFavorited(false);
        setHeartLoading(false);
        return;
      }
    };
    if (getCurrentUser()) {
      fetchHeartData();
    } else {
      setHeartLoading(false);
    }
  }, []);

  // when user uses arrowkey left, the modal image switches to the left, and when the user uses arrowkey right, the modal image switches to the right
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((prevIndex) => {
          if (prevIndex === 0) {
            return chosenElement.photos.slice(0, 3).length - 1;
          } else {
            return prevIndex - 1;
          }
        });
      } else if (event.key === 'ArrowRight') {
        setSelectedIndex((prevIndex) => {
          if (prevIndex === chosenElement.photos.slice(0, 3).length - 1) {
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
  }, [selectedIndex, chosenElement.photos]);

  // closes the mui alert
  const handleClose = () => {
    setAlertOpen(false);
    setAlertRemovedOpen(false);
  };

  async function openImageModal(image, index) {
    setSelectedImage(image);
    setSelectedIndex(index);
    setImageModalIsOpen(true);
    setMiniImageLoading(false);
  }

  const closeImageModal = () => {
    setImageModalIsOpen(false);
    setMiniImageLoading(true);
    setIsImageLoaded(false);
  };

  function formatDate(date_to_format) {
    const utcDate = new Date(date_to_format);

    const day = utcDate.toLocaleDateString('en-US', {
      day: 'numeric',
    });
    const month = utcDate.toLocaleString('en-US', { month: 'long' });
    const year = utcDate.getFullYear();

    // formated date
    return `${month} ${day}, ${year}`;
  }

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }

    // Return the original number if it doesn't match the expected format
    return phoneNumber;
  }

  async function handleImageLoad() {
    setIsImageLoaded(true);
  }

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        // sx={{
        //   zIndex: (theme) => theme.zIndex.drawer + 1, // Sets snackbar to a value higher than the navbar's zIndex
        // }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="success"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Success</AlertTitle>
          Pet Successfully Added to Favorites!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={alertRemovedOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="success"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          <AlertTitle>Success</AlertTitle>
          Pet Successfully Removed From Favorites!
        </MuiAlert>
      </Snackbar>

      <div className="modal-overlay">
        <div className="modal-content">
          {!auth.currentUser ? (
            ''
          ) : (
            <Tooltip title="Add Pet To Favorites">
              {heartLoading ? (
                <Skeleton
                  variant="circular"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '8px',
                    width: '35px',
                    height: '35px',
                    transform: 'translateX(-50%)',
                  }}
                />
              ) : (
                <IconButton
                  aria-label="favorite"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '8px',
                    transform: 'translateX(-50%)',
                  }}
                  onClick={async () => {
                    try {
                      let favoriteObject = {
                        species: chosenElement.species,
                        id: chosenElement.id,
                        description: chosenElement.description,
                        images: chosenElement.photos.slice(0, 3),
                        state:
                          reverseStateAbbreviations[
                            chosenElement.contact.address.state
                          ],
                        email: chosenElement.contact.email,
                        phone: formatPhoneNumber(chosenElement.contact.phone),
                        city: chosenElement.contact.address.city,
                        postedon: formatDate(chosenElement.published_at),
                        breed: chosenElement.breeds.primary,
                        gender: chosenElement.gender,
                        age: chosenElement.age,
                        spayed: chosenElement.attributes.spayed_neutered
                          ? 'Neutered'
                          : 'Not Neutered',
                        shots: chosenElement.attributes.shots_current
                          ? 'Current'
                          : 'Not Current',
                        latitude: latitude,
                        longitude: longitude,
                      };

                      // console.log(favoriteObject, 'favoriteobject');
                      if (favorited) {
                        const response = await axios.post(
                          `${
                            BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH
                          }/${getCurrentUser()}/deletefavorites`,
                          { favoriteObject }
                        );
                        // console.log('Response:', response.data);
                        setFavorited(false);
                        setAlertRemovedOpen(true);
                      } else {
                        const response = await axios.post(
                          `${
                            BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH
                          }/${getCurrentUser()}/addfavorites`,
                          { favoriteObject }
                        );
                        // console.log('Response:', response.data);
                        setFavorited(true);
                        setAlertOpen(true);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  }}
                >
                  {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              )}
            </Tooltip>
          )}

          {/* warning false content, imageModal jsx*/}
          {imageModalIsOpen ? (
            <div className="imagemodal-overlay">
              <div className={isImageLoaded ? 'imagemodal-content' : 'hide'}>
                <div className="closeimagemodaldiv">
                  <IconButton
                    onClick={() => {
                      setImageModalIsOpen(false);
                      closeImageModal();
                    }}

                    // className={
                    //   isImageLoaded ? 'closeimagemodalx' : 'visibilityremove'
                    // }
                  >
                    <CloseIcon />
                  </IconButton>
                </div>

                <span className="closeimage-modal" onClick={closeImageModal}>
                  &times;
                </span>
                <div className="modalimageparent">
                  <img
                    src={selectedImage}
                    alt="selected"
                    className="modal-image"
                    load="lazy"
                    onLoad={handleImageLoad}
                  />

                  <IconButton
                    onClick={() => {
                      setSelectedIndex((prevIndex) => {
                        if (
                          prevIndex ===
                          chosenElement.photos.slice(0, 3).length - 1
                        ) {
                          return 0;
                        } else {
                          return prevIndex + 1;
                        }
                      });
                      setSelectedImage(
                        chosenElement.photos.slice(0, 3)[selectedIndex].medium
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
                          return chosenElement.photos.slice(0, 3).length - 1;
                        } else {
                          return prevIndex - 1;
                        }
                      });
                      // console.log(selectedIndex, 'index');
                      setSelectedImage(
                        chosenElement.photos.slice(0, 3)[selectedIndex].medium
                      );
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
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {/* <Imagemodal
            imageModalisOpen={imageModalIsOpen}
            closeImageModal={closeImageModal}
            selectedImage={selectedImage}
            setImageModalIsOpen={setImageModalIsOpen}
            // miniImageloading={miniImageloading}
            // setMiniImageLoading={setMiniImageLoading}
          />
        */}

          <div className="xmodalclosediv">
            <Tooltip title="Close Modal">
              <IconButton
                onClick={() => {
                  // setImageModal(false);
                  setChosenElement('');
                  document.body.style.overflow = 'auto';
                }}
                className="xmodalclose"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="modalcontainer">
            {chosenElement.photos.length !== 0 ? (
              <div className="modalimagediv">
                {chosenElement.photos
                  ? chosenElement.photos.slice(0, 3).map((element, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => openImageModal(element.medium, index)}
                        >
                          <img
                            className="modalimage"
                            src={
                              element.small
                                ? element.medium
                                : chosenElement.primary_photo_cropped.small
                            }
                            alt="photo not found"
                          />
                        </div>
                      );
                    })
                  : ''}
              </div>
            ) : (
              <div className="nophotosdiv"> </div>
            )}
            <div className="parentmodaldescriptiondiv">
              <div className="xyz">
                <div className="modaldescriptiondiv"> Description: </div>
                {chosenElement.description ? (
                  <div> {chosenElement.description} </div>
                ) : (
                  <div> N/A</div>
                )}{' '}
              </div>
            </div>
            <div className="modalmaincontactinfo">
              {/* <Stack
              sx={{
                marginBottom: '10px',
                outline: '2px solid black',
                '@media (min-width: 962px)': {
                  display: 'none',
                },
                '@media (max-width: 1032px)': {
                  display: 'block',
                  width: '80vw',
                },
              }}
            >
              <Modalmap
                chosenElement={chosenElement}
               

                isMapLoaded={isMapLoaded}
                setIsMapLoaded={setIsMapLoaded}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
              />
            </Stack> */}
              <p>
                {' '}
                <span> State: </span>
                {reverseStateAbbreviations[chosenElement.contact.address.state]}
              </p>
              <p>
                {' '}
                <span> Email: </span>
                {chosenElement.contact.email}
              </p>
              <p>
                {' '}
                <span> Phone: </span> +1{' '}
                {formatPhoneNumber(chosenElement.contact.phone)}{' '}
              </p>
              <p>
                {' '}
                <span> City: </span> {chosenElement.contact.address.city}{' '}
              </p>
              {/* <p>
              {' '}
              <span> Location: </span> {chosenElement.contact.address.address1}{' '}
            </p> */}
              <p>
                {' '}
                <span> Posted on: </span>{' '}
                {formatDate(chosenElement.published_at)}{' '}
              </p>
            </div>
            <div className="modalanimaldescription">
              <p className="breed">
                {' '}
                <span> Breed: </span> {chosenElement.breeds.primary}
              </p>
              <p>
                {' '}
                <span> Gender: </span> {chosenElement.gender}
              </p>
              <p>
                {' '}
                <span> Age: </span> {chosenElement.age}
              </p>

              <p>
                {' '}
                <Box sx={{ display: 'inline', fontWeight: 'bolder' }}>
                  {' '}
                  Spayed Neutered:{' '}
                </Box>
                {chosenElement.attributes.spayed_neutered
                  ? 'Neutered'
                  : 'N/A'}{' '}
              </p>
              <p>
                {' '}
                <span> Shots Current: </span>{' '}
                {chosenElement.attributes.shots_current ? 'Current' : 'N/A'}{' '}
              </p>
              <Divider flexItem sx={{ marginTop: '10px' }} />
              <Stack
                alignItems="center"
                display="none"
                justifyContent="center"
                width="100%"
                sx={{
                  marginTop: '10px',

                  '@media (max-width: 1032px)': {
                    display: 'flex',
                  },
                }}
              >
                {' '}
                <Typography variant="body2">
                  {' '}
                  Approximate Location: {
                    chosenElement.contact.address.city
                  }, {chosenElement.contact.address.state}{' '}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  marginBottom: '10px',
                  outline: '2px solid black',
                  '@media (min-width: 962px)': {
                    display: 'none',
                  },
                  '@media (max-width: 1032px)': {
                    display: 'block',
                    width: '80vw',
                  },
                }}
              >
                <Modalmap
                  chosenElement={chosenElement}
                  isMapLoaded={isMapLoaded}
                  setIsMapLoaded={setIsMapLoaded}
                  latitude={latitude}
                  setLatitude={setLatitude}
                  longitude={longitude}
                  setLongitude={setLongitude}
                />
              </Stack>
            </div>
          </div>
          <div
            className={
              chosenElement.photos.length == 0
                ? 'importantinfodivversiontwo'
                : 'importantinfodiv'
            }
          >
            <div
              className={isMapLoaded ? 'modalmapcontainer' : 'visibilityremove'}
            >
              <Modalmap
                chosenElement={chosenElement}
                latitude={latitude}
                longitude={longitude}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                isMapLoaded={isMapLoaded}
                setIsMapLoaded={setIsMapLoaded}
              />
              {/* {chosenElement.contact.address.address1 && !loading ? (
              <div className="address">
                {' '}
                Address: {chosenElement.contact.address.address1},{' '}
                {chosenElement.contact.address.city}{' '}
                {chosenElement.contact.address.state}
              </div>
            ) : chosenElement.contact.address.address2 && !loading ? (
              <div className="address">
                {' '}
                Location: {chosenElement.contact.address.address2},{' '}
                {chosenElement.contact.address.city}{' '}
                {chosenElement.contact.address.state}
              </div>
            ) : ( */}
              {isMapLoaded ? (
                <div className="address">
                  {' '}
                  <span className="locationdotspan">
                    {' '}
                    <FontAwesomeIcon icon={faLocationDot} />{' '}
                  </span>
                  Approximate Location: {chosenElement.contact.address.city},{' '}
                  {chosenElement.contact.address.state}
                </div>
              ) : (
                <div> Loading Map </div>
              )}
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
