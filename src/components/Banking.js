import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Header, Segment, Icon, Image, Divider, Card, Breadcrumb, Table } from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
const colors = [
  'black'
]

const Web3 = require("web3");
const ethers = require("ethers");

function Banking() {

  const [frombankid, setFromBankID] = useState("") // Taken from call metamask 
  const [frombranchid, setFromBranchkID] = useState("")
  const [tobankid, setToBankid] = useState("")
  const [tobranchid, setToBranchid] = useState("")
  const [clientaddress, setClientAddress,] = useState("")
  const [amount, setAmount] = useState("")
  const [tokensymbol, setTokenSymbol] = useState("")
  const [arrayDataF, setArrayDataF] = useState([]);
  const [arrayDataBr, setArrayDataBr] = useState([]);

  useEffect(() => {

    let temp_dataF = window.localStorage.getItem("DataF")
    if (temp_dataF) {
      temp_dataF = JSON.parse(temp_dataF)
      setArrayDataF(temp_dataF)
    }

    let temp_dataBr = window.localStorage.getItem("DataBr")
    if (temp_dataBr) {
      temp_dataBr = JSON.parse(temp_dataBr)
      setArrayDataBr(temp_dataBr)
    }

  }, [arrayDataF, arrayDataBr]
  );



  async function forex() {
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

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        let IDByAddress2 = await callContract.methods
          .idOfAddress(clientaddress)
          .call();

        console.log("IDByAddress.bankId, IDByAddress.branchId,IDByAddress.clientId, IDByAddress2.bankId, IDByAddress2.branchId, clientaddress, amount:", IDByAddress.bankId, IDByAddress.branchId, IDByAddress.clientId, IDByAddress2.bankId, IDByAddress2.branchId, clientaddress, amount);

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR")
          let responseEcb = await callContractECB.methods.approve(contractAddressbnksys, amount * 100000000).send({ from: address, gas: 1000000 });

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(clientaddress)
            .call();

          let response = await callContract.methods
            .forexRequestToBranchOfBank1(IDByAddress.bankId, IDByAddress.branchId, IDByAddress.clientId, IDByAddress2.bankId, IDByAddress2.branchId, clientaddress, amount * 100000000)
            .send({ from: address, gas: 1000000 })

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();



          console.log("Response from addbank:", numOfRequest)
          console.log("call bank:", ReqDetailsClient1)


          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1)
          console.log(tmp_data)
          setArrayDataF(tmp_data)
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data))
          console.log("arrayDataF:", arrayDataF);
          console.log("arrayDataF:", arrayDataF[0].amount);
          console.log("arrayDataF:", arrayDataF[0].bank);

        }
        else {
          setTokenSymbol("USD")


          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 10e8)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let IDByAddress2 = await callContract.methods
            .idOfAddress(clientaddress)
            .call();

          let response = await callContract.methods
            .forexRequestToBranchOfBank2(IDByAddress.bankId, IDByAddress.branchId, IDByAddress.clientId, IDByAddress2.bankId, IDByAddress2.branchId, clientaddress, amount * 100000000)
            .send({ from: address, gas: 1000000 })

          let numOfRequest = await callContract.methods
            .numOfRequest(address)
            .call();

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(address, numOfRequest - 1)
            .call();



          console.log("ReqDetailsAddress :", numOfRequest)
          console.log("ReqDetailsClient1 :", ReqDetailsClient1)

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataF;
          tmp_data.push(ReqDetailsClient1)
          console.log("tmp_data", tmp_data)
          setArrayDataF(tmp_data)
          window.localStorage.setItem("DataF", JSON.stringify(tmp_data))
          console.log("arrayDataF:", arrayDataF[0].amount)
          console.log("arrayDataF:", arrayDataF[0].bank)

        }
      }
    } catch (error) {
      console.log(Error);
    }

  }

  async function borrow() {
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

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR")

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          console.log("amount!!!!!!!!!!!:", amount);

          let response = await callContract.methods
            .borrowRequest(IDByAddress.bankId, IDByAddress.clientId, amount * 100000000)
            .send({ from: address, gas: 1000000 })

          let numOfPosition = await callContract.methods
            .numOfPosition(address)
            .call();

          let positionDetails = await callContract.methods
            .positionDetails(address, numOfPosition - 1)
            .call();



          console.log("numOfPosition:", numOfPosition)
          console.log("positionDetails:", positionDetails)


          let tmp_data = arrayDataBr;
          tmp_data.push(positionDetails)
          console.log(tmp_data)
          setArrayDataBr(tmp_data)
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data))
          console.log("arrayDataBr:", arrayDataBr);
          console.log("arrayDataBr:", arrayDataBr[0].amount);
          console.log("arrayDataBr:", arrayDataBr[0].bank);

        }
        else {
          setTokenSymbol("USD")

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();


          let response = await callContract.methods
            .borrowRequest(IDByAddress.bankId, IDByAddress.clientId, amount * 100000000)
            .send({ from: address, gas: 1000000 })

          let numOfPosition = await callContract.methods
            .numOfPosition(address)
            .call();

          let positionDetails = await callContract.methods
            .positionDetails(address, numOfPosition - 1)
            .call();

          console.log("numOfPosition :", numOfPosition)
          console.log("positionDetails :", positionDetails)

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataBr;
          tmp_data.push(positionDetails)
          console.log("tmp_data", tmp_data)
          setArrayDataBr(tmp_data)
          window.localStorage.setItem("DataBr", JSON.stringify(tmp_data))
          console.log("arrayData:", arrayDataBr[0].amount)
          console.log("arrayData:", arrayDataBr[0].bank)

        }
      }
    } catch (error) {
      console.log(Error);
    }

  }



  return (


    < div >
      <div>

        <Breadcrumb>
          <Breadcrumb.Section href="/" link>Home</Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>Banking</Breadcrumb.Section>
        </Breadcrumb>
        <Card>
          <Image
            centered
            src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
          <Card.Content>
            <Card.Header>Tafveez</Card.Header>
            <Card.Meta>
              <span className='date'>Address: oxFcsh13hb..</span>
            </Card.Meta>
            <Card.Description>
              Tafveez is a client of Bank of New York .
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='money bill alternate outline' />
              2000 USDT
            </a>
          </Card.Content>
        </Card>

      </div>
      <Divider />

      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="money" circular />
          <Header.Content>Forex </Header.Content>
        </Header>
        <Image
          centered
          size="large"
          src="https://react.semantic-ui.com/images/wireframe/centered-paragraph.png"
        />
      </div>

      <Form unstackable>
        <Form.Group widths={2}>
          <Form.Input label="Reciever Address" placeholder="0xfsc257d..." type="text"
            value={clientaddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
          <Form.Input label="Amount" placeholder="10" type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        {/* {centralbankid ? <Button type="submit" onClick={addbank()}>Submit</Button> :<div>Ereor</div> } */}
        <Button type="submit" onClick={forex} >Submit</Button>
      </Form>
      <Divider hidden />

      <div>
        <Header as="h2" icon textAlign="center">

          <Header.Content>Forex Statement </Header.Content>
        </Header>


        <Table color='black' key={colors} inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Receiver Address</Table.HeaderCell>
              <Table.HeaderCell>Amount USD</Table.HeaderCell>
              <Table.HeaderCell>Amount EUR</Table.HeaderCell>
              <Table.HeaderCell>Req ID</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              (arrayDataF.length > 0) &&
              arrayDataF.map((data, index) => {
                console.log(data[index]);
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.toClient}</Table.Cell>
                    <Table.Cell>{data.amountInUsd / 10e7} USD</Table.Cell>
                    <Table.Cell>{data.amountInEur / 10e7} EUR</Table.Cell>
                    <Table.Cell>{data.reqId}</Table.Cell>
                    <Table.Cell>{data.isDepositedToBranch ? 'True' : 'False'}</Table.Cell>
                    <Table.Cell>{data.isDone ? 'True' : 'False'}</Table.Cell>
                  </Table.Row>
                )
              }
              )}

            {/* <Table.Row>
<Table.Cell>"0x157840be5604f37284b00Ec5801B609710764566"</Table.Cell>
<Table.Cell>{1000}</Table.Cell>
<Table.Cell>true</Table.Cell>
</Table.Row> */}
          </Table.Body>
        </Table>

      </div>
      <Divider />

      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="handshake outline" circular />
          <Header.Content>Lending </Header.Content>
        </Header>
        <Image
          centered
          size="large"
          src="https://react.semantic-ui.com/images/wireframe/centered-paragraph.png"
        />
      </div>

      <Form unstackable>
        <Form.Group widths={2}>
          <Form.Input label="Branch ID" placeholder="0" type="text"

          />
          <Form.Input label="Amount" placeholder="10..." type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}

          />
        </Form.Group>

        {/* {centralbankid ? <Button type="submit" onClick={addbank()}>Submit</Button> :<div>Ereor</div> } */}
        <Button type="submit" onClick={borrow} >Submit</Button>
      </Form>
      <div>
        <Header as="h2" icon textAlign="center">

          <Header.Content>Lending Statement </Header.Content>
        </Header>


        <Table color='black' key={colors} inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Position ID</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              (arrayDataBr.length > 0) &&
              arrayDataBr.map((data, index) => {
                console.log(data[index]);
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.amountBorrowed / 10e7}</Table.Cell>
                    <Table.Cell>{data.positionId}</Table.Cell>
                    <Table.Cell>{data.isBorrowed ? 'True' : 'False'}</Table.Cell>
                  </Table.Row>
                )
              }
              )}

            {/* <Table.Row>
<Table.Cell>"0x157840be5604f37284b00Ec5801B609710764566"</Table.Cell>
<Table.Cell>{1000}</Table.Cell>
<Table.Cell>true</Table.Cell>
</Table.Row> */}
          </Table.Body>
        </Table>

      </div>


    </div>
  );
}
export default Banking;


// <Form.Group widths={2}>
// <Form.Input label="Bank Adress" placeholder="0xfsc257d..." type="text"
//   value={bankaddress}
//   onChange={(e) => setClientAddress(e.target.value)} />
// <Form.Input label="Amount" placeholder="10" type="text"
//   value={amount}
//   onChange={(e) => setAmount(e.target.value)} />
// <Form.Input label="Central Bank ID" placeholder="0" type="text"
//   value={centralbankid}
//   onChange={(e) => setCentralBankID(e.target.value)} />
// </Form.Group>