import React, { Component } from 'react';

export default (props) => {
    return (
      <div className="winner-overlay">
        <div className="winner-overlay-inner animated rubberBand">
          <h1 className="winner-overlay__title">{`${props.winner} won!`}</h1>
          <span className="winner-overlay__button" onClick={props.reset}>restart</span>
        </div>
      </div>
    );
};
