import React from "react";

const TextSelections = ({ analytics, formatDate }) => {
	return (
		<>
			<h2 className="text-xl font-semibold mt-6 mb-4">Text Selections</h2>
			<ul>
				{analytics.textSelections.map((selection, index) => (
					<li key={index}>
						"{selection.text}" - {formatDate(selection.time)}
					</li>
				))}
			</ul>
		</>
	);
};

export default TextSelections;
