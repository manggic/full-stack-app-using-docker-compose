import { useEffect, useState } from "react";

import "./App.css";

const apiURL = `${import.meta.env.VITE_API_URL}/api/message`
// const apiURL = `http://3.110.224.177:4000/api/message`


console.log({apiURL});


function App() {
  const [message, setMessage] = useState(0);

  useEffect(() => {
    fetch(apiURL)
      .then((res) => res.json())
      .then((res) => setMessage(res.message))
      .catch((err) => console.log(err));
  });
  return (
    <>
      <h1>Welcome to App </h1>
      <h2>docker compose + SSL certificate (nginx) + CI/CD pipeline ( github action ) </h2>
      <p>{`message : ${message}`}</p>
    </>
  );
}

export default App;
