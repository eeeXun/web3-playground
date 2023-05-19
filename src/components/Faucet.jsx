import { useState } from "react";
import Web3 from "web3";

const Faucet = () => {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const address = "0xD75035e79411558b24a553b6cDf7439488C20457";
  const web3 = new Web3(window.ethereum);

  window.ethereum
    .request({
      method: "eth_getBalance",
      params: [String(address)],
    })
    .then((result) => {
      setBalance(
        `${Web3.utils.toBN(result)} wei (${Web3.utils.fromWei(
          String(result)
        )} ETH)`
      );
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
    // https://github.com/snsd0805/Testnet_faucet_web/blob/master/src/views/FaucetView.vue#L36-L55
    const encodeFunctionCall = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
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
    <div className="text-xl m-1">
      <div className="text-blue-600">
        <p>Contract Address: {address}</p>
        <p>Balance: {balance}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendToContract();
          }}
          className="my-2"
        >
          <label className="text-blue-600" htmlFor="sendInput">
            Send (wei):
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
            {Web3.utils.fromWei(String(sendAmount))} (ETH)
          </button>
        </form>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            withdraw();
          }}
          className="my-2"
        >
          <label className="text-blue-600" htmlFor="amountInput">
            Withdraw (wei):
          </label>
          <input
            className="border-2 rounded-lg border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
            id="amountInput"
            type="number"
            onChange={(event) => setWithdrawAmount(event.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            type="submit"
          >
            {Web3.utils.fromWei(String(withdrawAmount))} (ETH)
          </button>
        </form>
      </div>
    </div>
  );
};

export default Faucet;
