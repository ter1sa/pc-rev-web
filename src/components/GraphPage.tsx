import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ChosenCandidatesTable from './ChosenCandidatesTable';
import NetworkGraph from './NetworkGraph';
import ExpertiseDistributionChart from './ExpertiseDistributionChart';
import OtherDistributionCharts from './OtherDistributionCharts';
import axios from 'axios';

interface CandidateConnection {
    name: string;
    connectionsWithinSubset: number;
}

const GraphPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [finalCandidateConnections, setFinalCandidateConnections] = useState<CandidateConnection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidateNetwork = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/candidate-network');

                const calculatedConnections = response.data.nodes.map((node: { id: string }) => {
                    const connections = response.data.links.filter((link: { source: string, target: string }) =>
                        link.source === node.id || link.target === node.id
                    ).length;

                    return {
                        name: node.id,
                        connectionsWithinSubset: Math.ceil(connections / 2)
                    };
                });

                setFinalCandidateConnections(calculatedConnections);
                setLoading(false);
            } catch (err) {
                setError('Error fetching network data');
                setLoading(false);
            }
        };

        fetchCandidateNetwork();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ pt: 10, pl: 5, pr: 5 }}>
            <Tabs value={selectedTab} onChange={handleChange} centered>
                <Tab label="Chosen Candidates" />
                <Tab label="Network Graph" />
                <Tab label="Distribution of Candidates' Expertise" />
                <Tab label="Other Distribution Graphs" />
            </Tabs>

            <Box mt={3}>
                {selectedTab === 0 && (
                    <ChosenCandidatesTable chosenCandidates={finalCandidateConnections} />  // Tab 1: Table of chosen candidates
                )}
                {selectedTab === 1 && (
                    <NetworkGraph />  // Tab 2: Least-connected subgraph
                )}
                {selectedTab === 2 && (
                    <ExpertiseDistributionChart chosenCandidates={finalCandidateConnections} />  // Tab 3: Expertise distribution chart
                )}
                {selectedTab === 3 && (
                    <OtherDistributionCharts chosenCandidates={finalCandidateConnections} />  // Tab 4: Other distribution charts
                )}
            </Box>
        </Box>
    );
};

export default GraphPage;
