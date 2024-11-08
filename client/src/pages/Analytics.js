import React from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";
import QuizTimeline from "../components/QuizTimeline";
import QuizDetails from "../components/QuizDetails";
import TextSelections from "../components/TextSelections";

const Analytics = () => {
	const navigate = useNavigate();
	const { analytics, clearAnalytics } = useAnalytics();

	const formatDate = (dateString) => {
		return dateString ? new Date(dateString).toLocaleString() : "N/A";
	};

	const handleClearAnalytics = () => {
		if (
			window.confirm("Are you sure you want to clear all analytics data?")
		) {
			clearAnalytics();
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<button
				onClick={() => navigate("/")}
				className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Back to Home
			</button>
			<div className="bg-white rounded px-8 pt-6 pb-8 mb-4">
				<QuizTimeline analytics={analytics} />
				<QuizDetails analytics={analytics} formatDate={formatDate} />
				<TextSelections analytics={analytics} formatDate={formatDate} />

				<button
					onClick={handleClearAnalytics}
					className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
				>
					Clear Analytics
				</button>
			</div>
		</div>
	);
};

export default Analytics;
