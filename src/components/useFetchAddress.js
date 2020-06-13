import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
// import FetchAIP from './FetchAIP';

const GET_NAME_BY_IP = gql`
  query GetConfig($ip: String!) {
    getConfig(ip: $ip) {
      name
    }
  }
`

function useFetchAddress(ip) {
  const [aAdd, setAAdd] = useState('')
  const { loading, error, data } = useQuery(GET_NAME_BY_IP, {
    variables: { ip }
  })

  useEffect(() => {
    if(data && data.getConfig)
    setAAdd(data.getConfig.name)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return aAdd
}

export default useFetchAddress
