import React, { useEffect } from "react";
import { Button, Form, Header, Icon, Image } from "semantic-ui-react";
import { useState, use } from "react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import { Table } from 'semantic-ui-react'

const colors = [
  'black'
]

const Web3 = require("web3");
const ethers = require("ethers");

function BankReserve() {
  const [bankaddress, setBankAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [centralbankid, setCentralBankID] = useState("");
  const [amount, setAmount] = useState("");
  const [arrayData, setArrayData] = useState([]);
  const [bankAdded, setBankAdded] = useState(false);
  const [temp, setTemp] = useState("")

  useEffect(() => {

    let temp_data = window.localStorage.getItem("Data")
    if (temp_data) {
      temp_data = JSON.parse(temp_data)
      setArrayData(temp_data)
    }
    // window.localStorage.clear();

  }, [arrayData]
  );

  async function addbank() {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.enable();
        console.log("accounts", accounts);
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        console.log("Signer", signer);
        const address = await signer.getAddress();
        console.log(address);
      } else {
        console.log("MemtaMask Not Installed Maen");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(ABIEcb, contractAddressEcb);
      const callContractFED = new web3eth.eth.Contract(ABIFed, contractAddressFed);
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        if (centralbankid == 0) {
          setTokenSymbol("EUR")
          let responseEcb = await callContractECB.methods.approve(contractAddressbnksys, amount * 100000000).send({ from: address, gas: 1000000 });
          let response = await callContract.methods
            .addBank(bankaddress, tokenSymbol, centralbankid, amount * 100000000)
            .send({ from: address, gas: 1000000 });
          let responseP1 = await callContract.methods
            .banks(0)
            .call();
          console.log("Response from addbank:", response)
          console.log("call bank:", responseP1)

          let tmp_data = arrayData;
          tmp_data.push(responseP1)
          console.log(tmp_data)
          setArrayData(tmp_data)
          window.localStorage.setItem("Data", JSON.stringify(tmp_data))
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].bank);
          // setArrayData([])
          // if (response) {
          //   setArrayData(tmp_data)
          //   setAddBankStatus(true)
          // } console.log("tmp_data", tmp_data)
        }
        else {
          setTokenSymbol("USD")
          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 10e8)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);
          let response = await callContract.methods
            .addBank(bankaddress, tokenSymbol, centralbankid, amount * 10e8)
            .send({ from: address, gas: 1000000 })
          let responseP2 = await callContract.methods
            .banks(1)
            .call();

          console.log(responseFed)
          console.log(response)

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayData;
          tmp_data.push(responseP2)
          console.log("tmp_data", tmp_data)
          setArrayData(tmp_data)
          window.localStorage.setItem("Data", JSON.stringify(tmp_data))
          console.log("arrayData:", arrayData[0].amount)
          console.log("arrayData:", arrayData[0].bank)

        }
      }
    } catch (error) {
      console.log(Error);
    }

  }




  return (
    <div>
      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="money" circular />
          <Header.Content>  World Token Reserve</Header.Content>
        </Header>
        <Image
          centered
          size="large"
          src="https://react.semantic-ui.com/images/wireframe/centered-paragraph.png"
        />
      </div>
      <Form unstackable>
        <Form.Group widths={2}>
          <Form.Input label="Bank Adress" placeholder="0xfsc257d..." type="text"
            value={bankaddress}
            onChange={(e) => setBankAddress(e.target.value)} />
          <Form.Input label="Amount" placeholder="10" type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} />
          <Form.Input label="Central Bank ID" placeholder="0" type="text"
            value={centralbankid}
            onChange={(e) => setCentralBankID(e.target.value)} />
        </Form.Group>

        {/* {centralbankid ? <Button type="submit" onClick={addbank()}>Submit</Button> :<div>Ereor</div> } */}
        <Button type="submit" onClick={addbank}>Submit</Button>
      </Form>


      <div>

        <Table color='black' key={colors} inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Bank Address</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {

              (arrayData.length > 0) &&
              arrayData.map((data, index) => {
                console.log(data[index]);
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.bank}</Table.Cell>
                    <Table.Cell>{data.amount / 10e8} {data.tokenSymbol}</Table.Cell>
                    <Table.Cell>{data.status ? 'True' : 'True'}</Table.Cell>
                  </Table.Row>
                )
              }
              )}
          </Table.Body>
        </Table>

      </div>
    </div>


  );
}
export default BankReserve;



// <Table.Body>
//           {
//             (arrayData.length >0) && (
//               arrayData.map((data , index) => {
//                 <Table.Row key={index}>
//                 <Table.Cell>{data.address}</Table.Cell>
//                 <Table.Cell>{data.amount}</Table.Cell>
//                 <Table.Cell>Yes</Table.Cell>
//               </Table.Row>
//               })
//           }

// <Table.Row>
// <Table.Cell>Orange</Table.Cell>
// <Table.Cell>310</Table.Cell>
// <Table.Cell>Yes</Table.Cell>
// </Table.Row>