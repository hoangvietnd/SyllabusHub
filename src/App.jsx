import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CourseList from "./page/CourseList";
import { MaterialUpload } from "./page/MaterialUpload";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Course List</Link>
            </li>
            <li>
              <Link to="/upload">Upload Material</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/courses" element={<CourseList />} />
          <Route path="/upload" element={<MaterialUpload />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the application. Use the navigation to go to the course list or upload materials.</p>
    </div>
  );
}

export default App;
