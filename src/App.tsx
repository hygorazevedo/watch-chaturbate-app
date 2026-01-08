import { Route, Routes } from 'react-router-dom';
import './App.css'
import HlsPlayer from './components/HlsPlayer';
import StreamList from './components/StreamList';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StreamList />} />
        <Route path="/:id" element={<HlsPlayer />} />
      </Routes>
    </>
  );
}
