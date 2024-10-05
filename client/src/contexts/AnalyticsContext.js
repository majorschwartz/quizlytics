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
					visibilityChanges: [],
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
			visibilityChanges: [],
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
		setAnalytics((prev) => {
			const currentTime = new Date().toISOString();
			let updatedVisibilityChanges = [...prev.visibilityChanges];

			if (!isVisible) {
				updatedVisibilityChanges.push({
					hiddenTime: currentTime,
					visibleTime: null,
				});
			} else {
				const lastChange = updatedVisibilityChanges[updatedVisibilityChanges.length - 1];
				if (lastChange && !lastChange.visibleTime) {
					lastChange.visibleTime = currentTime;
				}
			}

			return {
				...prev,
				visibilityChanges: updatedVisibilityChanges,
			};
		});
	};

	const clearAnalytics = () => {
		setAnalytics({
			startTime: null,
			endTime: null,
			answerTimes: {},
			textSelections: [],
			visibilityChanges: [],
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
				recordVisibilityChange,
				clearAnalytics,
			}}
		>
			{children}
		</AnalyticsContext.Provider>
	);
};
