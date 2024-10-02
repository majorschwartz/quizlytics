import React, { useState } from "react";
import Question from "../components/Question";

const Quiz = () => {
	const [answers, setAnswers] = useState({});
	const [submitted, setSubmitted] = useState(false);

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

	const handleAnswer = (questionId, answer) => {
		setAnswers(prev => ({ ...prev, [questionId]: answer }));
	};

	const handleSubmit = () => {
		// Here you would typically send the answers to your backend
		console.log("Answers to be sent to backend:", answers);
		setSubmitted(true);
	};

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
				<p className="mt-4 text-green-600 font-semibold">
						Your answers have been submitted!
				</p>
			)}
		</div>
	);
}

export default Quiz;