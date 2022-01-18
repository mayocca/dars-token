import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Layout from "./views/Layout";
import Mint from "./views/Mint";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/mint' element={<Mint />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
