import TextEditor from "./components/text-editor/text-editor";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import {v4 as uuidV4} from 'uuid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Navigate to={`/documents/${uuidV4()}`}/>}/>
        <Route path="/documents/:id" element={ <TextEditor />}/>
      </Routes>
    </Router>
  );
}

export default App;
