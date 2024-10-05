import React from "react";

const QuizDetails = ({ analytics, formatDate }) => {
	return (
		<>
			<div className="bg-gray-100 p-4 rounded-lg">
				<div className="flex justify-between items-center mb-2">
					<span className="text-lg font-semibold">Quiz Session</span>
					<span className="text-sm text-gray-600">
						Duration: {formatDuration(new Date(analytics.endTime) - new Date(analytics.startTime))}
					</span>
				</div>
				<p className="text-sm text-gray-600">
					Start Time: {formatDate(analytics.startTime)}
				</p>
				<p className="text-sm text-gray-600">
					End Time: {formatDate(analytics.endTime)}
				</p>
			</div>
		</>
	);
};

const formatDuration = (ms) => {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	
	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
};

export default QuizDetails;
