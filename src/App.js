import "./App.css";
import React, { useState, useEffect } from "react";
import { useRoutes, Link } from "react-router-dom";
import ReadPosts from "./pages/ReadPosts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); 

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev); 
  };

  useEffect(() => {
    const body = document.body;
    if (isDarkTheme) {
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
    }
  }, [isDarkTheme]);

  const routes = useRoutes([
    {
      path: "/",
      element: <ReadPosts />,
    },
    {
      path: "/edit/:id",
      element: <EditPost />,
    },
    {
      path: "/new",
      element: <CreatePost />,
    },
    {
      path: "/post/:id",
      element: <PostDetail />,
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <h1>Coin Collector's Forum</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
        </button>

        <Link to="/">
          <button className="headerBtn"> Explore Posts </button>
        </Link>

        <Link to="/new">
          <button className="headerBtn"> Submit a Post </button>
        </Link>
      </div>
      {routes} 
    </div>
  );
};

export default App;
