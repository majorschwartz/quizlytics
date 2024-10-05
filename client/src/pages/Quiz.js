import React, { useState, useEffect, useRef } from "react";
import Question from "../components/Question";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";

const QuizContent = () => {
	const navigate = useNavigate();
	const [answers, setAnswers] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const { startQuiz, endQuiz, recordAnswer, recordTextSelection, recordVisibilityChange } = useAnalytics();

	const questions = [
		{
			id: 1,
			question: "Which of the following is NOT a function of the endoplasmic reticulum?",
			options: [
				"Protein synthesis",
				"Lipid synthesis",
				"Calcium storage",
				"ATP production"
			],
			correctAnswer: "ATP production"
		},
		{
			id: 2,
			question: "What is the term for the process by which RNA is synthesized from DNA?",
			options: [
				"Translation",
				"Transcription",
				"Replication",
				"Transduction"
			],
			correctAnswer: "Transcription"
		},
		{
			id: 3,
			question: "Which of the following is a unique characteristic of archaebacteria?",
			options: [
				"Presence of peptidoglycan in cell walls",
				"Lipids with ester bonds in cell membranes",
				"Introns in genes",
				"Methane production in anaerobic conditions"
			],
			correctAnswer: "Methane production in anaerobic conditions"
		},
		{
			id: 4,
			question: "What is the role of telomerase in cellular aging?",
			options: [
				"It shortens telomeres",
				"It prevents telomere elongation",
				"It maintains telomere length",
				"It has no effect on telomeres"
			],
			correctAnswer: "It maintains telomere length"
		},
		{
			id: 5,
			question: "Which of the following is NOT a component of the electron transport chain?",
			options: [
				"NADH dehydrogenase",
				"Cytochrome c oxidase",
				"ATP synthase",
				"Pyruvate dehydrogenase"
			],
			correctAnswer: "Pyruvate dehydrogenase"
		}
	];

	const lastSelectionRef = useRef(null);

	useEffect(() => {
		const handleMouseUp = () => {
			const selection = window.getSelection();
			const selectedText = selection.toString();

			if (selectedText && selectedText !== lastSelectionRef.current) {
				// New selection
				if (lastSelectionRef.current) {
					// Deselect previous selection if exists
					recordTextSelection(lastSelectionRef.current, false);
				}
				recordTextSelection(selectedText, true);
				lastSelectionRef.current = selectedText;
			} else if (!selectedText && lastSelectionRef.current) {
				// Text was deselected
				recordTextSelection(lastSelectionRef.current, false);
				lastSelectionRef.current = null;
			}
			// If selectedText === lastSelectionRef.current, do nothing (no change in selection)
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