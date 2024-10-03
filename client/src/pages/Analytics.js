import React from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const Analytics = () => {
	const navigate = useNavigate();
	const { analytics, clearAnalytics } = useAnalytics();

	const formatDate = (dateString) => {
		return dateString ? new Date(dateString).toLocaleString() : 'N/A';
	};

	const handleClearAnalytics = () => {
		if (window.confirm("Are you sure you want to clear all analytics data?")) {
			clearAnalytics();
		}
	};

	const prepareChartData = () => {
		if (!analytics.startTime || !analytics.endTime) return null;

		const startTime = new Date(analytics.startTime);
		const endTime = new Date(analytics.endTime);

		const data = [
			{ x: startTime, y: 0, label: 'Start' },
			{ x: endTime, y: 0, label: 'End' },
		];

		if (analytics.answerTimes) {
			Object.entries(analytics.answerTimes).forEach(([questionId, { time }]) => {
				if (time) {
					data.push({ x: new Date(time), y: 1, label: `Q${questionId}` });
				}
			});
		}

		if (analytics.textSelections) {
			analytics.textSelections.forEach((selection, index) => {
				if (selection && selection.time) {
					data.push({ x: new Date(selection.time), y: 2, label: `Selection ${index + 1}` });
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
				text: 'Quiz Timeline',
				font: {
					size: 18,
					weight: 'bold'
				},
				padding: {
					top: 10,
					bottom: 30
				}
			},
			tooltip: {
				callbacks: {
					label: function(context) {
						return `${context.raw.label}: ${new Date(context.raw.x).toLocaleTimeString()}`;
					}
				}
			},
			legend: {
				display: false
			},
			datalabels: {
				display: function(context) {
					return context.dataset.data[context.dataIndex].y === 1; // Only show labels for answer dots
				},
				align: 'top',
				anchor: 'center',
				offset: 8,
				color: '#333',
				font: {
					weight: 'bold'
				},
				formatter: function(value, context) {
					return context.dataset.data[context.dataIndex].label;
				}
			}
		},
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'second',
					stepSize: 5,
					displayFormats: {
							second: 'HH:mm:ss'
					}
				},
				title: {
					display: true,
					text: 'Time'
				},
				ticks: {
					maxRotation: 0,
					autoSkip: true,
					autoSkipPadding: 15,
				}
			},
			y: {
				beginAtZero: true,
				max: 2,
				ticks: {
					stepSize: 1,
					callback: function(value) {
						return ['Quiz', 'Answers', 'Selections', ''][Math.ceil(value)];
					}
				}
			}
		},
		clip: false
	};

	// Add this function to determine the appropriate time unit and step size
	const getTimeConfig = (startTime, endTime) => {
		const duration = (new Date(endTime) - new Date(startTime)) / 1000; // duration in seconds
		if (duration > 60) {
			return {
				unit: 'minute',
				stepSize: 1,
				displayFormats: {
					minute: 'HH:mm'
				}
			};
		} else {
			return {
				unit: 'second',
				stepSize: 5,
				displayFormats: {
					second: 'HH:mm:ss'
				}
			};
		}
	};

	// Update the component's return statement
	return (
		<div className="container mx-auto px-4 py-8">
			<button
				onClick={() => navigate("/")}
				className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Back to Home
			</button>
			<h1 className="text-3xl font-bold mb-6">Quiz Analytics</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<h2 className="text-xl font-semibold mb-4">Quiz Timeline</h2>
				{chartData && chartData.length > 0 ? (
					<Line
						data={{
							datasets: [{
								label: 'Quiz Events',
								data: chartData,
								backgroundColor: (context) => {
									const value = context.raw?.y;
									return ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'][value] || 'rgba(200, 200, 200, 0.6)';
								},
								borderColor: (context) => {
									const value = context.raw?.y;
									return ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'][value] || 'rgba(200, 200, 200, 1)';
								},
								pointRadius: 8,
								pointHoverRadius: 10,
								showLine: false
							}]
						}}
						options={{
							...chartOptions,
							scales: {
								...chartOptions.scales,
								x: {
									...chartOptions.scales.x,
									...getTimeConfig(analytics.startTime, analytics.endTime)
								}
							}
						}}
						plugins={[ChartDataLabels]}
					/>
				) : (
					<p>No data available for chart</p>
				)}

				<h2 className="text-xl font-semibold mt-6 mb-4">Quiz Details</h2>
				<p>Start Time: {formatDate(analytics.startTime)}</p>
				<p>End Time: {formatDate(analytics.endTime)}</p>

				<h3 className="text-lg font-semibold mt-4 mb-2">Answer Times</h3>
				<ul>
					{Object.entries(analytics.answerTimes).map(([questionId, data]) => (
						<li key={questionId}>
							Question {questionId}: {formatDate(data.time)} - Answer: {data.answer}
						</li>
					))}
				</ul>

				<h3 className="text-lg font-semibold mt-4 mb-2">Text Selections</h3>
				<ul>
					{analytics.textSelections.map((selection, index) => (
						<li key={index}>
							"{selection.text}" - {formatDate(selection.time)}
						</li>
					))}
				</ul>

				<button
					onClick={handleClearAnalytics}
					className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
				>
					Clear Analytics
				</button>
			</div>
		</div>
	);
};

export default Analytics;