import React from 'react';
import useConfigStatus from './Hooks'

function App() {
  return (
    <div>
    {useConfigStatus()}
    </div>
  );
}

export default App;
