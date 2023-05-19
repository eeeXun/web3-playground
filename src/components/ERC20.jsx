import { useState } from "react";
import Web3 from "web3";
import ERC20ABI from "../data/ERC20.json";

const ERC20 = () => {
  const [name, setName] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [balance, setBalance] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [sendAmount, setSendAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const address = "0x88f2C6cB8aaCca74a4bF79FCD6683F2dD8cCCe26";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(ERC20ABI, address);

  contract.methods
    .name()
    .call()
    .then((result) => {
      setName(result);
    });
  contract.methods
    .symbol()
    .call()
    .then((result) => {
      setSymbol(result);
    });
  contract.methods
    .balanceOf(window.ethereum.selectedAddress)
    .call()
    .then((result) => {
      setBalance(result);
    });
  contract.methods
    .remaining()
    .call()
    .then((result) => {
      setRemaining(result);
    });
  contract.methods
    .decimals()
    .call()
    .then((result) => {
      setDecimals(result);
    });

  const sendToContract = () => {
    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: window.ethereum.selectedAddress,
            to: address,
            value: Web3.utils.toHex(sendAmount),
          },
        ],
      })
      .then((txHash) => console.log(txHash));
  };

  const withdraw = () => {
    const encodeFunctionCall = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokens",
            type: "uint256",
          },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [web3.utils.toBN(withdrawAmount)]
    );
    const transactionParameters = {
      from: window.ethereum.selectedAddress,
      to: address,
      data: encodeFunctionCall,
      value: "0x00",
    };
    console.log(encodeFunctionCall);
    console.log(transactionParameters);

    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })
      .then((txHash) => {
        console.log(txHash);
      });
  };

  return (
    <div className="text-xl m-1 text-blue-600">
      <p>ERC20 Address: {address}</p>
      <p>
        Name: {name}({symbol})
      </p>
      <p>
        Remaining: {remaining} ({remaining / 10 ** decimals} {symbol})
      </p>
      <p>
        Your Balance: {balance} ({balance / 10 ** decimals} {symbol})
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendToContract();
        }}
        className="my-2"
      >
        <label className="text-blue-600" htmlFor="sendInput">
          Buy Token (wei):
        </label>
        <input
          className="border-2 rounded-lg border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="sendInput"
          type="number"
          onChange={(event) => setSendAmount(event.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          type="submit"
        >
          {Math.floor(sendAmount * 10)} (token)
        </button>
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          withdraw();
        }}
        className="my-2"
      >
        <label className="text-blue-600" htmlFor="sendInput">
          Withdraw ETH with token (token):
        </label>
        <input
          className="border-2 rounded-lg border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="sendInput"
          type="number"
          onChange={(event) => setWithdrawAmount(event.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          type="submit"
        >
          {Math.floor(withdrawAmount / 10)} (wei)
        </button>
      </form>
    </div>
  );
};

export default ERC20;
