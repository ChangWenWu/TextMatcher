import React from 'react'
import './index.css'
export const ResultList = ({textResult,position}) => {
  return (
    <div className="resultlist-container">
      {
        textResult.map(item => {
        return <li key={item}>{item}</li>
      })}
    </div>
  );
};  
