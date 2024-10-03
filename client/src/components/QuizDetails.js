import React from "react";

const QuizDetails = ({ analytics, formatDate }) => {
	return (
		<>
			<h2 className="text-xl font-semibold mt-6 mb-4">Quiz Details</h2>
			<p>Start Time: {formatDate(analytics.startTime)}</p>
			<p>End Time: {formatDate(analytics.endTime)}</p>
		</>
	);
};

export default QuizDetails;
