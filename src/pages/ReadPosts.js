import React, { useEffect, useState, useCallback } from 'react';
import Card from '../components/Card';
import { supabase } from '../client';

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [isAscending, setIsAscending] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('Posts').select();

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error } = await query.order(sortBy, { ascending: isAscending });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }

    setLoading(false);
  }, [sortBy, isAscending, searchTerm]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="ReadPosts">
      <div className="sortAndSearchOptions">
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Created Time</option>
          <option value="upvotes">Upvotes Count</option>
        </select>
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Ascending' : 'Descending'}
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              created={post.created_at}
              title={post.title}
              author={post.author}
              description={post.description}
              initialCount={post.upvotes}
            />
          ))
        ) : (
          <h2>No Posts Found</h2>
        )
      )}
    </div>
  );
};

export default ReadPosts;
