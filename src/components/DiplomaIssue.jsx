import { useEffect, useState } from "react";
import Web3 from "web3";
import DiplomaABI from "../data/Diploma.json";

const DiplomaIssue = () => {
  const address = "0x77827A05dfD38b36b5E9Fb77f1B132288E78576F";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(DiplomaABI, address);
  let requests = [];
  const [requestComponent, setRequestComponent] = useState();

  useEffect(() => {
    contract.getPastEvents(
      "Request",
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
            requests.push([
              event[i].returnValues.from,
              event[i].returnValues.degree,
              event[i].returnValues.department,
            ]);
          }
          requestUpdate();
        }
      }
    );
  }, []);

  const requestUpdate = async () => {
    let component = [];
    for (const request of requests) {
      let data = await contract.methods
        .getData(request[0], request[1], request[2])
        .call();
      if (!data.valid && !data.reject) {
        component.push(
          <tr>
            <td className="border border-purple-700">{request[0]}</td>
            <td className="border border-purple-700">{data.name}</td>
            <td className="border border-purple-700">{request[1]}</td>
            <td className="border border-purple-700">{request[2]}</td>
            <td className="border border-purple-700">{data.year}</td>
            <td className="border border-purple-700">
              <form onSubmit={handle_request}>
                <input
                  type="hidden"
                  id="requester"
                  name="requester"
                  value={request[0]}
                />
                <input
                  type="hidden"
                  id="degree"
                  name="degree"
                  value={request[1]}
                />
                <input
                  type="hidden"
                  id="department"
                  name="department"
                  value={request[2]}
                />
                <button
                  className="m-1 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                  type="submit"
                  name="approve"
                >
                  Approve
                </button>
                <button
                  className="m-1 text-white bg-red-600 rounded-lg hover:bg-blue-500"
                  type="submit"
                  name="reject"
                >
                  Reject
                </button>
              </form>
            </td>
          </tr>
        );
      }
    }
    setRequestComponent(component);
  };

  const handle_request = (event) => {
    event.preventDefault();
    let requester = event.target.elements.requester.value;
    let degree = event.target.elements.degree.value;
    let department = event.target.elements.department.value;
    switch (event.nativeEvent.submitter.name) {
      case "approve":
        contract.methods
          .confirm(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
      case "reject":
        contract.methods
          .reject(requester, degree, department)
          .send({ from: window.ethereum.selectedAddress });
        break;
    }
  };

  const issue_diploma = (event) => {
    event.preventDefault();
    contract.methods
      .award(
        event.target.elements.sendAddress.value,
        event.target.elements.name.value,
        event.target.elements.degree.value,
        event.target.elements.department.value,
        event.target.elements.year.value
      )
      .send({ from: window.ethereum.selectedAddress });
  };

  return (
    <div className="m-1 text-xl text-blue-600">
      <p>Contract Address: {address}</p>
      <div class="flex flex-row">
        <div class="basis-1/4"></div>
        <div class="basis-1/2">
          <table className="border border-collapse table-fixed">
            <thead>
              <tr>
                <th className="border border-purple-700">Requester</th>
                <th className="border border-purple-700">Name</th>
                <th className="border border-purple-700">Degree</th>
                <th className="border border-purple-700">Department</th>
                <th className="border border-purple-700">Year</th>
                <th className="border border-purple-700">Approve/Reject</th>
              </tr>
            </thead>
            <tbody>{requestComponent}</tbody>
          </table>
        </div>
        <div class="basis-1/4"></div>
      </div>
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
