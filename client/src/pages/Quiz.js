import React, { useState, useEffect, useRef } from "react";
import Question from "../components/Question";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";

const QuizContent = () => {
	const navigate = useNavigate();
	const [answers, setAnswers] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const { startQuiz, endQuiz, questions, recordAnswer, recordTextSelection, recordVisibilityChange } = useAnalytics();

	const lastSelectionRef = useRef(null);

	useEffect(() => {
		const handleMouseUp = () => {
			const selection = window.getSelection();
			const selectedText = selection.toString();

			if (selectedText && selectedText !== lastSelectionRef.current) {
				if (lastSelectionRef.current) {
					recordTextSelection(lastSelectionRef.current, false);
				}
				recordTextSelection(selectedText, true);
				lastSelectionRef.current = selectedText;
			} else if (!selectedText && lastSelectionRef.current) {
				recordTextSelection(lastSelectionRef.current, false);
				lastSelectionRef.current = null;
			}
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [recordTextSelection]);

	const handleAnswer = (questionId, answer) => {
		setAnswers(prev => ({ ...prev, [questionId]: answer }));
		recordAnswer(questionId, answer);
	};

	const handleSubmit = () => {
		console.log("Answers to be sent to backend:", answers);
		setSubmitted(true);
		endQuiz();
		navigate("/analytics");
	};

	useEffect(() => {
		startQuiz();

		const handleVisibilityChange = () => {
			recordVisibilityChange(!document.hidden);
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	// eslint-disable-next-line
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Biology Quiz</h1>
			{questions.map((q) => (
				<Question
					key={q.id}
					question={q}
					selectedAnswer={answers[q.id]}
					onSelect={handleAnswer}
					submitted={submitted}
				/>
			))}
			<button
				onClick={handleSubmit}
				disabled={Object.keys(answers).length !== questions.length || submitted}
				className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
			>
				Submit Answers
			</button>
			{submitted && (
				<>
					<p className="mt-4 text-green-600 font-semibold">
						Your answers have been submitted!
					</p>
					<button
						onClick={() => navigate("/analytics")}
						className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					>
						View Analytics
					</button>
				</>
			)}
		</div>
	);
};

const Quiz = () => (
	<QuizContent />
);

export default Quiz;