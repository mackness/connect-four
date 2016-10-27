import React, { Component } from 'react';

export default (props) => {
    return (
      <div className="winner-overlay">
        <div className="winner-overlay-inner">
          <h1 className="title">{`${props.winner} won!`}</h1>
          <span className="reset" onClick={props.reset}>restart</span>
        </div>
      </div>
    );
};
