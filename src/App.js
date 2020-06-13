import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import fetch from 'node-fetch';

function App() {
  dotenv.config()
  console.log('rendering...')

  const ALL_IN_ONE = gql`
  query {
    allInOne {
      localIP {
        cip
        cname
        cid
      }
      proxyIP {
        ip
      }
      config {
        name
        address
        alterId
        id
        ip
        path
        ps
        vid
      }
      configElse {
        name
        address
        alterId
        id
        ip
        path
        ps
        vid
      }
    }
  }
  `

  const UPDATE_CONFIG = gql`
  mutation {
    updateConfig {
      id
      name
      type
      content
      proxied
    }
  }
  `

  const DELETE_CONFIG = gql`
  mutation DeleteConfig($id: String) {
    deleteConfig(id: $id) {
      deletedCount
      id
      result {
        n
        ok
      }
    }
  }
  `

  const REMOVE_DNS_RECORD = gql`
  mutation RemoveDNSRecord($id: String) {
    removeDNSRecord(id: $id) {
      result {
        id
      }
      errors {
        code
        message
      }
      success 
      messages {
        code
        message
      }
    }
  }
  `

  const ADD_DNS_RECORD = gql`
  mutation AddDNSRecord($ps: String, $ip: String) {
    addDNSRecord(ps: $ps, ip: $ip) {
      result {
        id
      }
      success
      errors {
        code
        message
      } 
    }
  }
  
  `

  const { error, loading, data, refetch } = useQuery(ALL_IN_ONE)
  const [updateConfig] = useMutation(UPDATE_CONFIG)
  const [deleteConfig] = useMutation(DELETE_CONFIG)
  const [removeDNSRecord] = useMutation(REMOVE_DNS_RECORD)
  const [addDNSRecord] = useMutation(ADD_DNS_RECORD)

  const [clickStatus, setClickStatus] = useState(null)
  const [recordName, setRecordName] = useState('')
  const [recordContent, setRecordContent] = useState('')

  console.log(data)

  useEffect(() => {
    console.log(clickStatus + ': clickStatus recorded')
  }, [clickStatus]) 

  useEffect(() => {
    if(data && data.allInOne)
    setClickStatus(null)
  }, [data])

  if (loading) return null;
  if (error) return `Error! ${error}`;

  async function switchConfig(selectedConfig) {
    console.log(`The link of [${selectedConfig['address']}] got clicked.`)
    console.log(process.env.REACT_APP_SWITCH_API_URL)
    const switchApiURL = process.env.REACT_APP_SWITCH_API_URL; 
    await fetch(switchApiURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedConfig) ,
    }).then((res) => {
      if(res.ok) {
        refetch()
      }
    })
  }

  const dataAll = data.allInOne

  const config = data.allInOne.config

  //const url = "https://" + config.address + "/speedtest/index.html";

  const boxStyle = {
    position: "relative",
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 4px #666)",
    color: "black",
    fontSize: "1rem",
    textAlign: "center",
    fontFamily: "Arial",
    borderRadius: "1%",
    display: "flex"
  }
  const addBarStyle = {
    padding: 5,
    backgroundColor: "lavenderblush",
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

  const placeStyle = {
    backgroundColor: "white",
    float: "left",
    right: 0,
    width: "80%",
    margin: 5,
    border: "solid 1px",
    textAlign: "center"
  }

  const buttonStyle = {
    backgroundColor: "white",
    float: "right",
    right: 0,
    width: "10%",
    margin: 5,
    border: "solid 1px",
    textAlign: "center"
  }

  const Banner = () => <div className="container-fluid">
    <div className="row">
      <div style={addBarStyle} className="col-sm-12">
        <div style={aStyle}><a href={'https://' + config.address + "/speedtest/index.html"} style={aStyle}>{config.address}</a></div>
      </div>
      <div style={ipBarStyle} className="col-sm-12 col-md">
        <div style={pStyle}>国外 IP: {dataAll.proxyIP.ip}</div>
      </div>
      <div style={ipBarStyle} className="col-sm-12 col-md">
        <div style={pStyle}>国内 IP: {dataAll.localIP.cip}</div>
      </div>
    </div>
  </div>

  const ItemList = () => Array.from(dataAll.configElse)
  .map((obj, index) => 
    <div className='col-sm-4' key={(obj['id']) || index }>
      <div style={boxStyle}>
        <div onClick={() =>  {
          deleteConfig({ variables: { id: obj['id'] }}) 
          refetch()
        }
      } style={placeHolderRightStyle}>
          <span role="img" aria-label="collision">💥</span>
        </div>
        <div onClick={() => setClickStatus(obj['id'])} style={placeHolderLeftStyle}>
          {((clickStatus===obj['id']) ? 
          <div onClick={() => 
            {
              console.log(obj['id'])
              removeDNSRecord({ variables: { id: obj['id'] }})
              deleteConfig({ variables: { id: obj['id'] }}) 
              refetch()
            }  
          }>
            <span role="img" aria-label="removal">❌</span>
          </div> 
          : obj['ps'])}
        </div>
        <div onClick={() => switchConfig(obj)} style={placeHolderRightStyle}><span role="img" aria-label="rocket">🚀</span></div>
      </div>
    </div>)

  const Footer = () => <div style={ipBarStyle}>
    <span role="img" aria-label="fireworks"
      onClick={() => {
        updateConfig()
        setClickStatus(null)
        refetch()
      }
      }>
      🎆
    </span>
  </div>

  return (
  
  <div>
    <Banner />
    <br></br>
    <div className="container-fluid">
        <div className="row">
        <ItemList />
        <div className='col-sm-4' key='addRecord'>
          <div style={boxStyle}>
              <div style={placeHolderCenterStyle}>
                {(('addRecord'===clickStatus) ? 
                <div onClick={() => console.log('clicked')}>
                  <form onSubmit={() => {
                    addDNSRecord({ variables: { ps: recordName, ip: recordContent }})
                    updateConfig()
                    refetch()
                  } }>
                    <input style={placeStyle} type="text" placeholder="Name" onChange={e => setRecordName(e.target.value)} />
                    <input style={buttonStyle} type="button" value="-" onClick={() => setClickStatus(null)} />
                    <input style={placeStyle} type="text" placeholder="IP" onChange={e => setRecordContent(e.target.value)} />
                    <input style={buttonStyle} type="submit" value="+" onClick={console.log('Submit Clicked')} />
                  </form>
                </div> 
                : <span role="img" aria-label="plus" onClick={() => setClickStatus('addRecord')}>➕</span>)}
              </div>
          </div>
        </div>
      </div>
    </div>
    <br></br>
    <Footer />
  </div>
  )
}

export default App