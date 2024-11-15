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


interface OtherDistributionChartsProps {
    chosenCandidates: CandidateConnection[];
}

const OtherDistributionCharts: React.FC<OtherDistributionChartsProps> = ({ chosenCandidates }) => {
    const [countryData, setCountryData] = useState<{ [key: string]: number }>({});
    const [countryOfOriginData, setCountryOfOriginData] = useState<{ [key: string]: number }>({});
    const [genderData, setGenderData] = useState<{ [key: string]: number }>({});
    const [levelData, setLevelData] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDistributionData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/candidates');

                const chosenCandidateNames = chosenCandidates.map(candidate => candidate.name);

                const countryCounts: { [key: string]: number } = {};
                const countryOfOriginCounts: { [key: string]: number } = {};
                const genderCounts: { [key: string]: number } = {};
                const levelCounts: { [key: string]: number } = {};

                response.data
                    .filter((candidate: { NAME: string }) => chosenCandidateNames.includes(candidate.NAME))
                    .forEach((candidate: { COUNTRY: string, COUNTRYOFORIGIN: string, GENDER: string, LEVEL: string }) => {
                        // Count countries
                        const country = candidate.COUNTRY;
                        if (country) {
                            countryCounts[country] = (countryCounts[country] || 0) + 1;
                        }

                        // Count countries of origin
                        const countryOfOrigin = candidate.COUNTRYOFORIGIN;
                        if (countryOfOrigin) {
                            countryOfOriginCounts[countryOfOrigin] = (countryOfOriginCounts[countryOfOrigin] || 0) + 1;
                        }

                        // Count genders
                        const gender = candidate.GENDER;
                        if (gender) {
                            genderCounts[gender] = (genderCounts[gender] || 0) + 1;
                        }

                        // Count levels
                        const level = candidate.LEVEL;
                        if (level) {
                            levelCounts[level] = (levelCounts[level] || 0) + 1;
                        }
                    });

                setCountryData(countryCounts);
                setCountryOfOriginData(countryOfOriginCounts);
                setGenderData(genderCounts);
                setLevelData(levelCounts);
                setLoading(false);
            } catch (err) {
                setError('Error fetching distribution data');
                setLoading(false);
            }
        };

        fetchDistributionData();
    }, [chosenCandidates]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Function to generate chart data for a given dataset
    const generateChartData = (data: { [key: string]: number }, label: string) => ({
        labels: Object.keys(data),
        datasets: [
            {
                label,
                data: Object.values(data),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true },
        },
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Typography variant="h4" gutterBottom>
                Other Distributions
            </Typography>

            <Box sx={{ width: '80%', maxWidth: 800, mb: 4 }}>
                <Typography variant="h6">Country Distribution</Typography>
                <Bar data={generateChartData(countryData, 'Country Distribution')} options={{ ...chartOptions, plugins: { title: { text: 'Country Distribution' } } }} />
            </Box>

            <Box sx={{ width: '80%', maxWidth: 800, mb: 4 }}>
                <Typography variant="h6">Country of Origin Distribution</Typography>
                <Bar data={generateChartData(countryOfOriginData, 'Country of Origin Distribution')} options={{ ...chartOptions, plugins: { title: { text: 'Country of Origin Distribution' } } }} />
            </Box>

            <Box sx={{ width: '80%', maxWidth: 800, mb: 4 }}>
                <Typography variant="h6">Gender Distribution</Typography>
                <Bar data={generateChartData(genderData, 'Gender Distribution')} options={{ ...chartOptions, plugins: { title: { text: 'Gender Distribution' } } }} />
            </Box>

            <Box sx={{ width: '80%', maxWidth: 800, mb: 4 }}>
                <Typography variant="h6">Level Distribution</Typography>
                <Bar data={generateChartData(levelData, 'Level Distribution')} options={{ ...chartOptions, plugins: { title: { text: 'Level Distribution' } } }} />
            </Box>
        </Box>
    );
};

export default OtherDistributionCharts;
