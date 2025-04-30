import { RouteObject } from 'react-router-dom'
import ReduxSample from './pages/ReduxSample'
import NotFound from './pages/NotFound'
import { Navigate } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <ReduxSample />,
  },
  {
    path: '/error/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/error/404" replace />,
  },
]

export default routes
