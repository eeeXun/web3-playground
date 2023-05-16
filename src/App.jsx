import MetaMask from "./MetaMask";
import Faucet from "./Faucet";

const App = () => {
  return (
    <div className="text-center">
      <h1 className="text-blue-600 text-5xl font-bold my-8">Web3 Faucet</h1>
      <MetaMask />
      {/* <Faucet /> */}
    </div>
  );
};

export default App;
