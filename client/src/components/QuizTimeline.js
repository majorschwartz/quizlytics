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
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	annotationPlugin
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

		const selectionLines = [];
		if (analytics.textSelections) {
			analytics.textSelections.forEach((selection, index) => {
				if (selection && selection.selectedTime && selection.deselectedTime) {
					selectionLines.push({
						type: 'line',
						xMin: new Date(selection.selectedTime),
						xMax: new Date(selection.deselectedTime),
						yMin: 2,
						yMax: 2,
						borderColor: 'rgba(255, 99, 132, 0.5)',
						borderWidth: 2,
					});
					data.push({
						x: new Date(selection.selectedTime),
						y: 2,
						label: `Selection ${index + 1}`,
					});
					data.push({
						x: new Date(selection.deselectedTime),
						y: 2,
						label: `Deselection ${index + 1}`,
					});
				}
			});
		}

		const visibilityLines = [];
		if (analytics.visibilityChanges) {
			analytics.visibilityChanges.forEach((change, index) => {
				if (change.hiddenTime && change.visibleTime) {
					visibilityLines.push({
						type: 'line',
						xMin: new Date(change.hiddenTime),
						xMax: new Date(change.visibleTime),
						yMin: 3,
						yMax: 3,
						borderColor: 'rgba(153, 102, 255, 0.5)',
						borderWidth: 2,
					});
				}
			});
		}

		if (analytics.visibilityChanges) {
			analytics.visibilityChanges.forEach((change) => {
				if (change.hiddenTime) {
					data.push({
						x: new Date(change.hiddenTime),
						y: 3,
						label: "Hidden",
					});
				}
				if (change.visibleTime) {
					data.push({
						x: new Date(change.visibleTime),
						y: 3,
						label: "Visible",
					});
				}
			});
		}

		return { data: data.sort((a, b) => a.x - b.x), selectionLines, visibilityLines };
	};

	const { data: chartData, selectionLines, visibilityLines } = prepareChartData();

	const chartOptions = {
		responsive: true,
		plugins: {
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
			annotation: {
				annotations: [...selectionLines, ...visibilityLines],
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
				max: 3,
				ticks: {
					stepSize: 1,
					callback: function (value) {
						return ["Quiz", "Answers", "Selections", "Visibility"][value];
					},
				},
			},
		},
		clip: false,
		animation: {
			duration: 0
		},
	};

	const getTimeConfig = (startTime, endTime) => {
		const duration = (new Date(endTime) - new Date(startTime)) / 1000;
		const interval = Math.ceil(duration / 11);

		return {
			unit: 'second',
			stepSize: interval,
			displayFormats: {
				second: (value) => {
					const date = new Date(value);
					return date.toTimeString().split(' ')[0];
				},
			},
		};
	};

	return (
		<>
			<h2 className="text-xl font-semibold mb-4">Text Selections</h2>
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
											"rgba(153, 102, 255, 0.6)",
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
											"rgba(153, 102, 255, 1)",
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
					plugins={[ChartDataLabels, annotationPlugin]}
				/>
			) : (
				<p>No data available for chart</p>
			)}
		</>
	);
};

export default QuizTimeline;
