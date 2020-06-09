import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import Apolloclient from 'apollo-boost';
import { gql } from 'apollo-boost';
import fetch from 'node-fetch';

function useConfigStatus() {

  dotenv.config()

  const[vmessJson, setVmessJson] = useState([])
  const[usingAdd, setUsingAdd] = useState(null)
  const [ipAddressAlien, setAlienIp] = useState(null)
  const [ipAddressEarth, setEarthIp] = useState(null)
  const [clickedId, setClick] = useState(null)

  async function fetchAlienIp() {
    
    console.log(process.env.REACT_APP_T)
    const digApiURL = process.env.REACT_APP_DIG_API_URL;
    await fetch(digApiURL, {method: 'get',})
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
    const client = new Apolloclient({
      uri: 'http://192.168.10.2:4000'
    })
    
    client
      .query({
        query: gql`
        {
          listConfig {
            name
            address
            alterId
            id
            ip
            path
            ps
            vid
          }
        }`
      })
      .then(data => data.data.listConfig)
      .then(data => setVmessJson(Array.from(data)))
  }

  async function deleteConfig(id) {
    console.log(id)
    const client = new Apolloclient({
      uri: 'http://192.168.10.2:4000'
    })
    
    await client
      .mutate({
        mutation: gql`
        mutation {
          deleteConfig(id:"${id}")
        }`
      })
    fetchConfig()
  }

  async function updateConfigs() {
    const client = new Apolloclient({
      uri: 'http://192.168.10.2:4000'
    })
    
    await client
      .mutate({
        mutation: gql`
        mutation {
          updateConfig {
            id
          }
        }`
      })
    setClick(null)
    
    fetchConfig()
  }

  async function switchConfig(vmessObj) {
    console.log(`The link of [${vmessObj['id']}] got clicked.`)
    let prototypeJson = vmessJson
    let newVmessJson = prototypeJson.filter(obj => obj!==vmessObj)
    setClick(vmessObj['id'])
    setVmessJson(newVmessJson)
    console.log(vmessJson)
    await fetch('http://192.168.10.2/switchConfigTest.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vmessObj) ,
    }).then((res) => {
      if(res.ok) {
        fetchAlienIp()
        fetchEarthIp()
        fetchUsingAdd()
      }
    })
  }

  async function clickOption(vmessObj) {
    console.log(`The link of [${vmessObj['id']}] got clicked.`)
    setClick(vmessObj['id'])
  }

  async function deleteRecord(id) {
    console.log(`The dns record of [${id}] will be removed`)
    const apiURL = `https://api.cloudflare.com/client/v4/zones/{dns_zone_id}/dns_records/${id}`
    const headers = {'Authorization': 'Bearer Fpi4Tw5xYBDAjlN1zF-HNkXPiaEtTJfhdWVUB34Z',
    'Content-Type': 'application/json'}
    await fetch(apiURL, {
      method: 'DELETE',
      headers: headers,
    }).then((res) => {
      if(res.ok) {
        fetchAlienIp()
        fetchEarthIp()
        fetchUsingAdd()
      }
    })
  }

  useEffect(() => {
    fetchUsingAdd()
    fetchAlienIp()
    fetchEarthIp()
    fetchConfig()
  }, [clickedId])

  const boxStyle = {
    position: "relative",
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
    display: "flex"
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
    border: "1px",
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
    color: "black",
    textDecoration: "none"
  }

  const placeHolderLeftStyle = {
    backgroundColor: "white",
    float: "left",
    left: 0,
    width: "80%",
    textAlign: "center"
  }

  const placeHolderRightStyle = {
    backgroundColor: "white",
    float: "right",
    right: 0,
    width: "10%",
    textAlign: "center"
  }

  const listItems = Array.from(vmessJson)
    .filter(obj => obj['address']!==usingAdd)
    .map((obj) => 
      <div className='col-sm-4' key={obj['id']}>
        <div style={boxStyle}>
          <div onClick={() => deleteConfig(obj['id'])} style={placeHolderRightStyle}>
            <span role="img" aria-label="collision">💥</span>
          </div>
          <div onClick={() => clickOption(obj)} style={placeHolderLeftStyle}>
            {((obj['id']===clickedId) ? 
            <div onClick={() => deleteRecord(obj['id'])}>
              <span role="img" aria-label="removal">☹</span>
            </div> 
            : obj['ps'])}
          </div>
          <div onClick={() => switchConfig(obj)} style={placeHolderRightStyle}><span role="img" aria-label="rocket">🚀</span></div>
        </div>
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
      <br></br>
      <div style={ipBarStyle}>
        <span role="img" aria-label="fireworks"
          onClick={() => updateConfigs()}>
          🎆
        </span>
      </div>
    </div>
  )
}

export default useConfigStatus