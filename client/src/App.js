import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuestionsProvider } from "./contexts/QuestionsContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Analytics from "./pages/Analytics";

function App() {
	return (
		<div className="App">
			<QuestionsProvider>
				<AnalyticsProvider>
					<Router>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/quiz" element={<Quiz />} />
							<Route path="/analytics" element={<Analytics />} />
						</Routes>
					</Router>
				</AnalyticsProvider>
			</QuestionsProvider>
		</div>
	);
}

export default App;
