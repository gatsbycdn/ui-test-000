import React, { useState, useEffect } from 'react';

function useConfigStatus() {
  const[vmessJson, setVmessJson] = useState([])
  const[usingAdd, setUsingAdd] = useState(null)
  const [ipAddressAlien, setAlienIp] = useState(null)
  const [ipAddressEarth, setEarthIp] = useState(null);

  async function fetchAlienIp() { 
    await fetch('http://192.168.10.2/digapi.php', {method: 'get',})
    .then((res) => res.text())
    .then( data => setAlienIp(data))
  }

  async function fetchEarthIp() { 
    await fetch('http://192.168.10.2/sohuapi.php', {method: 'get',})
    .then((res) => res.text())
    .then( data => setEarthIp(data))
  }

  async function fetchUsingAdd() {
    await fetch('http://192.168.10.2/api.php', {method: 'get',})
      .then((response) => {
        return response.text();
      })
      .then(data =>  
        setUsingAdd(data)
      )
  }

  async function fetchConfig() {
    await fetch('http://192.168.10.2/genJSON.php', {method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}})
      .then((response) => {
        return response.json();
      })
      .then(data => setVmessJson(Array.from(data)))
  }

  async function switchConfig(vmessObj) {
    console.log('The link got clicked.')
    let prototypeJson = vmessJson
    let newVmessJson = prototypeJson.filter(obj => obj!==vmessObj)
    setVmessJson(newVmessJson)
    console.log(vmessJson)
    await fetch('http://192.168.10.2/switchConfig.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vmessObj) ,
    }).then((res) => {
      if(res.ok) {
        fetchAlienIp()
        fetchUsingAdd()
      }
    })
  }

  useEffect(() => {
    fetchUsingAdd()
    fetchAlienIp()
    fetchEarthIp()
    fetchConfig()
  }, [usingAdd])

  const boxStyle = {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 4px #666)",
    color: "black",
    fontSize: "1rem",
    textAlign: "center",
    //border: 2,
    fontFamily: "Arial",
    borderRadius: "1%",
  }

  const addBarStyle = {
    padding: 5,
    backgroundColor: "lavenderblush",
    //WebkitFilter: "drop-shadow(0px 0px 4px #666)",
    color: "black",
    fontSize: "1rem",
    textAlign: "center",
    border: 2,
    fontFamily: "Arial",
    borderRadius: "1%",
    
  }

  const ipBarStyle = {
    padding: 5,
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 1px #666)",
    color: "black",
    fontSize: "1rem",
    textAlign: "center",
    border: '1px',
    fontFamily: "Arial",
  }

  const pStyle = {
    top: "50%",
    left: "50%",
    margin: 5
  }

  const aStyle = {
    top: "50%",
    left: "50%",
    margin: 5,
    color: 'black',
    textDecoration: 'none'
  }

  const listItems = Array.from(vmessJson)
    .filter(obj => obj['add']!==usingAdd)
    .map((obj,index) => 
      <div className='col-sm-4' key={index}>
        <p onClick={() =>switchConfig(obj)} style={boxStyle}>
          {obj['ps']}
        </p>
      </div>)

  const url = "https://" + usingAdd + "/speedtest/index.html";

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div style={addBarStyle} className="col-sm-12">
            <p style={aStyle}><a href={url} style={aStyle}>{usingAdd}</a></p>
          </div>
          <div style={ipBarStyle} className="col-sm-12 col-md">
            <p style={pStyle}>国外 IP: {ipAddressAlien}</p>
          </div>
          <div style={ipBarStyle} className="col-sm-12 col-md">
            <p style={pStyle}>国内 IP: {ipAddressEarth}</p>
          </div>
        </div>
      </div>
      <br></br>
      <div className="container-fluid">
        <div className="row">
        {listItems}
        </div>
      </div>
    </div>
  )
}

export default useConfigStatus