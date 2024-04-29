import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import more from './more.png';
import { supabase } from '../client';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

const Card = (props) => {
  const [count, setCount] = useState(props.initialCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  const updateCount = async (e) => {
    e.stopPropagation(); 

    if (isLoading) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('Posts') 
        .update({ upvotes: count + 1 }) 
        .eq('id', props.id); 

      if (!error) {
        setCount((prevCount) => prevCount + 1); 
      } else {
        console.error('Error updating count:', error.message);
      }
    } catch (err) {
      console.error('Exception during update:', err.message);
    }

    setIsLoading(false);
  };

  const formattedDate = formatDate(props.created);

  return (
    <Link to={`/post/${props.id}`} className="Card"> 
      <div>
        <img className="moreButton" alt="more button" src={more} />
      </div>
      <div className="titleLine">
        <h2 className="title">{props.title}</h2>
        <h6 className="created">{"Posted on " + formattedDate}</h6>
      </div>
      <h3 className="author">{"by " + props.author}</h3>
      <p className="description">{props.description}</p>
      <button
        className="betButton"
        onClick={updateCount}
        disabled={isLoading}
      >
        👍 Upvotes: {count}
      </button>
    </Link>
  );
};

export default Card;
