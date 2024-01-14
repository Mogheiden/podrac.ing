import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home/home_page';
import { ChussPage } from './pages/chussy/chuss_page';
import { Lesson1 } from './pages/LvCvJ/lesson1';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chuss',
    element: <ChussPage />,
  },
  {
    path: '/lesson1',
    element: <Lesson1 />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
