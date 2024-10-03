import React from "react";

const Question = ({ question, selectedAnswer, onSelect, submitted }) => {
	return (
		<div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
			<h2 className="text-xl font-medium mb-3">
				{question.id}. {question.question}
			</h2>
			<div className="flex flex-col gap-4">
				{question.options.map((option, index) => (
					<label key={index} className="flex items-center space-x-2">
						<input
							type="radio"
							name={`question-${question.id}`}
							value={option}
							checked={selectedAnswer === option}
							onChange={() => onSelect(question.id, option)}
							disabled={submitted}
							className="form-radio h-5 w-5 text-blue-600"
						/>
						<span className="text-gray-700">{option}</span>
					</label>
				))}
			</div>
			{submitted && (
				<p className={`mt-2 font-semibold ${selectedAnswer === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
					{selectedAnswer === question.correctAnswer ? 'Correct!' : `Incorrect. The correct answer is: ${question.correctAnswer}`}
				</p>
			)}
		</div>
	);
}

export default Question;