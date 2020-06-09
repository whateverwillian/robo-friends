import React from 'react';

const Scroll = ({ children }) => {
  return (
    <div style={{
      overflowY: 'scroll', 
      height: '800px'
    }}>
      { children }
    </div>
  )
}

export default Scroll;