import MetaMask from "./MetaMask";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <div className="text-center">
      <nav className="flex space-x-4 bg-blue-400 text-2xl">
        <Link className="text-white hover:bg-blue-500 rounded-lg" to="/">
          Home
        </Link>
        <Link className="text-white hover:bg-blue-500 rounded-lg" to="/faucet">
          Faucet
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Hello world!</h1>}></Route>
        <Route
          path="/faucet"
          element={
            <>
              <h1 className="text-blue-600 text-5xl font-bold my-8">
                Web3 Faucet
              </h1>
              <MetaMask />
            </>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
