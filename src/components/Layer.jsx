import React from 'react';
import { useState, useEffect } from 'react';
import LinkedFunctions from './LinkedFunctions.jsx';
import FunctionModal from './FunctionModal.jsx';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, IconButton, Tooltip, Box } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const Layer = ({ layerName, versionNumber, ARN, functions }) => {
  // isCollapsed is tracked for each displayed Layer. true (default) means the Layer display is collapsed, false means the Layer box has expanded
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [associatedFunctions, setAssociatedFunctions] = useState([]);
  // isOpened is for the FunctionModal for each displayed Layer. true means the modal is opened, false (default) means the modal is not opened
  const [isOpened, setIsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssociatedFunctions = async () => {
    axios
      .post(
        'http://localhost:3000/layers/functions',
        { ARN: ARN },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setAssociatedFunctions(response.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  useEffect(() => {
    if (!isCollapsed) {
      fetchAssociatedFunctions();
    }
  }, [isCollapsed, isOpened]);

  const openModal = () => {
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  // function to get the array of function names which have been checked in the FunctionModal for a given Layer
  const linkFunction = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formResponse = new FormData(event.target);
    const arrayOfCheckedFunctions = [];
    for (const key of formResponse.keys()) {
      arrayOfCheckedFunctions.push(key);
    }
    try {
      const result = await axios.post(
        'http://localhost:3000/layers/add',
        { ARN: ARN, functionArray: arrayOfCheckedFunctions },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('result: ', result);
      setIsLoading(false);
      setIsOpened(false);
      return;
    } catch (error) {
      console.log('error: ', error);
      setIsLoading(false);
      setIsOpened(false);
      console.log('type ', typeof error.response.data);

      const messages = [];

      if (typeof error.response.data === 'string') {
        // push to array
        alert(error.response.data);
      } else {
        const errorArr = error.response.data;
        errorArr.forEach((message) => {
          console.log('error message: ', message);
          // push to array
          alert(message);
        });
      }
    }
  };

  // Errors with LodashFunction. Please fix lodash.defaultTo is not a function.

  // Error linking LodashFunction to layer arn:aws:lambda:us-east-1:524403604286:layer:LodashLayer:1. Please fix the following: lodash.defaultTo is not a function.

  return (
    <div id="layer">
      <button
        className="collapsible"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>
          {' '}
          Layer: {layerName}, Ver: {versionNumber}
          <br></br>
          ARN: {ARN}
        </span>
      </button>
      {!isCollapsed && (
        <div>
          <h3>Functions</h3>
          {isLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress
                sx={{
                  zIndex: 10,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          )}
          {associatedFunctions.map((element) => (
            <div>
              <LinkedFunctions
                functionName={element}
                ARN={ARN}
                fetch={fetchAssociatedFunctions}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          ))}

          {/* <Button variant='contained' size='small' onClick={() => openModal()} endIcon={<LibraryAddIcon/>} >Link Function</Button> */}
          <Box sx={{
            pl: 2.5,
          }}>
          <Tooltip title='Add Function' placement="top" arrow>
            <IconButton aria-label="add" onClick={() => openModal()}>
              <LibraryAddIcon fontSize='medium' color='info'/>
            </IconButton>
          </Tooltip> 
          </Box>
          <FunctionModal
            open={isOpened}
            closeFunction={closeModal}
            functions={functions}
            onSubmit={linkFunction}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Layer;
