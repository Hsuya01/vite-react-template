import React, { useState } from "react";
import "./CreatePost.css";
import { supabase } from "../client";

const CreatePost = () => {
  const [post, setPost] = useState({ title: "", author: "", description: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createPost = async (event) => {
    event.preventDefault(); 
  
    const { data, error } = await supabase
      .from("Posts")
      .insert([{
        title: post.title,
        author: post.author,
        description: post.description,
      }]);
  
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Post created:', data);
      window.location = "/"; 
    }
  };
  

  

  return (
    <div>
      <form>
        <label>Title</label> <br />
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Author</label>
        <br />
        <input
          type="text"
          id="author"
          name="author"
          value={post.author}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Description</label>
        <br />
        <textarea
          name="description"
          rows="5"
          cols="50"
          id="description"
          value={post.description}
          onChange={handleChange}
        ></textarea>
        <br />
        <input type="submit" value="Submit" onClick={createPost} />
      </form>
    </div>
  );
};

export default CreatePost;
