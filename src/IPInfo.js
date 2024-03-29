import dotenv from 'dotenv';
import React, { useState, useEffect } from 'react';
import { useQuery, gql} from '@apollo/client';
import { Home, Public, Info } from '@material-ui/icons';
//import { red } from '@material-ui/core/colors';

const IP_INFO = gql`
  query {
    ipInfo {
      localIP {
        ip
        loc
        isp
      }
      proxyIP {
        ip
        loc
      }
    }
  }
`

function IPInfo() {
  dotenv.config()
  console.log('rendering...')

  const { error, loading, data, refetch } = useQuery(IP_INFO)

  const [clickStatus, setClickStatus] = useState(null)

  console.log(data)

  useEffect(() => {
    console.log(clickStatus + ': clickStatus recorded')
  }, [clickStatus]) 

  useEffect(() => {
    if(data && data.ipInfo)
    setClickStatus(null)
  }, [data])

  if (loading) return null;
  if (error) return console.log(error);

  const dataAll = data.ipInfo

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

  const myHome = {...caseLeft}

  const banner = (param) => {
    switch(param) {
      case 'remote':
        return <div>
          <Home style={caseLeft} onClick={() => setClickStatus('local')} />
          <span style={caseCenter} onClick={() => refetch()}>{dataAll.proxyIP.ip}</span>
          <Info style={caseRight} onClick={() => setClickStatus('remoteInfo')}/>
        </div>

      case 'local':
        return <div>
        <Public style={caseLeft} onClick={() => setClickStatus('remote')} />
        <span style={caseCenter} onClick={() => refetch()}>{dataAll.localIP.ip}</span>
        <Info style={caseRight} onClick={() => setClickStatus('localInfo')}/>
      </div>

      case 'remoteInfo':
        return <div>
          <span style={caseCenter} onClick={() => setClickStatus('remote')}>{dataAll.proxyIP.loc}</span>
        </div>

      case 'localInfo':
        return <div>
          <span style={caseCenter} onClick={() => setClickStatus('local')}>{dataAll.localIP.loc + dataAll.localIP.isp}</span>
        </div>

      default:
        return <div>
          <Home style={myHome} onClick={() => setClickStatus('local')} />
          <span style={caseCenter} onClick={() => refetch()}>{dataAll.proxyIP.ip}</span>
          <Info style={caseRight} onClick={() => setClickStatus('remoteInfo')}/>
        </div>
    }
  }

  return (
    <div className="container-fluid">
      <br></br>
    <div className="row justify-content-md-center">
      <div className='col-md-7'>
        <div style={boxStyle}>
            <span style={caseCenter}>
              {banner(clickStatus)}
            </span>
        </div>
      </div>
    </div>
  </div>
    
  )
}

export default IPInfo