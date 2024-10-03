import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	const handleStartQuiz = () => {
		navigate("/quiz");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
			<div className="max-w-2xl text-center">
				<h1 className="text-4xl font-bold text-gray-800 mb-6">
					Quiz Analytics Tool
				</h1>
				<p className="text-xl text-gray-600 mb-8">
					Start by clicking the button below and taking the quiz.
				</p>
				<button
					onClick={handleStartQuiz}
					className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
				>
					Start Quiz
				</button>
			</div>
		</div>
	);
}

export default Home;