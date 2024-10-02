import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./pages/Quiz";
import Analytics from "./pages/Analytics";

function App() {
	return <div className="App">
		<Router>
            <Routes>
                <Route path="/" element={<Quiz />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </Router>
	</div>;
}

export default App;
