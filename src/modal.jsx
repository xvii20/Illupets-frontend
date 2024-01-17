import React from 'react';
import { reverseStateAbbreviations } from './states';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { MyMapComponent } from './map';
import { Modalmap } from './modalmap';
import { useState, useEffect } from 'react';
// import Imagemodal from './imagemodal';

const Modal = ({
  imageModal,
  setImageModal,
  chosenElement,
  loading,
  setLoading,
}) => {
  let geo_Api_Key = import.meta.env.VITE_GEO_KEY;
  let geo_Api_Key_Version_Two = import.meta.env.VITE_GEOTWO_KEY;
  // let [latitude, setLatitude] = useState('');
  // let [longitude, setLongitude] = useState('');
  const [miniImageloading, setMiniImageLoading] = useState(true);

  // both of these useStates is for the image Modal, for when the user clicks on the pictures
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!imageModal) {
    return null;
  }

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
    <div className="modal-overlay">
      <div className="modal-content">
        {/* warning false content*/}
        {imageModalIsOpen ? (
          <div className="imagemodal-overlay">
            <div
              className={
                isImageLoaded
                  ? 'imagemodal-content'
                  : 'loadingimagemodal-content'
              }
            >
              <div className="closeimagemodaldiv">
                <span>
                  <FontAwesomeIcon
                    icon={faX}
                    className={isImageLoaded ? 'x' : 'visibilityremove'}
                    onClick={() => {
                      setImageModalIsOpen(false);
                      closeImageModal();
                    }}
                  />
                </span>
              </div>

              <span className="closeimage-modal" onClick={closeImageModal}>
                &times;
              </span>

              <img
                src={selectedImage}
                alt="selected"
                className="modal-image"
                load="lazy"
                onLoad={handleImageLoad}
              />
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
          <FontAwesomeIcon
            icon={faX}
            className="xmodalclose"
            onClick={() => setImageModal(false)}
          />{' '}
        </div>
        <div className="modalcontainer">
          {chosenElement.photos.length !== 0 ? (
            <div className="modalimagediv">
              {chosenElement.photos.slice(0, 3).map((element, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => openImageModal(element.large, index)}
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
              })}
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
            {' '}
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
              <span> Posted on: </span> {formatDate(chosenElement.published_at)}{' '}
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
              <span> Spayed Neutered: </span>
              {chosenElement.attributes.spayed_neutered
                ? 'Neutered'
                : 'N/A'}{' '}
            </p>
            <p>
              {' '}
              <span> Shots Current: </span>{' '}
              {chosenElement.attributes.shots_current ? 'Current' : 'N/A'}{' '}
            </p>
          </div>
        </div>
        <div
          className={
            chosenElement.photos.length == 0
              ? 'importantinfodivversiontwo'
              : 'importantinfodiv'
          }
        >
          <div className="modalmapcontainer">
            <Modalmap
              chosenElement={chosenElement}
              // latitude={latitude}
              // longitude={longitude}
              // setLatitude={setLatitude}
              // setLongitude={setLongitude}
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
                </span>{' '}
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
  );
};

export default Modal;
