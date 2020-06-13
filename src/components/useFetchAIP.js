import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_ALIEN_IP = gql`
  {
    getAlienIp {
      ip
    }    
  }
`

function useFetchAIP() {
  const [aIP, setAIP] = useState('')
  const { loading, error, data } = useQuery(GET_ALIEN_IP)

  useEffect(() => {
    if(data && data.getAlienIp)
    setAIP(data.getAlienIp.ip)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return aIP
}

export default useFetchAIP
