import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client'
import { ArrowUpward, AddBox, Delete, ExitToApp, Update, DeleteForever, Flag, Link, MoreVert, Speed, Warning, CheckCircle, FlightTakeoff, Info, Refresh, CloudQueue, CloudOff } from '@material-ui/icons';
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
/* import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'; */
import IconButton from '@material-ui/core/IconButton';
import ReactCountryFlag from "react-country-flag";
import { orange } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

const GET_ITEMS = gql`
  query {
    getItems {
      config {
        name
        address
        id
        ip
        ps
        status
        proxied
      }
      configElse {
        name
        address
        id
        ip
        ps
        status
        proxied
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
      name
      address
      id
      ip
      ps
      status
      proxied
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

const PROXIFY = gql`
  mutation Proxify($id: String, $proxied: Boolean) {
    proxify(id: $id, proxied: $proxied) {
      name
      address
      id
      ip
      ps
      status
      proxied
    }
  }`
/*
const PROXIFY = gql`
  mutation Proxify($id: String) {
    proxify(id: $id) {
      success
      error
      proxied
    }
  }`*/



const UPDATE_STATUS = gql`
  mutation {
    updateStatus {
      success
      error
    }
  }
`

const UPDATE_STATUS_ONE = gql`
  mutation UpdateStatusOne($address: String) {
    updateStatusOne(address: $address) {
      success
      error
    }
  }
