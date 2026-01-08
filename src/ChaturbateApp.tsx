import { useRoutes } from 'react-router-dom';
import './App.css'
import HlsPlayer from './components/HlsPlayer';
import StreamList from './components/StreamList';

export default function ChaturbateApp() {

  const routes = [
    { path: "/", element: <StreamList /> },
    { path: ":id", element: <HlsPlayer /> }
  ]

  return useRoutes(routes);
}
