import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_EARTH_IP = gql`
  {
    getEarthIp {
      cip
      cname
    }    
  }
`

function useFetchEIP() {
  const [eIP, setEIP] = useState('')
  const { loading, error, data } = useQuery(GET_EARTH_IP)

  useEffect(() => {
    if(data && data.getEarthIp)
    setEIP(data.getEarthIp.cip)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return eIP
}

export default useFetchEIP
