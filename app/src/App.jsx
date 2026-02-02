
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Faucet from './components/Faucet';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/faucet" element={<Faucet />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
