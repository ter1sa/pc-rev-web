import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface CandidateConnection {
    name: string;
    connectionsWithinSubset: number;
}

interface ExpertiseDistributionChartProps {
    chosenCandidates: CandidateConnection[];
}

const ExpertiseDistributionChart: React.FC<ExpertiseDistributionChartProps> = ({ chosenCandidates }) => {
    const [expertiseData, setExpertiseData] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpertiseData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/candidates');

                const chosenCandidateNames = chosenCandidates.map(candidate => candidate.name);

                const expertiseCounts: { [key: string]: number } = {};
                response.data
                    .filter((candidate: { NAME: string }) => chosenCandidateNames.includes(candidate.NAME))
                    .forEach((candidate: { EXPERTISE: string }) => {
                        // Split expertise by commas and trim whitespace
                        const expertises = candidate.EXPERTISE.split(',').map(expertise => expertise.trim());

                        expertises.forEach(expertise => {
                            if (expertiseCounts[expertise]) {
                                expertiseCounts[expertise] += 1;
                            } else {
                                expertiseCounts[expertise] = 1;
                            }
                        });
                    });

                setExpertiseData(expertiseCounts);
                setLoading(false);
            } catch (err) {
                setError('Error fetching expertise data');
                setLoading(false);
            }
        };

        fetchExpertiseData();
    }, [chosenCandidates]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const data = {
        labels: Object.keys(expertiseData),
        datasets: [
            {
                label: 'Number of Candidates',
                data: Object.values(expertiseData),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Distribution of Candidates\' Expertise',
            },
        },
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Typography variant="h4" gutterBottom>
                Expertise Distribution
            </Typography>
            <Box sx={{ width: '80%', maxWidth: 800 }}>
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
};

export default ExpertiseDistributionChart;
