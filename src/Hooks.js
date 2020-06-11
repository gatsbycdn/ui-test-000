import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import Apolloclient from 'apollo-boost';
import { gql } from 'apollo-boost';
import fetch from 'node-fetch';

function UseConfigStatus() {

  dotenv.config()

  const[vmessJson, setVmessJson] = useState([])
  const[usingAdd, setUsingAdd] = useState('')
  const [ipAddressAlien, setAlienIp] = useState('')
  const [ipAddressEarth, setEarthIp] = useState(null)
  const [clickedId, setClick] = useState(null)
  const [siteName, setSiteName] = useState('')
  const [siteIp, setSiteIp] = useState('')

  async function fetchUsingAdd(ip) {
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    const client = new Apolloclient({
      uri: apolloApiURL
    })
    
    client
      .query({
        query: gql`
        {
          getConfig(ip:"${ip}") {
            name
          }
        }`
      })
      .then(res => res.data.getConfig)
      .then(res => setUsingAdd(res.name))
  }

  /**async function fetchUsingAdd() {
    console.log(process.env.REACT_APP_LOCAL_API_URL)
    const apiURL = process.env.REACT_APP_LOCAL_API_URL; 
    await fetch(apiURL, {method: 'get',})
      .then((response) => {
        return response.text();
      })
      .then(data =>  
        setUsingAdd(data)
      )
  }**/

  async function fetchConfig() {
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    const client = new Apolloclient({
      uri: apolloApiURL
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
      .then(data => {
        setVmessJson(Array.from(data))
      })
  }

  async function deleteConfig(id) {
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    console.log(id)
    const client = new Apolloclient({
      uri: apolloApiURL
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
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    const client = new Apolloclient({
      uri: apolloApiURL
    })
    
    await client
      .mutate({
        mutation: gql`
        mutation {
          updateConfig
        }`
      })
    setClick(null)
    fetchConfig()
  }

  async function switchConfig(vmessObj) {
    console.log(`The link of [${vmessObj['id']}] got clicked.`)
    let prototypeJson = vmessJson
    let newVmessJson = prototypeJson.filter(obj => obj!==vmessObj)
    //setClick(vmessObj['id'])
    setVmessJson(newVmessJson)
    console.log(vmessJson)
    console.log(process.env.REACT_APP_SWITCH_API_URL)
    const switchApiURL = process.env.REACT_APP_SWITCH_API_URL; 
    await fetch(switchApiURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vmessObj) ,
    }).then((res) => {
      if(res.ok) {
        setClick('update')
      }
    })
  }

  async function clickOption(vmessObj) {
    console.log(`The link of [${vmessObj['id']}] got clicked.`)
    setClick(vmessObj['id'])
  }

  async function deleteRecord(id) {
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    console.log(id)
    const client = new Apolloclient({
      uri: apolloApiURL
    })
    
    await client
      .mutate({
        mutation: gql`
        mutation {
          removeDNSRecord(id:"${id}")
        }`
      })
    await deleteConfig(id)
  }

  async function addDNSRecord(ps,ip) {
    const apolloApiURL = process.env.REACT_APP_APOLLO_API;
    console.log(ps + ip)
    const client = new Apolloclient({
      uri: apolloApiURL
    })
    
    await client
      .mutate({
        mutation: gql`
        mutation {
          addDNSRecord(ps:"${ps}",ip:"${ip}")
        }`
      }).then((res) => {
        if(res.ok) {
          fetchConfig()
          setClick(null)
        }
      })
  }

  function promptConfig () {
    console.log('add clicked')
    setClick('addConfig')
  }

  useEffect(() => {
    fetchConfig()
    async function fetchEarthIp() {
      const apolloApiURL = process.env.REACT_APP_APOLLO_API;
      const client = new Apolloclient({
        uri: apolloApiURL
      })
      
      client
        .query({
          query: gql`
          {
            getEarthIp {
              cip
              cid
              cname
            }
          }`
        })
        .then(res => res.data.getEarthIp)
        .then(res => setEarthIp(res.cip))
    }
  
    async function fetchAlienIp() {
      const apolloApiURL = process.env.REACT_APP_APOLLO_API;
      const client = new Apolloclient({
        uri: apolloApiURL
      })
      
      client
        .query({
          query: gql`
          {
            getAlienIp {
              ip
            }
          }`
        })
        .then(res => res.data.getAlienIp)
        .then(res => {
          setAlienIp(res.ip)
          fetchUsingAdd(res.ip)
        })
    }
    fetchEarthIp()
    fetchAlienIp()

  
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
    textAlign: "center",
    margin: 5
  }

  const aStyle = {
    top: "50%",
    left: "50%",
    margin: 5,
    color: "black",
    textAlign: "center",
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

  const placeHolderCenterStyle = {
    backgroundColor: "white",
    float: "center",
    right: 0,
    width: "100%",
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
              <span role="img" aria-label="removal">❌</span>
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
        <div className='col-sm-4' key='addConfig'>
        <div style={boxStyle}>
          <div style={placeHolderCenterStyle}>
            {(('addConfig'===clickedId) ? 
            <div onClick={() => console.log('clicked')}>
              <form onSubmit={() => addDNSRecord(siteName,siteIp)}>
                <label>
                  <input type="text" placeholder="Name" onChange={e => setSiteName(e.target.value)} />
                </label>
                <label>
                  <input type="text" placeholder="IP" onChange={e => setSiteIp(e.target.value)} />
                </label>
                <div>
                <input type="submit" value="+" onClick={console.log('Submit Clicked')} /></div>
              </form>
            </div> 
            : <span role="img" aria-label="plus" onClick={() => promptConfig()}>➕</span>)}
          </div>
        </div>
      </div>
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

export default UseConfigStatus