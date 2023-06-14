import HomePage from "./views/HomePage";
import Web3Page from "./views/Web3Page";
import Faucet from "./components/Faucet";
import ERC20 from "./components/ERC20";
import DiplomaGrant from "./components/DiplomaGrant";
import DiplomaView from "./components/DiplomaView";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <div className="text-center">
      <nav className="flex space-x-4 text-2xl bg-blue-400">
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/">
          Home
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/faucet">
          Faucet
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/erc20">
          ERC20
        </Link>
        <Link
          className="text-white rounded-lg hover:bg-blue-500"
          to="/dpmgrant"
        >
          Diploma Grant
        </Link>
        <Link className="text-white rounded-lg hover:bg-blue-500" to="/dpmview">
          Diploma View
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/faucet"
          element={<Web3Page component={Faucet} pagename={"Faucet"} />}
        ></Route>
        <Route
          path="/erc20"
          element={<Web3Page component={ERC20} pagename={"ERC20"} />}
        ></Route>
        <Route
          path="/dpmgrant"
          element={
            <Web3Page component={DiplomaGrant} pagename={"Diploma Grant"} />
          }
        ></Route>
        <Route
          path="/dpmview"
          element={
            <Web3Page component={DiplomaView} pagename={"Diploma View"} />
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
