import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const Imagemodal = ({
  imageModalisOpen,
  closeImageModal,
  selectedImage,
  setImageModalIsOpen,
  miniImageloading,
}) => {
  // console.log(selectedImage)

  if (!imageModalisOpen) return null;

  return (
    <div className="imagemodal-overlay">
      <div className="imagemodal-content">
        <div className="closeimagemodaldiv">
          <span>
            <FontAwesomeIcon
              icon={faX}
              className="x"
              onClick={() => {
                setImageModalIsOpen(false);
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
        />
      </div>
    </div>
  );
};

export default Imagemodal;
