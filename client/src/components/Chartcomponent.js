// ChartComponent.js
import React, { useRef, useEffect } from 'react';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components, including LineController
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = ({ data }) => {
    const chartRef = useRef(null);
    let chartInstance = useRef(null); // Use ref to track the chart instance

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // Destroy the old chart instance before creating a new one
        }

        // Create the chart
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: data.map(item => item.timestamp),
                datasets: [
                    {
                        label: 'Clicks',
                        data: data.map(item => item.clicks),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Timestamp',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Clicks',
                        },
                        beginAtZero: true,
                    },
                },
            },
        });

        // Cleanup function to destroy the chart instance on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
