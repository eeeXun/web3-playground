import Web3 from "web3";

const DiplomaIssue = () => {
  const address = "0xcc992df785726B88aAED17577727F8B9a1eE927A";
  const web3 = new Web3(window.ethereum);

  const issue_diploma = (event) => {
    event.preventDefault();
    const encodeFunctionCall = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "degree",
            type: "string",
          },
          {
            internalType: "string",
            name: "department",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "year",
            type: "uint256",
          },
        ],
        name: "award",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [
        event.target.elements.sendAddress.value,
        event.target.elements.name.value,
        event.target.elements.degree.value,
        event.target.elements.deparment.value,
        event.target.elements.year.value,
      ]
    );
    const transactionParameters = {
      from: window.ethereum.selectedAddress,
      to: address,
      data: encodeFunctionCall,
      value: "0x00",
    };

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
    <div className="m-1 text-xl text-blue-600">
      <p>Contract Address: {address}</p>
      <form onSubmit={issue_diploma} className="my-2">
        <label className="text-blue-600" htmlFor="sendAddress">
          To (address):
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="sendAddress"
          name="sendAddress"
          type="text"
          required
        />
        <br />
        <label className="text-blue-600" htmlFor="name">
          Name:
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="name"
          name="name"
          type="text"
          required
        />
        <br />
        <label className="text-blue-600" htmlFor="degree">
          Degree:
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="degree"
          name="degree"
          type="text"
          required
        />
        <br />
        <label className="text-blue-600" htmlFor="deparment">
          Department:
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="deparment"
          name="deparment"
          type="text"
          required
        />
        <br />
        <label className="text-blue-600" htmlFor="year">
          Year:
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="year"
          name="year"
          type="number"
          required
        />
        <br />
        <button
          className="text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          type="submit"
        >
          Issue
        </button>
      </form>
    </div>
  );
};

export default DiplomaIssue;
