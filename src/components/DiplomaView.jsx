import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaView = () => {
  const address = "0x982872534985Fb25a7d6f44712Ca6D30Ee8846F1";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  let diplomas = [];
  const [diplomaComponent, setDiplomaComponent] = useState();

  useEffect(() => {
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
            diplomas.push([
              event[i].returnValues.from,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          diplomaUpdate();
        }
      }
    );
  }, [window.ethereum.selectedAddress]);

  const diplomaUpdate = async () => {
    let component = [];
    for (const diploma of diplomas) {
      let data = await contract.methods
        .getData(diploma[0], diploma[1], diploma[2])
        .call();
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
            {data.valid ? (
              <>{data.revoke ? "Revoked ⛔" : "Valid ✅"}</>
            ) : (
              <>{data.reject ? "Rejected 😭" : "Not Valid ❌"}</>
            )}
          </td>
        </tr>
      );
    }
    setDiplomaComponent(component);
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
      .send({ from: window.ethereum.selectedAddress });
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <div className="flex flex-row">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <table className="border border-collapse table-auto">
            <thead>
              <tr>
                <th className="border border-purple-700">Assignor</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Image</th>
                <th className="border border-purple-700">Status</th>
              </tr>
            </thead>
            <tbody>{diplomaComponent}</tbody>
          </table>
        </div>
        <div className="basis-1/4"></div>
      </div>
      <form onSubmit={request_diploma} className="my-2">
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
