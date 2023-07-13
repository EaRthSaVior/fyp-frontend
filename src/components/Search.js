import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SearchBox from './SearchBox';
import CardGrid from './CardGrid';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateSearchTerm,updateGridCardState,updatePageRef  } from '../actionTypes';


const Search = ({ searchTerm, filterOptions, updateSearchTerm }) => {
  // const [lists, setLists] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filterOptions, setFilterOptions] = useState({
  //   sort: "Newest",
  //   type: "All",
  //   language: "All",
  //   numQues: "All"
  // });
  const dispatch = useDispatch();
  const [done, setDone] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadCards = async () => {
    if (searchTerm.trim() !== '') {
    try {
      setHasMore(true);
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const url = new URL('http://localhost:5000/list/search/');
      url.searchParams.append('title', searchTerm);
      url.searchParams.append('page', 1); // Access the mutable reference
      url.searchParams.append('perPage', '12');
      url.searchParams.append('order', filterOptions.sort);
      url.searchParams.append('type', filterOptions.type);
      url.searchParams.append('language', filterOptions.language);
      url.searchParams.append('num', filterOptions.numQues);
      console.log(url.toString());
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.length < 12 || data === null) {
        setHasMore(false);
        console.log('No more data');
        setDone(true);
      }
 
      dispatch(updateGridCardState([...data]));
  
      dispatch(updatePageRef(2));
  
    } catch (error) {
      console.error('Failed to load cards:', error);
    }

    setIsLoading(false);
  }
  };


  const handleSearchChange = (newSearchTerm) => {
    setDone(false);
    updateSearchTerm(newSearchTerm);
  };

  return (
    <>
      <SearchBox loadCards={loadCards} searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      <Container className='Container'>

        <div className='mt-3 '>
          <div className="my-2">
            <CardGrid done={done} hasMore={hasMore} setHasMore={setHasMore} isLoading={isLoading} setIsLoading={setIsLoading} filterOptions={filterOptions}  />
          </div>
        </div>
      </Container>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm,
    filterOptions: state.search.filterOptions,
    cards: state.gridCard.cards, // Assuming you have defined the grid card state in the gridCard reducer
    pageRef:state.gridCard.pageRef
  };
};

const mapDispatchToProps = {
  updateSearchTerm,
  updateGridCardState,
  updatePageRef,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

