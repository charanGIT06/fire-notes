import { Navigate } from "react-router-dom"
import UserAuth from "../context/UserContext"
import propTypes from 'prop-types'

const ProtectedRoute = ({ children }) => {
  ProtectedRoute.propTypes = {
    children: propTypes.node.isRequired,
  }
  const { user } = UserAuth()

  if (!user) {
    return <Navigate to='/login' />
  }

  return children
}

export default ProtectedRoute