`
function Items() {
  dotenv.config()
  console.log('rendering...')

  const { error: queryError, loading: queryLoading, data, refetch } = useQuery(GET_ITEMS)
  const [
    updateConfig,
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_CONFIG, {
    refetchQueries: [{ query: GET_ITEMS }],
    awaitRefetchQueries: true
  })

  const [
    updateStatus,
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_STATUS, {
    refetchQueries: [{ query: GET_ITEMS }],
    awaitRefetchQueries: true
  })

  const [
    updateStatusOne,
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_STATUS_ONE, {
    refetchQueries: [{ query: GET_ITEMS }],
    awaitRefetchQueries: true
  })

  const [
    proxify, // { loading: mutationLoading, error: mutationError}
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(PROXIFY, {
    refetchQueries: [{ query: GET_ITEMS }],
    awaitRefetchQueries: true
  })


  const [deleteConfig] = useMutation(DELETE_CONFIG)
  const [removeDNSRecord] = useMutation(REMOVE_DNS_RECORD)
  const [addDNSRecord] = useMutation(ADD_DNS_RECORD)
  const [alterAddress] = useMutation(ALTER_CONFIG_ADDRESS)

  const [clickStatus, setClickStatus] = useState(null)
  const [recordName, setRecordName] = useState('')
  const [recordContent, setRecordContent] = useState('')
//  const [proxyState, setProxyState] = useState(false)

  console.log(data)

  useEffect(() => {
    console.log(clickStatus + ': clickStatus recorded')
  }, [clickStatus]) 

  useEffect(() => {
    if(data && data.getItems && data.getItems.v2Address)
    setClickStatus(null)
  }, [data])

  if (queryLoading) return null;
  if (queryError) return (
    
    <div
    onClick={() => { 
      alterAddress({ variables: { address: '103-73-67-105-hosthatch-hk-central.gatsbycdn.com' }})
      setTimeout(refetch,50)
      }
    }>
    <div>`Error! ${queryError}`</div>
    <span role="img" aria-label="rocket">🚀</span>
  </div>
  );

  const dataAll = data.getItems

  const boxStyle = {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 4px #666)",
    fontSize: "1rem",
    textAlign: "center",
    fontFamily: "Arial",
    borderRadius: "1%",
    display: "flex"
  }

  const footerStyle = {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    WebkitFilter: "drop-shadow(0px 0px 1px #666)",
    textAlign: "center",
    border: "1px",
    padding: 5,
    fontSize: "1rem"
    // fontSize: "65%" 
  }

  const caseLeft = {
    backgroundColor: "white",
    float: "left",
    left: 0,
    width: "10%",
    textAlign: "center"
  }

  const caseRight = {
    backgroundColor: "white",
    float: "right",
    right: 0,
    width: "10%",
    textAlign: "center"
  }

  const caseCenter = {
    backgroundColor: "white",
    float: "center",
    left: 0,
    width: "100%",
    fontSize: "1rem",
    textAlign: "center"
  }

  const phCenter = {
    backgroundColor: "white",
    float: "center",
    left: 0,
    width: "80%",
    fontSize: "1rem",
    textAlign: "center"
  }

  const cfIcon = {...caseRight, ...{color: orange[500], size: "small"}}
  const flagIcon = {...caseLeft, ...{color: red[200]}}

  // const myorange = { color: orange[500] }

  const v2Address = (dataAll.config && dataAll.config.address) ? dataAll.config.address : `Loading...`

  const banner = (param) => {
    switch(param) {
      case 'speedtest':
        return <div style={caseCenter}><a href={'https://' + v2Address + "/speedtest/index.html"}>{v2Address}</a></div>

      case 'ip':
        return <div>
          <span style={caseCenter} onClick={() => setClickStatus('topCases')}>{dataAll.config.ip}</span>
          
        </div>

      case 'topCases':
        return <div>
        <Speed style={caseLeft} onClick={() => window.location.href=('https://' + v2Address + "/speedtest/index.html")} />
        <span style={caseCenter} onClick={() => setClickStatus('ip')}><Info/></span>
        <ExitToApp style={caseRight} onClick={() => setClickStatus('address')}/>
      </div>

      default:
        return <div>
          <Flag style={flagIcon} />
          <span style={caseCenter} >{dataAll.config.ps}</span>
          <MoreVert style={caseRight} onClick={() => setClickStatus('topCases')}/>
        </div>
    }
  }
// <div><span style={caseCenter} onClick={() => setClickStatus(null)}>{item.address}</span></div>
  const itemBar = (item, param) => {
    switch(param) {
      case item.id:
        return <div>
          <div onClick={() => setClickStatus(null)}>{item['address']}</div>
          <div style={caseCenter}>
          <Delete style={caseLeft} onClick={() => {
            deleteConfig({ variables: { id: item['id'] }})
            refetch()}}/>
          <span style={caseCenter} onClick={() => setClickStatus(null)}><span><a href={'https://' + item.address}><Link /></a></span></span>
          <DeleteForever style={caseRight} onClick={() => {
            console.log(item['id'])
            removeDNSRecord({ variables: { id: item['id'] }})
            deleteConfig({ variables: { id: item['id'] }}) 
            refetch()}}/></div>
        </div>

// after 'ps'
// <span style={caseCenter} onClick={() => setClickStatus(item.id)}>{item['ip']}</span>
// {(item['ps'].split('-')[6].slice(-2)==='cf') ? <CloudQueue style={cfIcon}/> : <CloudOff color="disabled" style={caseRight} /> }
      default:
        return <div>
          <div>
            <span style={caseLeft}><ReactCountryFlag countryCode={item['ps'].split('-')[5]} onClick={() => setClickStatus(item.ip)} svg /></span>
            
            <span>{item['ps'].split('-').splice(-3).join('-')}</span>
            
            <span id={item.id} onClick={() => {
                proxify({ variables: { id: item['id'], proxied: (!item['proxied']) }})
              }
            }> 
              {(item['proxied']) ? <CloudQueue style={cfIcon}/> : <CloudOff color="disabled" style={caseRight} /> } 
            </span>
            
          </div>
          <div>
            <span style={caseLeft} onClick={() => 
              {
                console.log(item['address'])
                updateStatusOne({ variables: { address: item['address'] }})
              }}>
                { (item['status']==='online') ? <CheckCircle fontSize="small" /> : <Warning/> }  
            </span>          
            <span style={caseCenter} onClick={() => setClickStatus(item.id)}>{item['ip']}</span>                       
            <FlightTakeoff style={caseRight}
              onClick={() => { 
              alterAddress({ variables: { address: item['address'] }})
              setTimeout(refetch,50)
              }
            }/>


          </div>
        </div>
    }
  }

  const ItemList = () => Array.from(dataAll.configElse)
// to filter private network
// isNaN(Number(obj['name'].slice(1,2)))
  .filter( obj => (obj['name'].split('-').length > 3) === true )
  .map((obj, index) => 
    <div className='col-md-7' key={(obj['id']) || index }>
      <div style={boxStyle}>
        <div style={caseCenter}>
        {itemBar(obj,clickStatus)}
        </div>
      </div>
    </div>)

  const RefreshBar = () => <div className='col-md-7' key='updateStatus'>
    <div style={boxStyle}>
      <div style={caseCenter}>
        <Refresh role="img" aria-label="plus" onClick={() => {
          updateStatus()
          setTimeout(refetch,50)
          setClickStatus(null)
        }} />
      </div>
    </div>
  </div>

  const Footer = () => <div style={footerStyle}>
    <Update  onClick={() => { 
      updateConfig()
      setClickStatus(null) }}/>
  </div>

/*  const ProxySelector = () => 
    <Select
    value={proxyState}
    onChange={(e) => {
      setProxyState(e.target.value)
      console.log(proxyState)
    }}
    label="proxied"
  >
    <MenuItem value={true}>True</MenuItem>
    <MenuItem value={false}>False</MenuItem>
  </Select>
*/

  return (
  
  <div>
    <div className="container-fluid">
        <div className="row justify-content-md-center">
        <div className='col-md-7'>
          <div style={boxStyle}>
            <div style={caseCenter}>
            {banner(clickStatus)}
            </div>
          </div>
        </div>

        <br></br>

        <RefreshBar />

<ItemList />

        
        <div className='col-md-7' key='addRecord'>
          <div style={boxStyle}>
              <div style={caseCenter}>
                {(('addRecord'===clickStatus) ? 
                <div onClick={() => console.log('clicked')}>
                  <form noValidate autoComplete="off" onSubmit={() => {
                    addDNSRecord({ variables: { ps: recordName, ip: recordContent }})
                    //refetch()
                    setTimeout(refetch,50)
                    //setClickStatus(null)
                  } }>
                    <TextField style={phCenter} margin="dense" size="small" id="filled-basic" label="Name" variant="filled" type="text" placeholder="Name" onChange={e => setRecordName(e.target.value)} />
                    <TextField style={phCenter} margin="dense" size="small" id="filled-basic" label="IP" variant="filled" type="text" placeholder="IP" onChange={e => setRecordContent(e.target.value)} />      

                    <IconButton style={phCenter} variant="filled" type="submit" onClick={() => {console.log('Submit Clicked')}} aria-label="arrowupward">
                      <ArrowUpward />
                    </IconButton>
                  </form>
                </div> 
                : <span onClick={() => setClickStatus('addRecord')}><AddBox/></span>)}
              </div>
              
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
    <br></br>
    <br></br>
    <Footer />
  </div>
  
  )
}

export default Items