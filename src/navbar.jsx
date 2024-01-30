import React from 'react';
import SvgComponent from './svg';

export default function Navbar({
  gridView,
  setGridView,
  mapView,
  setMapView,
  closeModal,
  setCloseModal,
}) {
  function toggleModal() {
    setCloseModal((prevState) => !prevState);
  }

  function toggleGridView() {
    setGridView((prevState) => !prevState);
  }

  return (
    <>
      <div className="wrapper">
        <div className="navbar">
          <h1
            onClick={
              // Function to reload the page
              function reloadPage() {
                location.reload();
              }
            }
          >
            {' '}
            Illupets
          </h1>

          <ul className="navunorderedlist">
            <li onClick={toggleGridView}>
              {' '}
              {/* {gridView ? 'Mapview' : 'Gridview'} */}
            </li>
            <li onClick={toggleModal}>
              {' '}
              {closeModal ? 'Open Filter' : 'Close Filter'}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
