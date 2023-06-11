import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import MetaMask from "../components/MetaMask";
import ERC20 from "../components/ERC20";

const ERC20Page = () => {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [onSepolia, setOnSepolia] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    document.title = "Web3 ERC20";
  });

  const connectWallect = () => {
    detectEthereumProvider().then((result) => {
      if (result) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            setAccount([result[0]]);
          });
        setErrMsg(null);
        getChain();
      } else {
        setErrMsg("Install MetaMask!");
      }
    });
  };

  const getChain = () => {
    window.ethereum.request({ method: "eth_chainId" }).then((result) => {
      switch (parseInt(result, 16)) {
        case 11155111:
          setChain("Sepolia");
          setOnSepolia(true);
          break;
        case 5:
          setChain("Goerli");
          setOnSepolia(false);
          setErrMsg("Not supported");
          break;
        case 1337:
          setChain("Ganache");
          setErrMsg("Not supported");
          setOnSepolia(false);
          break;
        default:
          setChain("Chain not recognized!");
          setErrMsg("Not supported");
          setOnSepolia(false);
          break;
      }
    });
  };

  return (
    <>
      <h1 className="my-8 text-5xl font-bold text-blue-600">Web3 ERC20</h1>
      {account ? (
        <>
          <div className="m-3 rounded-lg border-2 border-blue-400">
            <MetaMask account={account} chain={chain} />
          </div>
          {onSepolia ? (
            <div className="m-3 rounded-lg border-2 border-blue-400">
              <ERC20 />
            </div>
          ) : null}
          <h3 className="m-3 text-red-600">{errMsg}</h3>
          <button
            className="text-xl text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            onClick={connectWallect}
          >
            Refresh
          </button>
        </>
      ) : (
        <button
          className="text-xl text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          onClick={connectWallect}
        >
          Connect to MetaMask
        </button>
      )}
    </>
  );
};

export default ERC20Page;
