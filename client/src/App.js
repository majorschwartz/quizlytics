import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Analytics from "./pages/Analytics";

function App() {
	return (
		<div className="App">
			<AnalyticsProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/quiz" element={<Quiz />} />
						<Route path="/analytics" element={<Analytics />} />
					</Routes>
				</Router>
			</AnalyticsProvider>
		</div>
	);
}

export default App;
