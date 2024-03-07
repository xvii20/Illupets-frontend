import React from 'react';
import {
  Stack,
  Box,
  Typography,
  Tab,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Button,
  Tooltip,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from './getcurrentuser';
import noimg from './noimg.png';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const [value, setValue] = useState('1'); // The initial tab value of the page
  const [catObj, setCatObj] = useState([]);
  const [dogObj, setDogObj] = useState([]);
  const [rabbitObj, setRabbitObj] = useState([]);

  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const BACKENDLOCALHOST_PATH = import.meta.env.VITE_BACKENDLOCALHOST_PATH;
  const BACKENDCLOUDSERVERURL_PATH = import.meta.env
    .VITE_BACKENDCLOUDSERVERURL_PATH;

  async function fetchData() {
    let response = await axios.get(
      `${
        BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH
      }/${getCurrentUser()}/favorites`
    );
    // console.log(response);

    const catObjects = response.data.filter((obj) => obj.species === 'Cat');
    setCatObj(catObjects); // this wil only contain cats which will be displayed in the cat tab

    const dogObjectz = response.data.filter((obj) => obj.species === 'Dog');
    setDogObj(dogObjectz); // displays dog favorites

    const rabbitObjectz = response.data.filter(
      (obj) => obj.species === 'Rabbit'
    );
    setRabbitObj(rabbitObjectz); // displays rabbit favorites

    setLoading(false);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function deletePetFromFavorites(element, uid) {
    // console.log(element);
    let favoriteObject = element;
    let response = await axios.post(
      `${
        BACKENDCLOUDSERVERURL_PATH || BACKENDLOCALHOST_PATH
      }/${uid}/deletefavorites`,
      {
        favoriteObject,
      }
    );
    fetchData();
  }

  // If isLoading is true, render a loading component
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Stack direction="row" justifyContent="center">
        <Stack
          sx={{
            // outline: '2px solid violet',
            width: '90vw',
            height: '100vh',
            // maxHeight: '',
            maxWidth: '1000px',
            overflowY: 'auto',
          }}
        >
          <Stack
            sx={{ marginTop: '100px', flexWrap: 'wrap' }}
            direction="row"
            justifyContent="center"
          >
            <Typography variant="h6"> Favorites </Typography>
          </Stack>

          <TabContext value={value}>
            <Stack
              sx={{
                marginTop: '20px',
                borderColor: 'divider',
                borderBottom: '1px',
              }}
              direction="row"
              justifyContent="center"
            >
              <TabList onChange={handleChange} aria-label="tabs">
                <Tab
                  label="Cats"
                  value="1"
                  indicatorcolor="secondary"
                  // icon={}
                  iconPosition="start"
                />
                <Tab label="Dogs" value="2" />
                <Tab label="Rabbits" value="3" />
              </TabList>
            </Stack>
            <TabPanel value="1" sx={{}}>
              {' '}
              <Stack
                display="flex"
                direction="row"
                flexWrap="wrap"
                sx={{
                  '@media (max-width: 741px)': {
                    justifyContent: 'center',
                  },
                }}
              >
                {catObj.length == 0 ? (
                  <Stack
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    width="100%"
                    sx={{ marginTop: '60px' }}
                  >
                    {' '}
                    <Typography>Cat Favorites List Is Empty </Typography>
                  </Stack>
                ) : (
                  catObj.map((element, index) => {
                    return (
                      <Stack
                        key={element.id}
                        width="300px"
                        sx={{
                          outline: '2px solid black',
                          marginRight: '10px',
                          marginTop: '10px',
                          borderRadius: '4px',
                        }}
                      >
                        <Card
                          sx={{
                            height: 'fit-content',
                            minHeight: '350px',
                            position: 'relative',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={
                              element.images.length > 0
                                ? element.images[0].small
                                : noimg
                            }
                            alt=""
                            sx={{
                              objectFit: 'contain',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            onClick={function () {
                              navigate(
                                `/${getCurrentUser()}/${
                                  element.id
                                }/favoritepet`,
                                {
                                  state: element,
                                }
                              );
                            }}
                          ></CardMedia>

                          <CardContent>
                            <Stack direction="row" justifyContent="center">
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                {element.breed}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {element.description == null ? (
                                <Stack display="flex" alignItems="center">
                                  {' '}
                                  No Description{' '}
                                </Stack>
                              ) : (
                                element.description
                              )}
                            </Typography>
                          </CardContent>

                          <CardActions>
                            {/* <IconButton
                     
                            size="small"
                          ></IconButton> */}
                            <Tooltip
                              title="Remove Pet From Favorites"
                              placement="top"
                            >
                              <Button
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 10,
                                  right: 120,
                                }}
                                onClick={function () {
                                  deletePetFromFavorites(
                                    element,
                                    getCurrentUser()
                                  );
                                }}
                              >
                                {' '}
                                Remove{' '}
                              </Button>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Stack>
                    );
                  })
                )}
              </Stack>
            </TabPanel>
            <TabPanel value="2">
              <Stack
                display="flex"
                direction="row"
                flexWrap="wrap"
                sx={{
                  '@media (max-width: 741px)': {
                    justifyContent: 'center',
                  },
                }}
              >
                {dogObj.length == 0 ? (
                  <Stack
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    width="100%"
                    sx={{ marginTop: '60px' }}
                  >
                    {' '}
                    <Typography>Dog Favorites List Is Empty </Typography>
                  </Stack>
                ) : (
                  dogObj.map((element) => {
                    return (
                      <Stack
                        key={element.id}
                        width="300px"
                        sx={{
                          outline: '2px solid black',
                          marginRight: '10px',
                          marginTop: '10px',
                          borderRadius: '4px',
                        }}
                      >
                        <Card
                          sx={{
                            height: 'fit-content',
                            minHeight: '350px',
                            position: 'relative',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            display="flex"
                            direction="row"
                            justifyContent="center"
                            image={
                              element.images.length > 0
                                ? element.images[0].small
                                : noimg
                            }
                            alt=""
                            sx={{
                              objectFit: 'contain',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              // outline: '2px solid red',
                              maxWidth: '90%',
                              margin: '0 auto',
                            }}
                            onClick={function () {
                              navigate(
                                `/${getCurrentUser()}/${
                                  element.id
                                }/favoritepet`,
                                {
                                  state: element,
                                }
                              );
                            }}
                          ></CardMedia>

                          <CardContent>
                            <Stack direction="row" justifyContent="center">
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                {element.breed}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {element.description == null ? (
                                <Stack display="flex" alignItems="center">
                                  {' '}
                                  No Description{' '}
                                </Stack>
                              ) : (
                                element.description
                              )}
                            </Typography>
                          </CardContent>

                          <CardActions>
                            {/* <IconButton
                     
                            size="small"
                          ></IconButton> */}
                            <Tooltip
                              title="Remove Pet From Favorites"
                              placement="top"
                            >
                              <Button
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 10,
                                  right: 120,
                                }}
                                onClick={function () {
                                  deletePetFromFavorites(
                                    element,
                                    getCurrentUser()
                                  );
                                }}
                              >
                                {' '}
                                Remove{' '}
                              </Button>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Stack>
                    );
                  })
                )}
              </Stack>
            </TabPanel>

            <TabPanel value="3">
              <Stack
                display="flex"
                direction="row"
                flexWrap="wrap"
                sx={{
                  '@media (max-width: 741px)': {
                    justifyContent: 'center',
                  },
                }}
              >
                {rabbitObj.length == 0 ? (
                  <Stack
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    width="100%"
                    sx={{ marginTop: '60px' }}
                  >
                    {' '}
                    <Typography>Rabbit Favorites List Is Empty </Typography>
                  </Stack>
                ) : (
                  rabbitObj.map((element) => {
                    return (
                      <Stack
                        key={element.id}
                        width="300px"
                        sx={{
                          outline: '2px solid black',
                          marginRight: '10px',
                          marginTop: '10px',
                          borderRadius: '4px',
                        }}
                      >
                        <Card
                          sx={{
                            height: 'fit-content',
                            minHeight: '350px',
                            position: 'relative',
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            display="flex"
                            direction="row"
                            justifyContent="center"
                            image={
                              element.images.length > 0
                                ? element.images[0].small
                                : noimg
                            }
                            alt=""
                            sx={{
                              objectFit: 'contain',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              // outline: '2px solid red',
                              maxWidth: '90%',
                              margin: '0 auto',
                            }}
                            onClick={function () {
                              navigate(
                                `/${getCurrentUser()}/${
                                  element.id
                                }/favoritepet`,
                                {
                                  state: element,
                                }
                              );
                            }}
                          ></CardMedia>

                          <CardContent>
                            <Stack direction="row" justifyContent="center">
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                {element.breed}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {element.description == null ? (
                                <Stack display="flex" alignItems="center">
                                  {' '}
                                  No Description{' '}
                                </Stack>
                              ) : (
                                element.description
                              )}
                            </Typography>
                          </CardContent>

                          <CardActions>
                            {/* <IconButton
                     
                            size="small"
                          ></IconButton> */}
                            <Tooltip
                              title="Remove Pet From Favorites"
                              placement="top"
                            >
                              <Button
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 10,
                                  right: 120,
                                }}
                                onClick={function () {
                                  deletePetFromFavorites(
                                    element,
                                    getCurrentUser()
                                  );
                                }}
                              >
                                {' '}
                                Remove{' '}
                              </Button>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Stack>
                    );
                  })
                )}
              </Stack>
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </>
  );
}
