import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
//import fetch from 'node-fetch';

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
        loc
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

const ALTER_CONFIG_ADDRESS = gql`
  mutation AlterConfigAddress($address: String) {
    alterAddress(address: $address) {
      address
      success
      error
    }
  }
`

function App() {
  dotenv.config()
  console.log('rendering...')

  const { error, loading, data, refetch } = useQuery(ALL_IN_ONE)
  const [
    updateConfig,
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_CONFIG, {
    refetchQueries: [{ query: ALL_IN_ONE }],
    awaitRefetchQueries: true
  })

  const [deleteConfig] = useMutation(DELETE_CONFIG)
  const [removeDNSRecord] = useMutation(REMOVE_DNS_RECORD)
  const [addDNSRecord] = useMutation(ADD_DNS_RECORD)
  const [alterAddress] = useMutation(ALTER_CONFIG_ADDRESS)

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

  //if (mutationLoading) return <p>Loading...</p>;
  //if (mutationError) return <p>Error :(</p>;

  /*async function switchConfig(selectedConfig) {
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
  }*/

  const dataAll = data.allInOne

  const config = data.allInOne.config

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
  const footerStyle = {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 1px #666)",
    color: "black",
    textAlign: "center",
    border: "1px",
    padding: 5,
    fontSize: "1rem"
    // fontSize: "65%" 
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

  const configAddress = (config && config.address !== null) ? config.address : 'failed to fetch'

  const Banner = () => <div className="container-fluid">
    <div className="row">
      <div style={addBarStyle} className="col-sm-12">
        <div style={aStyle}><a href={'https://' + configAddress + "/speedtest/index.html"} style={aStyle}>{configAddress}</a></div>
      </div>
      <div style={ipBarStyle} className="col-sm-12 col-md">
        <div style={pStyle} onClick={() => setClickStatus('checkProxy')}>
          {(clickStatus==='checkProxy') ? 
           <span onClick={() => setClickStatus(null)}>
             LOC: {dataAll.proxyIP.loc}
           </span>
           : 
           <span>
             Proxy IP: {dataAll.proxyIP.ip} 
           </span>
          }
        </div>
      </div>
      <div style={ipBarStyle} className="col-sm-12 col-md">
      <div style={pStyle} onClick={() => setClickStatus('checkLocal')}>
          {(clickStatus==='checkLocal') ? 
           <span onClick={() => setClickStatus(null)}>
             LOC: {dataAll.localIP.cname}
           </span>
           : 
           <span>
             Local IP: {dataAll.localIP.cip}
           </span>
          }
        </div>      
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
        <div style={placeHolderRightStyle}
          onClick={() => { 
            alterAddress({ variables: { address: obj['address'] }})
            refetch()
            }
          }>
          <span role="img" aria-label="rocket">🚀</span>
        </div>
      </div>
    </div>)

  const Footer = () => <div style={footerStyle}>
    <span role="img" aria-label="fireworks"
      onClick={() => {
        updateConfig()
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