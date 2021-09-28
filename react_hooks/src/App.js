import React, { useState, useEffect } from "react";

function countInitial() {
  console.log("run function");
  return 4;
}

function App() {
  // called in the same order
  // pass in function will only run once, a value will run every time when updates
  const [count, setCount] = useState(countInitial);
  const [theme, setTheme] = useState("blue");

  // use effect
  const [resourceType, setResourceType] = useState("posts");
  const [items, setItems] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then((resp) => resp.json())
      .then((json) => setItems(json));
    console.log("resource changed")

    return () => {
      console.log("return from resource change")
    }
  }, [resourceType]); // if don't specify array, update on everything, else only update whenever stuff in the array updates

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // this function is called when useEffect cleans up (when useEffect runs next time, returns cleans up first and then runs the next useEffect)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []);

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <button onClick={() => setCount((prevState) => prevState - 1)}>
          -
        </button>
        <span>{count}</span>
        <span>{theme}</span>
        <button onClick={() => setCount((prevState) => prevState + 1)}>
          +
        </button>
      </div>
      <div>
        <button onClick={() => setResourceType("posts")}>Posts</button>
        <button onClick={() => setResourceType("users")}>Users</button>
        <button onClick={() => setResourceType("comments")}>Comments</button>
        <h1>{resourceType}</h1>
        {/* {items.map((item) => (
          <pre>{JSON.stringify(item)}</pre>
        ))} */}
      </div>
      <div>{windowWidth}</div>
    </div>
  );
}

export default App;
