import React from 'react';

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

function Bar(props) {
  return (
    <div className="container-fluid">
      <div className="row justify-content-md-center">
        <div className='col-md-7'>
          <div style={boxStyle}>
              <span style={caseCenter}>
                {props.value} 
              </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bar
