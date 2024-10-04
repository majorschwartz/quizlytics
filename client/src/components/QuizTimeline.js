import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale
);

const QuizTimeline = ({ analytics }) => {
	console.log("Analytics in QuizTimeline", analytics);
	
	const prepareChartData = () => {
		if (!analytics.startTime || !analytics.endTime) return null;

		const startTime = new Date(analytics.startTime);
		const endTime = new Date(analytics.endTime);

		const data = [
			{ x: startTime, y: 0, label: "Start" },
			{ x: endTime, y: 0, label: "End" },
		];

		if (analytics.answerTimes) {
			Object.entries(analytics.answerTimes).forEach(([questionNumber, answers]) => {
				answers.forEach((answer) => {
					data.push({
						x: new Date(answer.time),
						y: 1,
						label: `Q${questionNumber}`,
					});
				});
			});
		}

		if (analytics.textSelections) {
			analytics.textSelections.forEach((selection, index) => {
				if (selection && selection.selectedTime) {
					data.push({
						x: new Date(selection.selectedTime),
						y: 2,
						label: `Selection ${index + 1}`,
					});
				}
				if (selection && selection.deselectedTime) {
					data.push({
						x: new Date(selection.deselectedTime),
						y: 2,
						label: `Deselection ${index + 1}`,
					});
				}
			});
		}

		return data.sort((a, b) => a.x - b.x);
	};

	const chartData = prepareChartData();

	const chartOptions = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Quiz Timeline",
				font: {
					size: 18,
					weight: "bold",
				},
				padding: {
					top: 10,
					bottom: 30,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						if (context.raw.y === 0) {
							return `Quiz ${context.raw.label}`;
						} else if (context.raw.y === 1) {
							return `Question ${context.raw.label.replace('Q', '')}`;
						} else if (context.raw.y === 2) {
							return `${context.raw.label}`;
						} else {
							return context.raw.label;
						}
					},
				},
			},
			legend: {
				display: false,
			},
			datalabels: {
				display: function (context) {
					return context.dataset.data[context.dataIndex].y === 1; // Only show labels for answer dots
				},
				align: "top",
				anchor: "center",
				offset: 8,
				color: "#333",
				font: {
					weight: "bold",
				},
				formatter: function (value, context) {
					return context.dataset.data[context.dataIndex].label;
				},
			},
		},
		scales: {
			x: {
				type: "time",
				time: {
					unit: "second",
					stepSize: 5,
					displayFormats: {
						second: "HH:mm:ss",
					},
				},
				title: {
					display: true,
					text: "Time",
				},
				ticks: {
					maxRotation: 0,
					autoSkip: true,
					autoSkipPadding: 15,
				},
			},
			y: {
				beginAtZero: true,
				max: 2,
				ticks: {
					stepSize: 1,
					callback: function (value) {
						return ["Quiz", "Answers", "Selections"][value];
					},
				},
			},
		},
		clip: false,
	};

	// Update the getTimeConfig function
	const getTimeConfig = (startTime, endTime) => {
		const duration = (new Date(endTime) - new Date(startTime)) / 1000; // duration in seconds
		const interval = Math.ceil(duration / 11); // Calculate interval to get 12 ticks

		return {
			unit: 'second',
			stepSize: interval,
			displayFormats: {
				second: (value) => {
					const date = new Date(value);
					return date.toTimeString().split(' ')[0]; // Format as HH:MM:SS
				},
			},
		};
	};

	return (
		<>
			{chartData && chartData.length > 0 ? (
				<Line
					data={{
						datasets: [
							{
								label: "Quiz Events",
								data: chartData,
								backgroundColor: (context) => {
									const value = context.raw?.y;
									return (
										[
											"rgba(75, 192, 192, 0.6)",
											"rgba(255, 159, 64, 0.6)",
											"rgba(255, 99, 132, 0.6)",
										][value] || "rgba(200, 200, 200, 0.6)"
									);
								},
								borderColor: (context) => {
									const value = context.raw?.y;
									return (
										[
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
										][value] || "rgba(200, 200, 200, 1)"
									);
								},
								pointRadius: 8,
								pointHoverRadius: 10,
								showLine: false,
							},
						],
					}}
					options={{
						...chartOptions,
						scales: {
							...chartOptions.scales,
							x: {
								...chartOptions.scales.x,
								...getTimeConfig(
									analytics.startTime,
									analytics.endTime
								),
								ticks: {
									maxRotation: 0,
									autoSkip: false,
									count: 12,
								},
							},
						},
					}}
					plugins={[ChartDataLabels]}
				/>
			) : (
				<p>No data available for chart</p>
			)}
		</>
	);
};

export default QuizTimeline;
