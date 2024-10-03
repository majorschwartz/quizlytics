import React from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
	const navigate = useNavigate();
	const { analytics, clearAnalytics } = useAnalytics();

	const formatDate = (dateString) => {
		return dateString ? new Date(dateString).toLocaleString() : 'N/A';
	};

	const calculateDuration = () => {
		if (analytics.startTime && analytics.endTime) {
			const duration = new Date(analytics.endTime) - new Date(analytics.startTime);
			return `${Math.floor(duration / 60000)} minutes ${Math.floor((duration % 60000) / 1000)} seconds`;
		}
		return 'N/A';
	};

	const handleClearAnalytics = () => {
		if (window.confirm("Are you sure you want to clear all analytics data?")) {
			clearAnalytics();
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Back to home */}
			<button
				onClick={() => navigate("/")}
				className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Back to Home
			</button>
			<h1 className="text-3xl font-bold mb-6">Quiz Analytics</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<h2 className="text-xl font-semibold mb-4">Quiz Duration</h2>
				<p>Start Time: {formatDate(analytics.startTime)}</p>
				<p>End Time: {formatDate(analytics.endTime)}</p>
				<p>Total Duration: {calculateDuration()}</p>

				<h2 className="text-xl font-semibold mt-6 mb-4">Answer Times</h2>
				<ul>
					{Object.entries(analytics.answerTimes).map(([questionId, data]) => (
						<li key={questionId}>
							Question {questionId}: {formatDate(data.time)} - Answer: {data.answer}
						</li>
					))}
				</ul>

				<h2 className="text-xl font-semibold mt-6 mb-4">Text Selections</h2>
				<ul>
					{analytics.textSelections.map((selection, index) => (
						<li key={index}>
							"{selection.text}" - {formatDate(selection.time)}
						</li>
					))}
				</ul>

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