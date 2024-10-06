import React from "react";

const TextSelections = ({ analytics, formatDate }) => {
	// Check if there are any text selections
	if (analytics.textSelections.length === 0) {
		return (
			<>
				<h2 className="text-xl font-semibold mt-6 mb-4">Text Selections</h2>
				<p className="text-gray-600">No text selections have been made.</p>
			</>
		);
	}

	return (
		<>
			<h2 className="text-xl font-semibold mt-6 mb-4">Text Selections</h2>
			<ul className="space-y-4">
				{analytics.textSelections.map((selection, index) => (
					<li key={index} className="bg-gray-100 p-4 rounded-lg">
						<div className="flex justify-between items-center mb-2">
							<span className="text-lg font-semibold">Selection #{index + 1}</span>
							<span className="text-sm text-gray-600">
								Duration: {selection.deselectedTime 
									? formatDuration(new Date(selection.deselectedTime) - new Date(selection.selectedTime))
									: "Ongoing"}
							</span>
						</div>
						<p className="font-medium mb-2">"{selection.text}"</p>
						<p className="text-sm text-gray-600">
							Selected: {formatDate(selection.selectedTime)}
						</p>
						{selection.deselectedTime && (
							<p className="text-sm text-gray-600">
								Deselected: {formatDate(selection.deselectedTime)}
							</p>
						)}
					</li>
				))}
			</ul>
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

export default TextSelections;
