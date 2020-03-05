import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enterStateFilter, setEnterStateFilter] = useState('');
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if(enterStateFilter === inputRef.current.value){
        const query =
        enterStateFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${enterStateFilter}"`;
      fetch('https://react-hook-e103b.firebaseio.com/ingredients.json' + query).then(
        response => response.json()
      ).then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        onLoadIngredients(loadedIngredients);
      });
      }
    }, 500);
    return  () => {
      clearTimeout(timer);
    };
  }, [enterStateFilter, onLoadIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef} 
            type="text"
            value={enterStateFilter}
            onChange={event => {
              setEnterStateFilter(event.target.value)
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
