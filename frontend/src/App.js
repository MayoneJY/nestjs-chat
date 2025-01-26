import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/chat/:name" element={<Chat/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
