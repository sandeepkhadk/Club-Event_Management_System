import React from 'react'
import { useLocation } from "react-router-dom";
function Std_dash() {
  const location = useLocation();
  const { name } = location.state || {};
  return (
    <div>
      welcome {name} to your dashboard
    </div>
  )
}

export default Std_dash
