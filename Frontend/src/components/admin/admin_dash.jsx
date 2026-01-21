import React from 'react'
import { useLocation } from 'react-router-dom'
function Admin_dash() {
  const location=useLocation()
  const { name } = location.state || {};
  return (
    <div>
      welcome admin {name}
    </div>
  )
}

export default Admin_dash
