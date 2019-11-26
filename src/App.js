import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import axios from 'axios';
import DeleteButton from './components/DeleteButton';
import AddButton from './components/AddButton';
// import debounce from 'lodash/debounce';
import './App.css';
import { device } from './styles/Device';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
};

const FavoriteList = styled.li`
  background: rgba(255, 255, 255, 0.892);
  list-style: none;
  border-bottom: 1px solid #d8d8d8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.14);
  margin: 0;
  padding: 20px;
  border-radius: 4px;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: Roboto, 'Trebuchet MS', Arial, sans-serif;
  @media ${device.laptop} {
    width: 800px;
    max-width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-transform: capitalize;
  }
`;
const StyledH1 = styled.h1`
  font-family: Roboto, 'Trebuchet MS', Arial, sans-serif;
`;

const StyledH2 = styled.h2`
  font-family: Roboto, 'Trebuchet MS', Arial, sans-serif;
`;

const StyledInput = styled.input`
  font-family: Roboto, 'Trebuchet MS', Arial, sans-serif;
  width: 100%;
  max-width: 200px;
  box-sizing: border-box;
  letter-spacing: 1px;
  color: black;
  margin: 0 20px;
  &::focus {
    outline: none;
  }
`;

const Page = styled.div`
  background-color: white;
  height: 100vh;
  width: 100%;
  margin: 0 auto;

  @media ${device.laptop} {
    width: 100%;
    max-width: 800px;
  }
`;
function App() {
  const [list, setList] = useState([]);
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [singular, setSingular] = useState(false);

  function removeFavorite(id) {
    const newList = list.filter(item => item.objectID !== id);
    setList(newList);
  }
  function addFavorite(id) {
    const dateAdded = new Date(Date.now()).toLocaleString('sv-SE');
    const newList = data.hits.filter(item => item.objectID === id);
    const newObject = newList[0];
    newObject.dateAdded = dateAdded;

    const duplicateExists = list.filter(
      item => item.objectID === newObject.objectID
    );

    if (duplicateExists.length === 0) {
      setList(list => [...list, newObject]);
      setSingular(true);
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 1200);
    } else {
      setSingular(false);
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 1200);
    }
  }
  useEffect(() => {
    if (query.length === 0) {
      setData({ hits: [] });
    }
    if (query.length < 3) return;
    const getDataFromAPI = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`
      );
      const filterFromNull = result.data.hits.filter(
        item => item.title !== null && item.title !== ''
      );
      setData({ hits: filterFromNull });
    };
    getDataFromAPI();
  }, [query]);

  return (
    <ThemeProvider theme={theme}>
      <Page className='App'>
        <StyledH1>Welcome to the test page</StyledH1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <StyledH2>
            Search for articles here, and add them to your list of favorites
          </StyledH2>
          <label htmlFor='textinput'>Search for an article here:</label>
          <StyledInput
            name='textinput'
            id='textinput'
            placeholder='Type something...'
            type='text'
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <div style={{ height: '20px', margin: '5px' }}>
            {visible === true && (
              <span>
                {singular ? `Added to favorite!` : `Favorite already added...`}
              </span>
            )}
          </div>

          <ul style={{ padding: 0 }}>
            {data.hits.map(item => (
              <FavoriteList key={item.objectID} id={item.objectID}>
                <a href={item.url}>{item.title}</a>
                <AddButton
                  text={'Add'}
                  ariaLabel={'Add Button'}
                  onClick={() => addFavorite(item.objectID)}
                />
              </FavoriteList>
            ))}
          </ul>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {list.length > 0 && list.length === 1 && (
            <StyledH2>
              I currently have {list.length} favorite article, soo exciting!
            </StyledH2>
          )}
          {list.length > 0 && list.length > 1 && (
            <StyledH2>
              I currently have {list.length} favorite articles, oh boy!
            </StyledH2>
          )}

          <ul id='favorites' style={{ padding: 0 }}>
            {list.map(item => (
              <FavoriteList key={item.objectID}>
                <a href={item.url}>{item.title}</a>
                <span>Added on: {item.dateAdded}</span>
                <DeleteButton
                  text={'Delete'}
                  ariaLabel={'Delete Button'}
                  onClick={() => removeFavorite(item.objectID)}
                />
              </FavoriteList>
            ))}
          </ul>
        </div>
      </Page>
    </ThemeProvider>
  );
}

export default App;
