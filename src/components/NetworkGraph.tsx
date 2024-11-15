import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, Typography } from '@mui/material';

interface CandidateConnection {
    name: string;
    connectionsWithinSubset: number;
}

const NetworkGraph = () => {
    const [leastConnectedSubgraph, setLeastConnectedSubgraph] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidateNetwork = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/candidate-network');

                setLeastConnectedSubgraph({ nodes: response.data.nodes, links: response.data.links });
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

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Typography variant="h4" gutterBottom>
                Candidate Network Graph
            </Typography>
            <Box sx={{ border: '2px solid black', padding: '10px', marginBottom: '30px' }}>
                <ForceGraph2D
                    graphData={leastConnectedSubgraph}
                    nodeLabel={(node: any) => node.id} // Tooltip displays the candidate's name on hover
                    nodeAutoColorBy="id"
                    width={800}
                    height={600}
                />
            </Box>
        </Box>
    );
};

export default NetworkGraph;
