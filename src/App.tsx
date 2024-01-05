import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home/home_page';
import { ChussPage } from './pages/chussy/chuss_page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chuss',
    element: <ChussPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
