import { HashRouter, BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css'
import AnswerBox from './elems/handleAnswer';
import SettingsBox from './elems/handleSettings';


function App() {
  return (
      <HashRouter>
      <Routes>
        <Route path="/answer" element={<AnswerBox/>} />
        <Route path="/settings" element={<SettingsBox/>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
