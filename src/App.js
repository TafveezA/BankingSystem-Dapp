//import logo from './logo.svg';
import './App.css';
// import Client from "./components/Client";
// import Navbar from './components/Navbar';

// import { useState } from "react";
// import { Dropdown, Input } from 'semantic-ui-react'
import HomepageLayout from "./components/HomepageLayout";
import 'semantic-ui-css/semantic.min.css';
import Banks from "./components/Banks";
import Branch  from "./components/Branch";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import ReserveHeader from "./components/ReserveHeader";
import BankReserve from "./components/BankReserve";
import Banking from './components/Banking';
import './App.css';
const ethers = require('ethers');
var Web3 = require('web3');



      
    

function App() {

 
  return (
    // <div className="App">
    //   <Navbar/>

    //    <h1>Banking Services</h1>
       
    //    <h3 > Wallet Address : {walletAddress}</h3>
    //    <div>
    //    <div>

       <div className="App">
       
       <BrowserRouter>
       <Routes>
       <Route path = '/' element ={<HomepageLayout />}/>
         <Route path = '/banks' element ={<Banks />}/>
         <Route path = '/branch' element ={<Branch />}/>
         <Route path = '/bankreserve' element ={<BankReserve />}/>
         <Route path = '/banking' element ={<Banking />}/>
       </Routes>
       </BrowserRouter>
   
     </div>
        
      
/* <Input
    label={<Dropdown defaultValue='.eth' options={options} />}
    labelPosition='right'
    placeholder='Find domain'
    onChange ={(e)=>setName(e.target.value)}
      value= {userName}
  />


      </div>
      <div>
     

<Input  onChange ={(e)=>setAddress(e.target.value)}
      value= {userAddress}  placeholder='0xBc34F...' />

      </div>
      <div>
     
<button class="ui secondary button">Register</button>

      </div>
      </div>


      <div  className='margin'>
      <div>
     
      <Input  onChange ={(e)=>setEnsName(e.target.value)}
      value= {ensName}  placeholder='0xBc34F...' />
      
     </div>
      <div>
     <button class="ui secondary button"  onClick={resolve()}>Resolve</button>
     </div>
      <div>
        <h4> Your ENS Address:{userEns}</h4>
      </div>
      </div>
      
    </div> */
  );
}

export default App;
