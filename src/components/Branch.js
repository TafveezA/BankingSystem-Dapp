import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import { useEffect } from "react";
import { Header, Icon, Image, Segment, Divider, Table } from "semantic-ui-react";
import { contractAddressFed, ABIFed } from "../constants";
import { contractAddressEcb, ABIEcb } from "../constants";
import { contractAddressbnksys, ABIbnksys } from "../constants";
const colors = [
    'black'
]

const Web3 = require("web3");
const ethers = require("ethers");

function Branch() {



    const [bankid, setBankID] = useState("");
    const [branchid, setBranchID] = useState("");
    const [amount, setAmount] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [clientaddress, setClientAddress] = useState("")
    const [centralbankid, setCentralBankID] = useState("");
    const [arrayData, setArrayData] = useState([]);

    
  useEffect(() => {

    let temp_data = window.localStorage.getItem("DataC")
    if (temp_data) {
      temp_data = JSON.parse(temp_data)
      setArrayData(temp_data)
    }


  }, [arrayData]
  );

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
            const callContractECB = new web3eth.eth.Contract(ABIEcb, contractAddressEcb);
            const callContractFED = new web3eth.eth.Contract(ABIFed, contractAddressFed);
            if (web3eth.givenProvider) {
                console.log("Hello Provider Here", web3eth.givenProvider);
                let address = web3eth.givenProvider.selectedAddress;
                console.log("address", address);

                if (bankid == 0) {
                    setTokenSymbol("EUR")
                    let responseEcb = await callContractECB.methods.approve(contractAddressbnksys, 100000000000).send({ from: address, gas: 1000000 });
                    console.log("Response :", responseEcb);
                    let response = await callContract.methods
                        .addClient(bankid, branchid, clientaddress, amount * 100000000, tokenSymbol)
                        .send({ from: address, gas: 1000000 })
                    console.log(response)
                    let clientid1 = await callContract.methods
                        .clientCount(bankid, branchid)
                        .call();

                    let clientDetails1 = await callContract.methods
                        .clients(bankid, clientid1 - 1)
                        .call();
                    console.log("clientid1:", clientid1)
                    console.log("clientDetails1:", clientDetails1)

                    let tmp_data = arrayData;
                    tmp_data.push(clientDetails1)
                    console.log(tmp_data)
                    setArrayData(tmp_data)
                    window.localStorage.setItem("DataC", JSON.stringify(tmp_data))
                    console.log("arrayData:", arrayData);
                    console.log("arrayData:", arrayData[0].amount);
                    console.log("arrayData:", arrayData[0].bank);
                }
                else {
                    setTokenSymbol("USD")
                    let responseFed = await callContractFED.methods
                        .approve(contractAddressbnksys, amount * 100000000)
                        .send({ from: address, gas: 1000000 });

                    console.log("Response :", responseFed);
                    let response = await callContract.methods
                        .addClient(bankid, branchid, clientaddress, amount * 100000000, tokenSymbol)
                        .send({ from: address, gas: 1000000 })
                    console.log(response)

                    let clientid2 = await callContract.methods
                        .clientCount(bankid, branchid)
                        .call();

                    let clientDetails2 = await callContract.methods
                        .clients(bankid, clientid2 - 1)
                        .call();
                    console.log("clientid1:", clientid2)
                    console.log("clientDetails1:", clientDetails2)

                    let tmp_data = arrayData;
                    tmp_data.push(clientDetails2)
                    console.log(tmp_data)
                    setArrayData(tmp_data)
                    window.localStorage.setItem("DataC", JSON.stringify(tmp_data))
                    console.log("arrayData:", arrayData);
                    console.log("arrayData:", arrayData[0].amount);
                    console.log("arrayData:", arrayData[0].bank);

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
                    <Icon name="user circle outline" circular />
                    <Header.Content> Branch</Header.Content>
                </Header>
                <Image
                    centered
                    size="large"
                    src="https://react.semantic-ui.com/images/wireframe/centered-paragraph.png"
                />
            </div>

            <Form unstackable>
                <Form.Group widths={4}>
                    <Form.Input label="Bank ID" placeholder="0" type="number"
                        value={bankid}
                        onChange={(e) => setBankID(e.target.value)} />
                    <Form.Input label="Branch ID" placeholder="0." type="number"
                        value={branchid}
                        onChange={(e) => setBranchID(e.target.value)} />
                    <Form.Input label="Client Address" placeholder="0x00..." type="text"
                        value={clientaddress}
                        onChange={(e) => setClientAddress(e.target.value)} />
                    <Form.Input label="Amount" placeholder="10..." type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)} />
                </Form.Group>

                <Button type="submit" onClick={addClient}>Submit</Button>
            </Form>

            <div>

                <Table color='black' key={colors} inverted>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>receiver Address</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Bank ID</Table.HeaderCell>
                            <Table.HeaderCell>Branch ID</Table.HeaderCell>
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
                                        <Table.Cell>{data.client}</Table.Cell>
                                        <Table.Cell>{data.amount / 10e8}</Table.Cell>
                                        <Table.Cell>{data.bankId}</Table.Cell>
                                        <Table.Cell>{data.branchId}</Table.Cell>
                                        <Table.Cell>{data.status ? 'True' : 'False'}</Table.Cell>
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


            <div>
                {/* <Segment inverted>
  <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
  <Divider inverted />

</Segment> */}
            </div>
        </div>

    );
}
export default Branch;