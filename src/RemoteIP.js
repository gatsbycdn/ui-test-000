import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import Bar from './Bar';

const GET_ALIEN_IP = gql`
  {
    getAlienIp {
      ip
    }    
  }
`

function FetchRemoteIP() {
  const [aIP, setAIP] = useState('')
  const { loading, error, data } = useQuery(GET_ALIEN_IP)

  useEffect(() => {
    if(data && data.getAlienIp)
    setAIP(data.getAlienIp.ip)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return (
    <Bar value={aIP} />
  )
}

export default FetchRemoteIP
