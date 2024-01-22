import React, { useEffect } from 'react';
import { MyMapComponent } from './map';
import {
  stateOptions,
  stateAbbreviations,
  reverseStateAbbreviations,
} from './states';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import catProfilePic from './catprofilepic.jpg';
import ReactPaginate from 'react-paginate';
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
import Modal from './modal';
import ScrollToTopButton from './scrollup';

export default function Mainbody({
  closeModal,
  setCloseModal,
  gridView,
  mapView,
}) {
  const clientId = import.meta.env.VITE_API_KEY; // works
  const clientSecret = import.meta.env.VITE_SECRET_KEY; // works

  let navigate = useNavigate();

  // State to store the selected state
  const [selectedState, setSelectedState] = useState('');

  const [selectedPet, setSelectedPet] = useState('');
  const [selectedGender, setSelectedGender] = useState('Does not matter');
  const [selectedBreed, setSelectedBreed] = useState('');

  const petOptions = ['Cats', 'Rabbits', 'Dogs'];
  const genderOptions = ['Does not matter', 'Male', 'Female'];

  // paginations
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  let [apiResponse, setApiResponse] = useState('');

  let [nextApiResponse, setNextApiResponse] = useState('');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  let [touched, setTouched] = useState(false);

  let [imageModal, setImageModal] = useState(false);
  let [chosenElement, setChosenElement] = useState('');

  // Step 1: Obtain OAuth 2.0 Tokenlet accessToken = null;
  let accessToken = null;

  function toggleImageModal() {
    // setImageModal((prevState) => !prevState);
    setImageModal(true);
  }

  const fetchData = async () => {
    setLoading(true);

    try {
      const currentAccessToken = await getAccessToken();

      let apiUrl = `https://api.petfinder.com${nextApiResponse.pagination._links.next.href}`;
      // console.log(apiUrl, 'aqqq');
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
      });

      // Extract the data from the Axios response
      const newItems = response.data;

      // Update the state with the new data
      setApiResponse((prevItems) => [
        ...prevItems,
        ...(newItems.animals || []), //   if newItems.animals is falsy then it will do this ...[]  and console.log(...[], 'empty'); gives you nothing
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // infinite loading
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Check if the user has scrolled to the bottom of the page
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      // Trigger fetching data when the user scrolls to the bottom
      fetchData();
    }
  };

  // Add a scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, loading]); // Include loading as a dependency to avoid potential issues

  // Step 1: Obtain OAuth 2.0 Token
  const getAccessToken = async () => {
    if (accessToken) {
      return accessToken; // Return the existing token if it's still valid
    }

    const oauthUrl = 'https://api.petfinder.com/v2/oauth2/token';
    const requestBody = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    try {
      const response = await axios.post(oauthUrl, requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      accessToken = response.data.access_token;
      return accessToken;
    } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error;
    }
  };

  const getAnimalsList = async () => {
    try {
      const currentAccessToken = await getAccessToken();

      if (!selectedState || !selectedPet) {
        alert('Missing fields');
        return;
      }

      // console.log(stateAbbreviations[selectedState], 'stateabb');
      // get a specific pet based on a specific location
      // if a selectedGender is selected, we add the &gender to the url
      const apiUrl = `https://api.petfinder.com/v2/animals?type=${selectedPet
        .toLowerCase()
        .slice(0, -1)}&location=${stateAbbreviations[selectedState]}${
        selectedGender === 'Male' || selectedGender === 'Female'
          ? `&gender=${selectedGender.toLowerCase()}`
          : ''
      }`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
      });

      // console.log(response.data);

      setNextApiResponse(response.data);

      // Replace existing animals with the new ones
      setApiResponse(response.data.animals);
    } catch (error) {
      console.error('Error getting Animals list:', error);
      // Handle the error here
    }
  };

  // Event handler for changing the selected state
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handlePetChange = (event) => {
    setSelectedPet(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  function toggleModal() {
    setCloseModal((prevState) => !prevState);
  }

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

  // this function makes the phone number of the post look nicer and neater
  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }

    // Return the original number if it doesn't match the expected format
    return phoneNumber;
  }

  // depending on what the user chose, the handleSearch function will call different functions
  async function handleSearch() {
    let response = await getAnimalsList();
    setTouched(true);
  }

  return (
    <>
      <div className="mediafilter">
        {' '}
        <span onClick={toggleModal}>
          {' '}
          {closeModal ? 'Open Modal' : 'Close Filter'}{' '}
        </span>
      </div>
      {apiResponse ? (
        <div className="animalheadingdiv">
          {' '}
          {selectedPet == 'Dogs' ? <h1> Adoptable {selectedPet} 🐕 </h1> : ''}
          {selectedPet == 'Cats' ? <h1> Adoptable {selectedPet} 🐈 </h1> : ''}
          {/* {selectedPet == 'Birds' ? <h1> Adoptable {selectedPet} 🕊️ </h1> : ''} */}
          {selectedPet == 'Rabbits' ? (
            <h1> Adoptable {selectedPet} 🐰 </h1>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      <div className={gridView ? 'gridcontainer' : 'hide'}>
        {apiResponse ? (
          <>
            <div className="apidiv" style={{ width: closeModal ? '100%' : '' }}>
              <div className="apiresponsecontainer">
                {apiResponse.map(
                  (element, index) =>
                    element.contact.address.state ==
                      stateAbbreviations[selectedState] &&
                    element.species == selectedPet.slice(0, -1) && (
                      <div key={index} className="singleparentcontainer">
                        <div className="apiimagecontainer">
                          <img
                            className="apiresponseimage"
                            onClick={() => {
                              let theChosenElement = apiResponse.find(
                                (elementtwo) => {
                                  return elementtwo.id == element.id;
                                }
                              );
                              setChosenElement(theChosenElement);
                              // console.log(theChosenElement, 'chosen element'); // sets the element to the found object
                              toggleImageModal();
                              setLoading(false);
                            }}
                            loading="lazy"
                            alt="an unknown cat"
                            src={
                              element.primary_photo_cropped
                                ? element.primary_photo_cropped.small
                                : catProfilePic
                            }
                          />
                        </div>
                        {imageModal ? (
                          <Modal
                            imageModal={imageModal}
                            setImageModal={setImageModal}
                            chosenElement={chosenElement}
                            loading={loading}
                          />
                        ) : (
                          ' '
                        )}

                        <div className="info">
                          <div className="title">
                            {' '}
                            <h1> {element.breeds.primary}</h1>{' '}
                          </div>
                          <div className="stateinfo">
                            {' '}
                            <h1>
                              State:
                              {' ' +
                                reverseStateAbbreviations[
                                  element.contact.address.state
                                ]}
                            </h1>
                          </div>
                          <div className="phonecontactinfo">
                            {' '}
                            <h1>
                              {' '}
                              Phone:{' '}
                              {element.contact.phone
                                ? '+1' +
                                  ' ' +
                                  formatPhoneNumber(element.contact.phone)
                                : 'N/A'}{' '}
                            </h1>
                          </div>
                          <div className="contactinfo">
                            {' '}
                            <h1> Email: {element.contact.email}</h1>
                          </div>{' '}
                          <h2> Breed: {element.breeds.primary}</h2>
                        </div>
                        <div className="info">
                          {' '}
                          <h2> Age: {element.age}</h2>
                        </div>

                        <div className="info">
                          {' '}
                          <h2> Gender: {element.gender}</h2>
                        </div>
                        <div className="info">
                          {' '}
                          <h2>
                            {' '}
                            Status:{' '}
                            {element.status.charAt(0).toUpperCase() +
                              element.status.substring(1)}
                          </h2>
                        </div>
                        <div className="info">
                          {' '}
                          <h2>
                            {' '}
                            Posted on: {formatDate(element.published_at)}
                          </h2>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        <div className={closeModal ? 'hide' : 'filter'}>
          <div className="findapetdiv">
            {' '}
            <h1> Find a Pet</h1>{' '}
          </div>

          <div>
            <div className="typeofpetdiv">
              {' '}
              <h2> Type of Pet </h2>{' '}
            </div>

            <div className="selectapetdiv">
              {/* <label htmlFor="petSelect" className="selectapetlabel">
                Select a Pet:
              </label> */}
              <select
                id="petSelect"
                value={selectedPet}
                onChange={handlePetChange}
              >
                <option disabled value="">
                  -- Select a Pet --
                </option>
                {petOptions.map((pet, index) => (
                  <option key={index} value={pet}>
                    {pet}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {' '}
              <div className="genderheadingdiv">
                {' '}
                <h2>Gender</h2>{' '}
              </div>
              <div className="genderselectdiv">
                <select
                  id="genderSelect"
                  value={selectedGender}
                  onChange={handleGenderChange}
                >
                  {/* <option value={gender}> Both </option> */}
                  {genderOptions.map((gender, index) => (
                    <option key={index} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            {' '}
            <div className="statediv">
              {' '}
              <h2> State </h2>{' '}
            </div>
          </div>
          <div className="selectcontainer">
            <div className="selectastatediv">
              <select
                id="stateSelect"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option disabled value="">
                  -- Select a State --
                </option>
                {stateOptions.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="searchdiv">
              {' '}
              <button onClick={handleSearch}> Search </button>{' '}
            </div>
          </div>
        </div>
      </div>
      {gridView ? (
        ''
      ) : (
        <div className="mapcontainer">
          <MyMapComponent closeModal={closeModal} />

          <div className={closeModal ? 'hide' : 'g'}>
            <div className="closediv">
              {' '}
              <span>
                {' '}
                <FontAwesomeIcon
                  icon={faX}
                  className="x"
                  onClick={toggleModal}
                />{' '}
              </span>
            </div>

            <div className="findapetdiv">
              {' '}
              <h1> Find a Pet</h1>{' '}
            </div>

            <div>
              <div className="typeofpetdiv">
                {' '}
                <h2> Type of Pet </h2>{' '}
              </div>

              <div className="selectapetdiv">
                {/* <label htmlFor="petSelect" className="selectapetlabel">
                Select a Pet:
              </label> */}
                <select
                  id="petSelect"
                  value={selectedPet}
                  onChange={handlePetChange}
                >
                  <option disabled value="">
                    -- Select a Pet --
                  </option>
                  {petOptions.map((pet, index) => (
                    <option key={index} value={pet}>
                      {pet}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {' '}
                <div className="genderheadingdiv">
                  {' '}
                  <h2>Gender</h2>{' '}
                </div>
                <div className="genderselectdiv">
                  <select
                    id="genderSelect"
                    value={selectedGender}
                    onChange={handleGenderChange}
                  >
                    {/* <option value={gender}> Both </option> */}
                    {genderOptions.map((gender, index) => (
                      <option key={index} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              {' '}
              <div className="statediv">
                {' '}
                <h2> State </h2>{' '}
              </div>
            </div>
            <div className="selectcontainer">
              <div className="selectastatediv">
                <select
                  id="stateSelect"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option disabled value="">
                    -- Select a State --
                  </option>
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="searchdiv">
                {' '}
                <button onClick={getAnimalsList}> Search </button>{' '}
              </div>
            </div>
          </div>
        </div>
      )}
      <ScrollToTopButton imageModal={imageModal} />
    </>
  );
}
