import React, { Component } from 'react';

export default (props) => {

    let slotState;
    switch(props.slot.state) {
      case 'preview':
        slotState = `preview ${props.slot.color}`
        break;
      case 'active':
        slotState = `active ${props.slot.color}`
        break;
    }
    
    return (
      <div className={`slot ${slotState || ''}`} onClick={props.handleClick.bind(this, props.colIndex)}>
        <div className="disc-container">
          <span style={{color: 'white'}}>{props.slotIndex}</span>
          <div className="disc" style={{background: props.slot && props.slot.color ? props.slot.color : '' }}></div>
        </div>
      </div>
    );
};
