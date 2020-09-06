import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import Bar from './Bar';
import HomeIcon from '@material-ui/icons/Home';

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

const caseCenter = {
  backgroundColor: "white",
  float: "center",
  left: 0,
  width: "100%",
  fontSize: "1rem",
  textAlign: "center"
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

const GET_EARTH_IP = gql`
  {
    getEarthIp {
      cip
      cname
    }    
  }
`

function FetchLocalIP() {
  const [eIP, setEIP] = useState('')
  const { loading, error, data } = useQuery(GET_EARTH_IP)

  useEffect(() => {
    if(data && data.getEarthIp)
    setEIP(data.getEarthIp.cip)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return <div className="container-fluid">
  <div className="row justify-content-md-center">
    <div className='col-md-7'>
      <div style={boxStyle}>
        <HomeIcon style={caseLeft}/>
          <span style={caseCenter}>
            {eIP} 
          </span>
      </div>
    </div>
  </div>
</div>
}

export default FetchLocalIP

