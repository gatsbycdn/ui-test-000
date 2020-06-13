import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const DELETE_CONFIG_BY_ID = gql`
  mutation DeleteConfig($id: String!) {
    deleteConfig(id: $id)
  }
`

function useDeleteConfig(id) {
  const [idSelected, setId] = useState('')
  const { loading, error, data } = useMutation(DELETE_CONFIG_BY_ID, {
    variables: { id }
  })

  useEffect(() => {
    if(data && data.deleteConfig)
    setId(data.deleteConfig)
  }, [data])

  if (loading) return 'Loading...';
  if (error) return 'Error :(';

  return idSelected
}

export default useDeleteConfig
