import React, { createContext, useContext, useState, useEffect } from "react";

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
	const [analytics, setAnalytics] = useState(() => {
		const savedAnalytics = localStorage.getItem("quizAnalytics");
		return savedAnalytics
			? JSON.parse(savedAnalytics)
			: {
					startTime: null,
					endTime: null,
					answerTimes: {},
					textSelections: [],
					visibilityChanges: [], // Ensure this is initialized as an empty array
			  };
	});

	useEffect(() => {
		localStorage.setItem("quizAnalytics", JSON.stringify(analytics));
	}, [analytics]);

	const startQuiz = () => {
		setAnalytics({
			startTime: new Date().toISOString(),
			endTime: null,
			answerTimes: {},
			textSelections: [],
			visibilityChanges: [], // Add this to reset visibilityChanges when starting a new quiz
		});
	};

	const endQuiz = () => {
		setAnalytics((prev) => ({
			...prev,
			endTime: new Date().toISOString(),
		}));
	};

	const recordAnswer = (questionId, answer) => {
		setAnalytics((prev) => ({
			...prev,
			answerTimes: {
				...prev.answerTimes,
				[questionId]: [
					...(prev.answerTimes[questionId] || []),
					{ time: new Date().toISOString(), answer },
				],
			},
		}));
	};

	const recordTextSelection = (selectedText, isSelected) => {
		setAnalytics((prev) => {
			const currentTime = new Date().toISOString();
			let updatedSelections = [...prev.textSelections];

			if (isSelected) {
				updatedSelections.push({
					text: selectedText,
					selectedTime: currentTime,
					deselectedTime: null,
				});
			} else {
				const lastSelection = updatedSelections[updatedSelections.length - 1];
				if (lastSelection && lastSelection.text === selectedText && !lastSelection.deselectedTime) {
					lastSelection.deselectedTime = currentTime;
				}
			}

			return {
				...prev,
				textSelections: updatedSelections,
			};
		});
	};

	const recordVisibilityChange = (isVisible) => {
		setAnalytics((prev) => ({
			...prev,
			visibilityChanges: [
				...prev.visibilityChanges,
				{ time: new Date().toISOString(), isVisible },
			],
		}));
	};

	const clearAnalytics = () => {
		setAnalytics({
			startTime: null,
			endTime: null,
			answerTimes: {},
			textSelections: [],
			visibilityChanges: [], // Ensure this is reset when clearing analytics
		});
	};

	return (
		<AnalyticsContext.Provider
			value={{
				analytics,
				startQuiz,
				endQuiz,
				recordAnswer,
				recordTextSelection,
				recordVisibilityChange, // Add this new function
				clearAnalytics,
			}}
		>
			{children}
		</AnalyticsContext.Provider>
	);
};
