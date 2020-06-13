import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LIST_CONFIG = gql`
  {
    listConfig {
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
`

function useFetchConfig() {
  const [config, setConfig] = useState('')
  const { loading, error, data } = useQuery(LIST_CONFIG)

  useEffect(() => {
    if(data && data.listConfig)
    setConfig(data.listConfig)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return config
}

export default useFetchConfig
