import React, { useState, useEffect ,useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Search.css';
import { Button } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { updateSearchTerm, updateFilterOptions } from '../actionTypes';
import { connect } from 'react-redux';
const SearchBox = ({ loadCards, filterOptions, updateFilterOptions, searchTerm, onSearchChange }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [tempFilterOptions, setTempFilterOptions] = useState(filterOptions);
  const dispatch = useDispatch();


  const handleClear = () => {
    dispatch(updateSearchTerm(""));
  }
  const handleFilterClick = () => {
    setShowFilter(!showFilter);

  };
  const handleClose = () => {
 
    setShowFilter(!showFilter);
  }
  const [hasScrolled, setHasScrolled] = useState(false);
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const shouldShowShadow = scrollTop > 0;
      setHasScrolled(shouldShowShadow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadCards()
    }
  };
  // const handleOnBlur = () => {
  //   loadCards()
  // }

  const handleReset = () => {


    updateFilterOptions({
      ...filterOptions,
      sort: 'Newest',
      type: 'All',
      language: 'All',
      numQues: 'All'
    })



  };

  const handleApply = () => {
    // updateFilterOptions({...filterOptions,  sort: tempFilterOptions.sort});
    setShowFilter(false);
    loadCards();

  };


  const handleSortChange = (event) => {
    dispatch(updateFilterOptions({ ...filterOptions, sort: event.target.value }));
  };

  const handleTypeChange = (event) => {
    dispatch(updateFilterOptions({ ...filterOptions, type: event.target.value }));
  };

  const handleLanguageChange = (event) => {
    dispatch(updateFilterOptions({ ...filterOptions, language: event.target.value }));
  };

  const handleNumChange = (event) => {
    dispatch(updateFilterOptions({ ...filterOptions, numQues: event.target.value }));
  };

  return (
    <>
      <div className={`header ${hasScrolled ? 'header-shadow' : ''}`}>
        <div className="header-content1">
          <div className="search-bar">
            <div className="search-input">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                className="searchText"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                // onBlur={handleOnBlur}
       
              />
              <div className="filter-button">
                {searchTerm && (
                  <button className="closes-button" onClick={handleClear}>
                    <FontAwesomeIcon icon={faTimes} style={{ width: '24px', height: '24px' }} />
                  </button>)}
                <hr className="separator-line" />
                <button className="slider-button" onClick={handleFilterClick}>
                  <FontAwesomeIcon icon={faSliders} className="slider-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFilter && (
        <>
          <div className="overlay" onClick={handleClose} />
          <div className="filter-card-pop-up">
            <div className="filter-card-header">
              <span className="filter-card-title">Filter</span>
              <button className="close-button" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} style={{ width: '32px', height: '32px' }} />
              </button>
            </div>

            <div className="input-container">
              <label htmlFor="sort">Sort By</label>
              <select id="sort" value={filterOptions.sort} onChange={handleSortChange}>
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="type">Type</label>
              <select id="type" value={filterOptions.type} onChange={handleTypeChange}>
                <option value="All">All</option>
                <option value="MCQ">MCQ</option>
                <option value="True/False">True/False</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="language">Language</label>
              <select id="language" value={filterOptions.language} onChange={handleLanguageChange}>
                <option value="All">All</option>
                <option value="English">English</option>
                <option value="Malay">Malay</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="num">Number of questions</label>
              <select id="num" value={filterOptions.numQues} onChange={handleNumChange}>
                <option value="All">All</option>
                <option value="10">Less than 10</option>
                <option value="1020">10 - 20</option>
                <option value="20">More than 20</option>
              </select>
            </div>
            <div className="text-end">
              <Button variant="outline-secondary" className="me-2" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="secondary" className="me-2" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    searchTerm: state.search.searchTerm,
    filterOptions: state.search.filterOptions,
  };
};
const mapDispatchToProps = {

  updateFilterOptions,

};


export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
