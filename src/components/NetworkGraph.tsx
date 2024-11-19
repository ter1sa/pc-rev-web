import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

const NetworkGraph = () => {
    const [leastConnectedSubgraph, setLeastConnectedSubgraph] = useState({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [networkStats, setNetworkStats] = useState({
        density: 0,
        clusteringCoefficient: 0,
        averageDegree: 0,
    });

    useEffect(() => {
        const calculateNetworkStats = (nodes: any[], links: any[]) => {
            const numNodes = nodes.length;
            const numLinks = links.length;

            // Density calculation
            const density = numNodes > 1 ? (2 * numLinks) / (numNodes * (numNodes - 1)) : 0;

            // Average degree calculation
            const averageDegree = numNodes > 0 ? (2 * numLinks) / numNodes : 0;

            // Clustering coefficient calculation (simplified as an average)
            const clusteringCoefficients = nodes.map(node => {
                const neighbors = links.filter(link => link.source === node.id || link.target === node.id);
                const numNeighbors = neighbors.length;
                const possibleEdges = (numNeighbors * (numNeighbors - 1)) / 2;
                const actualEdges = neighbors.filter(
                    ({ source, target }: any) =>
                        neighbors.some(
                            (link: any) =>
                                (link.source === source && link.target === target) ||
                                (link.source === target && link.target === source)
                        )
                ).length;
                return possibleEdges > 0 ? (2 * actualEdges) / possibleEdges : 0;
            });
            const clusteringCoefficient =
                clusteringCoefficients.reduce((sum, coeff) => sum + coeff, 0) / nodes.length || 0;

            return { density, clusteringCoefficient, averageDegree };
        };

        const fetchCandidateNetwork = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/candidate-network');
                const { nodes, links } = response.data;

                setLeastConnectedSubgraph({ nodes, links });
                setNetworkStats(calculateNetworkStats(nodes, links));
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
        <Box display="flex" flexDirection="row" justifyContent="center" gap={4}>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Candidate Network Graph
                </Typography>
                <Box sx={{ border: '2px solid black', padding: '10px', marginBottom: '30px' }}>
                    <ForceGraph2D
                        graphData={leastConnectedSubgraph}
                        nodeLabel={(node: any) => node.id} // Tooltip displays the candidate's name on hover
                        nodeAutoColorBy="id"
                        width={600}
                        height={400}
                    />
                </Box>
            </Box>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Network Statistics
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Metric</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Density</TableCell>
                            <TableCell>{networkStats.density.toFixed(4)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Clustering Coefficient</TableCell>
                            <TableCell>{networkStats.clusteringCoefficient.toFixed(4)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Average Degree</TableCell>
                            <TableCell>{networkStats.averageDegree.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default NetworkGraph;
