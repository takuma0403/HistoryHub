import { RouteObject } from 'react-router-dom'
import ReduxSample from './pages/ReduxSample'
import NotFound from './pages/NotFound'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <ReduxSample />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
