import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home/home_page';
import { ChussPage } from './pages/chussy/chuss_page';
import { Lesson1 } from './pages/LvCvJ/lesson1';
import { SnekGame } from './pages/snek/snek_pej';
import { CaesarPage } from './pages/Caesar cypher/caesar_page';
import { Nldle } from './pages/NLDLE/NL_page';
import { WordCloud } from './pages/WordCloud/WordCloud';
import { PseudokuPage } from './pages/pseudoku/pseudoku_page';

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
    path: '/snek',
    element: <SnekGame />,
  },
  {
    path: '/caesar',
    element: <CaesarPage />,
  },
  {
    path: '/lesson1',
    element: <Lesson1 />,
  },
  {
    path: '/nldle',
    element: <Nldle />,
  },
  {
    path: '/wordcloud',
    element: <WordCloud />,
  },
  {
    path: '/pseudoku',
    element: <PseudokuPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
