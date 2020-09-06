import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client'
import { ArrowUpward, AddBox, Delete, ExitToApp, Update, DeleteForever, Flag, MoreVert, Speed, Warning, CheckCircle, Launch, Info } from '@material-ui/icons';
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
/* import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'; */
import IconButton from '@material-ui/core/IconButton';

const GET_ITEMS = gql`
  query {
    getItems {
      config {
        name
        address
        alterId
        id
        ip
        path
        ps
        vid
        status
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
        status
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

function Items() {
  dotenv.config()
  console.log('rendering...')

  const { error, loading, data, refetch } = useQuery(GET_ITEMS)
  const [
    updateConfig,
    // { loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_CONFIG, {
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
    if(data && data.getItems)
    setClickStatus(null)
  }, [data])

  if (loading) return null;
  if (error) return (
    
    <div
    onClick={() => { 
      alterAddress({ variables: { address: 'luochengqi.com' }})
      setTimeout(refetch,50)
      }
    }>
    <div>`Error! ${error}`</div>
    <span role="img" aria-label="rocket">🚀</span>
  </div>
  );

  const dataAll = data.getItems

  const boxStyle = {
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

  const v2Address = (dataAll.config.address) ? dataAll.config.address : null

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
          <Flag style={caseLeft} />
          <span style={caseCenter} >{v2Address}</span>
          <MoreVert style={caseRight} onClick={() => setClickStatus('topCases')}/>
        </div>
    }
  }

  const itemBar = (item, param) => {
    switch(param) {
      case item.id:
        return <div>
          <Delete style={caseLeft} onClick={() => {
            deleteConfig({ variables: { id: item['id'] }})
            refetch()}}/>
          <span style={caseCenter} onClick={() => setClickStatus(null)}>{item.ip}</span>
          <DeleteForever style={caseRight} onClick={() => {
            console.log(item['id'])
            removeDNSRecord({ variables: { id: item['id'] }})
            deleteConfig({ variables: { id: item['id'] }}) 
            refetch()}}/>
        </div>

      default:
        return <div>
          { (item['status']==='online') ? <CheckCircle style={caseLeft}/> : <Warning style={caseLeft}/> }
          <span style={caseCenter} onClick={() => setClickStatus(item.id)}>{item['ps'].split('-').slice(-3).join('-')}</span>
          <Launch style={caseRight}
            onClick={() => { 
            alterAddress({ variables: { address: item['address'] }})
            setTimeout(refetch,50)
            }
          }/>
        </div>
    }
  }

  const ItemList = () => Array.from(dataAll.configElse)
// to filter private network
  .filter( obj => isNaN(Number(obj['name'].slice(1,2))) === false )
  .map((obj, index) => 
    <div className='col-md-7' key={(obj['id']) || index }>
      <div style={boxStyle}>
        {itemBar(obj,clickStatus)}
      </div>
    </div>)

  const Footer = () => <div style={footerStyle}>
    <Update  onClick={() => { updateConfig() }}/>
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
        <ItemList />
        <div className='col-md-7' key='addRecord'>
          <div style={boxStyle}>
              <div style={caseCenter}>
                {(('addRecord'===clickStatus) ? 
                <div onClick={() => console.log('clicked')}>
                  <form noValidate autoComplete="off" onSubmit={() => {
                    addDNSRecord({ variables: { ps: recordName, ip: recordContent }})
                    updateConfig()
                    setTimeout(refetch,100)
                    refetch()
                  } }>
                    <TextField style={phCenter} margin="dense" size="small" id="filled-basic" label="Name" variant="filled" type="text" placeholder="Name" onChange={e => setRecordName(e.target.value)} />
                    <TextField style={phCenter} margin="dense" size="small" id="filled-basic" label="IP" variant="filled" type="text" placeholder="IP" onChange={e => setRecordContent(e.target.value)} />      
                    <br></br>
                    <IconButton style={phCenter} variant="filled" type="submit" onClick={() => {console.log('Submit Clicked')}} aria-label="arrowupward">
                      <ArrowUpward/> submit
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