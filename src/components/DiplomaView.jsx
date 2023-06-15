import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaView = (props) => {
  const address = "0x88F986050140a11a45E082C6CB697aa31E486dC5";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  const [requestFee, setRequestFee] = useState(0);
  let requestDiplomas = [];
  let grants = [];
  const [requestDiplomaComponent, setRequestDiplomaComponent] = useState();
  const [grantComponent, setGrantComponent] = useState();

  useEffect(() => {
    contract.methods
      .getFee()
      .call()
      .then((fee) => {
        setRequestFee(fee);
      });
    contract.getPastEvents(
      "Request",
      {
        filter: {
          from: window.ethereum.selectedAddress,
        },
        fromBlock: 0,
      },
      (error, event) => {
        if (error) {
          console.log(error);
        } else {
          for (let i = 0; i < event.length; i++) {
            requestDiplomas.push([
              event[i].returnValues.from,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          requestUpdate();
        }
      }
    );
    contract.getPastEvents(
      "Grant",
      {
        filter: {
          to: window.ethereum.selectedAddress,
        },
        fromBlock: 0,
      },
      (error, event) => {
        if (error) {
          console.log(error);
        } else {
          for (let i = 0; i < event.length; i++) {
            grants.push([
              event[i].returnValues.to,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          grantUpdate();
        }
      }
    );
  }, [props.reload, window.ethereum.selectedAddress]);

  const grantUpdate = async () => {
    let component = [];
    for (const grant of grants) {
      let data = await contract.methods
        .getData(grant[0], grant[1], grant[2])
        .call();
      component.push(
        <tr>
          <td className="border border-purple-700">{grant[0]}</td>
          <td className="border border-purple-700">{data.name}</td>
          <td className="border border-purple-700">{grant[1]}</td>
          <td className="border border-purple-700">{grant[2]}</td>
          <td className="border border-purple-700">{data.year}</td>
          <td className="border border-purple-700">
            <a href={"https://ipfs.io/ipfs/" + data.img}>
              <img
                src={"https://ipfs.io/ipfs/" + data.img}
                alt="Diploma Image"
              />
            </a>
          </td>
          <td className="border border-purple-700">
            {data.revoked ? "Revoked ⛔" : "Valid ✅"}
          </td>
        </tr>
      );
    }
    setGrantComponent(component);
  };

  const requestUpdate = async () => {
    let component = [];
    for (const diploma of requestDiplomas) {
      let data = await contract.methods
        .getData(diploma[0], diploma[1], diploma[2])
        .call();
      if (!data.valid) {
        component.push(
          <tr>
            <td className="border border-purple-700">{data.assignor}</td>
            <td className="border border-purple-700">{data.name}</td>
            <td className="border border-purple-700">{diploma[1]}</td>
            <td className="border border-purple-700">{diploma[2]}</td>
            <td className="border border-purple-700">{data.year}</td>
            <td className="border border-purple-700">
              <a href={"https://ipfs.io/ipfs/" + data.img}>
                <img
                  src={"https://ipfs.io/ipfs/" + data.img}
                  alt="Diploma Image"
                />
              </a>
            </td>
            <td className="border border-purple-700">
              {data.rejected ? "Rejected 😭" : "Not Valid ❌"}
            </td>
          </tr>
        );
      }
    }
    setRequestDiplomaComponent(component);
  };

  const request_diploma = (event) => {
    event.preventDefault();
    contract.methods
      .request(
        event.target.elements.sendAddress.value,
        event.target.elements.name.value,
        event.target.elements.degree.value,
        event.target.elements.department.value,
        event.target.elements.img.value,
        event.target.elements.year.value
      )
      .send({
        from: window.ethereum.selectedAddress,
        value: requestFee,
      });
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <div className="flex flex-row">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <table className="border border-collapse table-auto">
            <caption className="text-blue-800 caption-top">
              Your Request
            </caption>
            <thead>
              <tr>
                <th className="border border-purple-700">Assigner</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Image</th>
                <th className="border border-purple-700">Status</th>
              </tr>
            </thead>
            <tbody>{requestDiplomaComponent}</tbody>
          </table>
        </div>
        <div className="basis-1/4"></div>
      </div>
      <div className="flex flex-row">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <table className="border border-collapse table-auto">
            <caption className="text-blue-800 caption-top">
              Your Diploma
            </caption>
            <thead>
              <tr>
                <th className="border border-purple-700">Assigner</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Image</th>
                <th className="border border-purple-700">Status</th>
              </tr>
            </thead>
            <tbody>{grantComponent}</tbody>
          </table>
        </div>
        <div className="basis-1/4"></div>
      </div>
      <form onSubmit={request_diploma} className="my-2">
        <label className="text-blue-600" htmlFor="sendAddress">
          School (address):
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
        <label className="text-blue-600" htmlFor="department">
          Department:
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="department"
          name="department"
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
        <label className="text-blue-600" htmlFor="year">
          Image (IPFS CID):
        </label>
        <input
          className="m-1 rounded-lg border-2 border-blue-600 hover:border-blue-400 focus:ring focus:outline-none"
          id="img"
          name="img"
          type="text"
          required
        />
        <br />
        <p className="text-red-600">
          Send $10(USD), {web3.utils.fromWei(String(requestFee))}(ETH) to your
          assigner for your application
        </p>
        <button
          className="text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          type="submit"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default DiplomaView;
