import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import { useEffect } from "react";
import {
  Header,
  Icon,
  Image,
  Segment,
  Divider,
  Table,
  Breadcrumb,
} from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
import { Card } from "semantic-ui-react";

const colors = ["black"];

const Web3 = require("web3");
const ethers = require("ethers");

function Branch() {
  const [bankid, setBankID] = useState("");
  const [branchid, setBranchID] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [clientaddress, setClientAddress] = useState("");
  const [centralbankid, setCentralBankID] = useState("");
  const [arrayData, setArrayData] = useState([]);
  const [arrayDataForexDet, setArrayDataForexDet] = useState([]);
  const [arrayDataBorrowDet, setArrayBorrowForexDet] = useState([]);
  const [newarrayData, setNewArrayData] = useState([]);
  const [balancebranch, setBalanceBranch] = useState("");
  const [symbolbranch, setSymbolBranch] = useState("");
  const [detailsbranchid, setDetailsBranchID] = useState("");
  const [isconnectbuttonclicked, setIsConnectButtonClicked] = useState(false);

  useEffect(() => {
    let temp_data = window.localStorage.getItem("DataC");
    if (temp_data) {
      temp_data = JSON.parse(temp_data);
      setArrayData(temp_data);
    }

    let temp_data_frx_det = window.localStorage.getItem("DataFrxDet");
    if (temp_data_frx_det) {
      temp_data_frx_det = JSON.parse(temp_data_frx_det);
      setArrayDataForexDet(temp_data_frx_det);
    }

    let temp_data_brr_det = window.localStorage.getItem("DataBrrDet");
    if (temp_data_brr_det) {
      temp_data_brr_det = JSON.parse(temp_data_brr_det);
      setArrayBorrowForexDet(temp_data_brr_det);
    }

    // window.localStorage.clear();
  }, [arrayData, arrayDataForexDet]);

  async function addClient() {
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
        console.log("MemtaMask Not Installed!!!");
      }
      const web3eth = new Web3(Web3.givenProvider);

      const callContract = new web3eth.eth.Contract(
        ABIbnksys,
        contractAddressbnksys
      );
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, 100000000000)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseEcb);
          let response = await callContract.methods
            .addClient(
              IDByAddress.bankId,
              branchid,
              clientaddress,
              amount * 100000000,
              "EUR"
            )
            .send({ from: address, gas: 1000000 });
          console.log(response);
          let clientid1 = await callContract.methods
            .clientCount(IDByAddress.bankId, branchid)
            .call();

          let clientDetails1 = await callContract.methods
            .clients(IDByAddress.bankId, clientid1 - 1)
            .call();
          console.log("clientid1:", clientid1);
          console.log("clientDetails1:", clientDetails1);

          let tmp_data = arrayData;
          tmp_data.push(clientDetails1);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataC", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].client);
        } else {
          setTokenSymbol("USD");
          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, amount * 100000000)
            .send({ from: address, gas: 1000000 });

          console.log("Response :", responseFed);
          let response = await callContract.methods
            .addClient(
              IDByAddress.bankId,
              branchid,
              clientaddress,
              amount * 100000000,
              "USD"
            )
            .send({ from: address, gas: 1000000 });
          console.log(response);

          let clientid2 = await callContract.methods
            .clientCount(IDByAddress.bankId, branchid)
            .call();

          let clientDetails2 = await callContract.methods
            .clients(IDByAddress.bankId, clientid2 - 1)
            .call();
          console.log("clientid1:", clientid2);
          console.log("clientDetails1:", clientDetails2);

          let tmp_data = arrayData;
          tmp_data.push(clientDetails2);
          console.log(tmp_data);
          setArrayData(tmp_data);
          window.localStorage.setItem("DataC", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].amount);
          console.log("arrayData:", arrayData[0].client);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function checkForexRequest() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let balanceOf = await callContractECB.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);

          let forexDetials = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetials", forexDetials);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetials.byClient, forexDetials.reqId)
            .call();

          console.log(
            "IDByAddress.bankId, IDByAddress.branchId, forexDetials.clientId, forexDetials.reqId",
            IDByAddress.bankId,
            IDByAddress.branchId,
            forexDetials.clientId,
            forexDetials.reqId
          );
          let response = await callContract.methods
            .sendForexRequestToBank(0, 0, 0, 0)
            .send({ from: address, gas: 1000000 });

          console.log("ReqDetailsAddress :", forexDetials);
          console.log("ReqDetailsClient1 :", ReqDetailsClient1);

          let tmp_data = arrayDataForexDet;
          tmp_data.push(ReqDetailsClient1);
          console.log(tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("rrayDataForexDet:", arrayDataForexDet);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("rrayDataForexDet:", arrayDataForexDet[0].bank);
        } else {
          setTokenSymbol("USD");

          let balanceOf = await callContractFED.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetials = await callContract.methods
            .forexDetails(address)
            .call();
          console.log("forexDetials", forexDetials);

          let ReqDetailsClient1 = await callContract.methods
            .requestDetails(forexDetials.byClient, forexDetials.reqId)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              IDByAddress.bankId,
              IDByAddress.branchId,
              forexDetials.clientId,
              forexDetials.reqId
            )
            .send({ from: address, gas: 1000000 });

          console.log("ReqDetailsAddress :", forexDetials);
          console.log("ReqDetailsClient1 :", ReqDetailsClient1);

          // response = {addres: hhkujiiio, status: true, id:555, amount:8885454}
          let tmp_data = arrayDataForexDet;
          tmp_data.push(ReqDetailsClient1);
          console.log("tmp_data", tmp_data);
          setArrayDataForexDet(tmp_data);
          window.localStorage.setItem("DataFrxDet", JSON.stringify(tmp_data));
          console.log("arrayDataForexDet:", arrayDataForexDet[0].amount);
          console.log("arrayDataForexDet:", arrayDataForexDet[0].bank);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }
  async function checkDetails() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");
          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();
          setDetailsBranchID(IDByAddress.branchId);

          let balanceOf = await callContractECB.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();
          setDetailsBranchID(IDByAddress.branchId);

          let balanceOf = await callContractFED.methods
            .balanceOf(address)
            .call();
          setBalanceBranch(balanceOf);
        }
      }
      setIsConnectButtonClicked(true);
    } catch (error) {
      console.log(Error);
    }
  }

  async function sendForexRequestBank() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let forexDetials = await callContract.methods
            .forexDetials(address)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              IDByAddress.bankId,
              IDByAddress.branchId,
              forexDetials.clientId,
              forexDetials.reqId
            )
            .send({ from: address, gas: 1000000 });
        } else {
          setTokenSymbol("USD");

          let IDByAddress = await callContract.methods
            .idOfAddress(address)
            .call();

          let forexDetials = await callContract.methods
            .forexDetials(address)
            .call();

          let response = await callContract.methods
            .sendForexRequestToBank(
              IDByAddress.bankId,
              IDByAddress.branchId,
              forexDetials.clientId,
              forexDetials.reqId
            )
            .send({ from: address, gas: 1000000 });
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }
  async function processForexRequestBranch() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        let forexDetials = await callContract.methods
          .forexDetials(address)
          .call();

        let IDByAddress2 = await callContract.methods
          .idOfAddress(forexDetials.toClient)
          .call();

        let branchDetails = await callContract.methods
          .branches(IDByAddress2.bankId, IDByAddress2.branchId)
          .call();

        let requestDetails = await callContract.methods
          .requestDetails(forexDetials.byClient, forexDetials.reqId)
          .call();

        if (IDByAddress.bankId == 0 && forexDetials.isApproved) {
          setTokenSymbol("EUR");

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, requestDetails.amountInEur)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processForexRequestByBranch(
              IDByAddress.bankId,
              IDByAddress.branchId,
              IDByAddress2.bankId,
              IDByAddress2.branchId,
              forexDetials.reqId
            )
            .send({ from: address, gas: 1000000 });
        } else if (IDByAddress.bankId == 1 && forexDetials.isApproved) {
          setTokenSymbol("USD");
          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, requestDetails.amountInUsd)
            .send({ from: address, gas: 1000000 });

          let response = await callContract.methods
            .processForexRequestByBranch(
              IDByAddress.bankId,
              IDByAddress.branchId,
              IDByAddress2.bankId,
              IDByAddress2.branchId,
              forexDetials.reqId
            )
            .send({ from: address, gas: 1000000 });
        } else {
          console.log("No Approved From the Branch");
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function checkBorrowRequest() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let responseEcb = await callContractECB.methods
          .approve(contractAddressbnksys, positionDetails.amountBorrowed)
          .send({ from: address, gas: 1000000 });

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          console.log("borrowDetails :", borrowDetails);
          console.log("positionDetails :", positionDetails);

          let response = await callContract.methods
          .processLoan(
            positionDetails.bankId,
            positionDetails.branchId,
            positionDetails.clientId,
            positionDetails.positionId
          )
          .send({ from: address, gas: 1000000 });

          let tmp_data = arrayDataBorrowDet;
          tmp_data.push(positionDetails);
          console.log(tmp_data);
          setArrayBorrowForexDet(tmp_data);
          window.localStorage.setItem("DataBrrDet", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        } else {
          setTokenSymbol("USD");

          let responseFed = await callContractFED.methods
          .approve(contractAddressbnksys, positionDetails.amountBorrowed)
          .send({ from: address, gas: 1000000 });

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          console.log("borrowDetails :", borrowDetails);
          console.log("positionDetails :", positionDetails);

          
          let response = await callContract.methods
          .processLoan(
            positionDetails.bankId,
            positionDetails.branchId,
            positionDetails.clientId,
            positionDetails.positionId
          )
          .send({ from: address, gas: 1000000 });

          let tmp_data = arrayDataBorrowDet;
          tmp_data.push(positionDetails);
          console.log(tmp_data);
          setArrayBorrowForexDet(tmp_data);
          window.localStorage.setItem("DataBrrDet", JSON.stringify(tmp_data));
          console.log("arrayData:", arrayData);
          console.log("arrayData:", arrayData[0].isBorrowed);
          console.log("arrayData:", arrayData[0].isDone);
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  async function approveBorrowRequest() {
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
      const callContractECB = new web3eth.eth.Contract(
        ABIEcb,
        contractAddressEcb
      );
      const callContractFED = new web3eth.eth.Contract(
        ABIFed,
        contractAddressFed
      );
      if (web3eth.givenProvider) {
        console.log("Hello Provider Here", web3eth.givenProvider);
        let address = web3eth.givenProvider.selectedAddress;
        console.log("address", address);

        let IDByAddress = await callContract.methods
          .idOfAddress(address)
          .call();

        if (IDByAddress.bankId == 0) {
          setTokenSymbol("EUR");

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let responseEcb = await callContractECB.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseEcb);

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });
        } else {
          setTokenSymbol("USD");

          let borrowDetails = await callContract.methods
            .borrowDetails(address)
            .call();
          console.log("borrowDetails", borrowDetails);

          let positionDetails = await callContract.methods
            .positionDetails(borrowDetails.byClient, positionDetails.positionId)
            .call();

          let responseFed = await callContractFED.methods
            .approve(contractAddressbnksys, positionDetails.amountBorrowed)
            .send({ from: address, gas: 1000000 });
          console.log("Response :", responseFed);

          let response = await callContract.methods
            .processLoan(
              positionDetails.bankId,
              positionDetails.branchId,
              positionDetails.clientId,
              positionDetails.positionId
            )
            .send({ from: address, gas: 1000000 });
        }
      }
    } catch (error) {
      console.log(Error);
    }
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Section href="/" link>
          Home
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>Branches</Breadcrumb.Section>
      </Breadcrumb>

      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="user circle outline" circular />
          <Header.Content> Branch</Header.Content>
        </Header>
        {/* <Image
                    centered
                    size="medium"
                    src="https://react.semantic-ui.com/images/wireframe/image.png"
                /> */}
      </div>
      <div>
        {" "}
        <Card.Group centered>
          <Card>
            <Card.Content>
              <Card.Meta>Branch ID: {detailsbranchid}</Card.Meta>
              <Card.Description>
                Balance: {balancebranch / 10e7} {tokenSymbol}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                {isconnectbuttonclicked ? (
                  <></>
                ) : (
                  <Button secondary onClick={checkDetails}>
                    Connect
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>

      <Form unstackable>
        <Form.Group widths={4}>
          <Form.Input
            label="Branch ID"
            placeholder="0."
            type="number"
            value={branchid}
            onChange={(e) => setBranchID(e.target.value)}
          />
          <Form.Input
            label="Client Address"
            placeholder="0x00..."
            type="text"
            value={clientaddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
          <Form.Input
            label="Amount"
            placeholder="10..."
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" onClick={addClient}>
          Submit
        </Button>
      </Form>
      <Divider />
      <div>
        <Table color="black" key={colors} inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Client Address</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>BankId</Table.HeaderCell>
              <Table.HeaderCell>Client ID</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {arrayData.length > 0 &&
              arrayData.map((data, index) => {
                console.log(data[index]);
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.client}</Table.Cell>
                    <Table.Cell>
                      {data.amount / 10e7} {data.tokenSymbol}
                    </Table.Cell>
                    <Table.Cell>{data.bankId}</Table.Cell>
                    <Table.Cell>{data.branchId}</Table.Cell>
                    <Table.Cell>True</Table.Cell>
                  </Table.Row>
                );
              })}

            {/* <Table.Row>
      <Table.Cell>"0x157840be5604f37284b00Ec5801B609710764566"</Table.Cell>
      <Table.Cell>{1000}</Table.Cell>
      <Table.Cell>true</Table.Cell>
    </Table.Row> */}
          </Table.Body>
        </Table>
        <Divider />
      </div>

      <div>
        {/* <Segment inverted>
  <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
  <Divider inverted />

</Segment> */}
      </div>
      <Header as="h2" icon textAlign="center">
        <Icon name="wait" circular />
        <Header.Content>Pending Forex Requests</Header.Content>
      </Header>
      <div>
        <Card.Group centered>
          <Button basic color="green" onClick={checkForexRequest}>
            Approve
          </Button>
          {arrayData.length > 0 &&
            arrayData.map((data, index) => {
              return (
                <Card>
                  <Card.Content>
                    <Icon name="money bill alternate outline" circular />
                    <Card.Header>Forex Request: {data.reqId} </Card.Header>
                    <Card.Meta>Amount {data.amountInUsd} USD</Card.Meta>
                    <Card.Meta>Amount {data.amountInEur} EUR</Card.Meta>
                    <Card.Description>USD to EUR Rate {1.09}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button basic color="green" onClick={checkForexRequest}>
                        Approve
                      </Button>
                      <Button basic color="red">
                        Decline
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
        </Card.Group>

        <Divider />
        <div>
          <Header as="h2" icon textAlign="center">
            <Header.Content>Forex Details </Header.Content>
          </Header>
          <Table color="black" key={colors} inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>To Client Address</Table.HeaderCell>
                <Table.HeaderCell>Amount USD</Table.HeaderCell>
                <Table.HeaderCell>Amount EUR</Table.HeaderCell>
                <Table.HeaderCell>From Branch</Table.HeaderCell>
                <Table.HeaderCell>To Branch</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>
                  <Button
                    basic
                    color="green"
                    onClick={processForexRequestBranch}
                  >
                    Approve
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {arrayDataForexDet.length > 0 &&
                arrayDataForexDet.map((data, index) => {
                  console.log(data[index]);
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{data.toClient}</Table.Cell>
                      <Table.Cell>
                        {data.amountInUsd / 10e7} {data.tokenSymbol}
                      </Table.Cell>
                      <Table.Cell>
                        {data.amountInEur / 10e7} {data.tokenSymbol}
                      </Table.Cell>
                      <Table.Cell>{data.fromBranchId}</Table.Cell>
                      <Table.Cell>{data.toBranchId}</Table.Cell>
                      <Table.Cell>
                        {data.isSentToBank ? "True" : "False"}
                      </Table.Cell>
                      <Table.Cell>
                        {" "}
                        <Button
                          basic
                          color="green"
                          onClick={processForexRequestBranch}
                        >
                          Approve
                        </Button>
                        <Button basic color="red">
                          Decline
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

              {/* <Table.Row>
      <Table.Cell>"0x157840be5604f37284b00Ec5801B609710764566"</Table.Cell>
      <Table.Cell>{1000}</Table.Cell>
      <Table.Cell>true</Table.Cell>
    </Table.Row> */}
            </Table.Body>
          </Table>
          <Divider />
        </div>
      </div>
      <Divider />
      <Header as="h2" icon textAlign="center">
        <Icon name="wait" circular />
        <Header.Content>Pending Borrow Requests</Header.Content>
      </Header>
      <div>
        <Card.Group centered>
          {arrayDataBorrowDet.length > 0 &&
            arrayDataBorrowDet.map((data, index) => {
              return (
                <Card>
                  <Card.Content>
                    <Icon name="handshake outline" circular />
                    <Card.Header>Borrow Request: {data.positionId} </Card.Header>
                    <Card.Meta>Amount {data.amountBorrowed} USD</Card.Meta>
                    <Card.Description>Interest Rate {10} %</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button basic color="green">
                        Approve
                      </Button>
                      <Button basic color="red">
                        Decline
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
        </Card.Group>
        <div>
          <Divider />
          <Header as="h2" icon textAlign="center">
            <Header.Content>Borrower Details </Header.Content>
          </Header>
          <Table color="black" key={colors} inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Client ID</Table.HeaderCell>
                <Table.HeaderCell>Amount Borrowed</Table.HeaderCell>

                <Table.HeaderCell>Branch ID</Table.HeaderCell>
                <Table.HeaderCell>Position ID</Table.HeaderCell>
                 <Table.HeaderCell>Status</Table.HeaderCell>
                 <Table.HeaderCell>Approved</Table.HeaderCell>
                <Button primary onClick={checkBorrowRequest}>Details</Button>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {arrayDataBorrowDet.length > 0 &&
                arrayDataBorrowDet.map((data, index) => {
                  console.log(data[index]);
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{data.clientId}</Table.Cell>
                      <Table.Cell>{data.amountBorrowed}</Table.Cell>
                      <Table.Cell>{data.branchId}</Table.Cell>
                      <Table.Cell>{data.positionId}</Table.Cell>
                      <Table.Cell>{data.isBorrowed}</Table.Cell>
                      <Table.Cell>{data.isDone}</Table.Cell>
                      <Table.Cell>
                        {" "}
                        <Button basic color="green">
                          Approve
                        </Button>
                        <Button basic color="red">
                          Decline
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

              {/* <Table.Row>
      <Table.Cell>"0x157840be5604f37284b00Ec5801B609710764566"</Table.Cell>
      <Table.Cell>{1000}</Table.Cell>
      <Table.Cell>true</Table.Cell>
    </Table.Row> */}
            </Table.Body>
          </Table>
          <Divider />
        </div>
      </div>
    </div>
  );
}
export default Branch;
