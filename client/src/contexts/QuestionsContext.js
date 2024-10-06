import React, { createContext, useContext, useState } from "react";

const QuestionsContext = createContext();

export const useQuestions = () => useContext(QuestionsContext);

export const QuestionsProvider = ({ children }) => {
	const [questions] = useState([
		{
			id: 1,
			question:
				"Which of the following is NOT a function of the endoplasmic reticulum?",
			options: [
				"Protein synthesis",
				"Lipid synthesis",
				"Calcium storage",
				"ATP production",
			],
			correctAnswer: "ATP production",
		},
		{
			id: 2,
			question:
				"What is the term for the process by which RNA is synthesized from DNA?",
			options: [
				"Translation",
				"Transcription",
				"Replication",
				"Transduction",
			],
			correctAnswer: "Transcription",
		},
		{
			id: 3,
			question:
				"Which of the following is a unique characteristic of archaebacteria?",
			options: [
				"Presence of peptidoglycan in cell walls",
				"Lipids with ester bonds in cell membranes",
				"Introns in genes",
				"Methane production in anaerobic conditions",
			],
			correctAnswer: "Methane production in anaerobic conditions",
		},
		{
			id: 4,
			question: "What is the role of telomerase in cellular aging?",
			options: [
				"It shortens telomeres",
				"It prevents telomere elongation",
				"It maintains telomere length",
				"It has no effect on telomeres",
			],
			correctAnswer: "It maintains telomere length",
		},
		{
			id: 5,
			question:
				"Which of the following is NOT a component of the electron transport chain?",
			options: [
				"NADH dehydrogenase",
				"Cytochrome c oxidase",
				"ATP synthase",
				"Pyruvate dehydrogenase",
			],
			correctAnswer: "Pyruvate dehydrogenase",
		},
	]);

	return (
		<QuestionsContext.Provider value={{ questions }}>
			{children}
		</QuestionsContext.Provider>
	);
};
