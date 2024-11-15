// NOT USED
import React, { useMemo, useState, useEffect } from 'react';
import {
    MRT_TableOptions,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import { Candidate } from '../types';
import { Button, Box, Typography } from '@mui/material';

const CandidatesTable: React.FC = () => {
    const [data, setData] = useState<Candidate[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rowSelection, setRowSelection] = useState({});

    const columns = useMemo(
        () => [
            { accessorKey: 'NAME', header: 'Name' },
            { accessorKey: 'EMAIL', header: 'Email' },
            { accessorKey: 'INSTITUTE', header: 'Institute' },
            { accessorKey: 'COUNTRY', header: 'Country' },
            { accessorKey: 'COUNTRYOFORIGIN', header: 'Country of Origin' },
            { accessorKey: 'GENDER', header: 'Gender' },
            { accessorKey: 'LEVEL', header: 'Level' },
            { accessorKey: 'EXPERTISE', header: 'Expertise' },
            { accessorKey: 'DBLP', header: 'DBLP' },
            { accessorKey: 'ITERATION', header: 'Iteration' },
            { accessorKey: 'DECISION', header: 'Decision' },
        ],
        [],
    );

    const handleSaveRow: MRT_TableOptions<Candidate>['onEditingRowSave'] = ({
        exitEditingMode,
        row,
        values
    }) => {
        data[row.index] = values;
        setData([...data]);
        exitEditingMode();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        // enableRowSelection: true,
        enableStickyHeader: true,
        defaultColumn: { maxSize: 300, minSize: 50 },
        enableColumnResizing: true,
        muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 300px)' } },
        muiTablePaperProps: {
            sx: {
                m: 'auto',
                maxWidth: 'calc(100vw - 150px)'
            }
        },
        enableEditing: true,
        onEditingRowSave: handleSaveRow,
        renderTopToolbarCustomActions: () =>
            <>
                <Button onClick={() => table.setCreatingRow(true)}>Add New Candidate</Button>
                <Button onClick={handleRunIteration}>Run Iteration</Button>
            </>,
        // onRowSelectionChange: setRowSelection,
        // state: { rowSelection },
    });

    useEffect(() => {
        axios.get('http://localhost:5001/api/candidates')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching data');
                setLoading(false);
            });
    }, []);

    const handleRunIteration = () => {
        // Add logic for running iteration
        console.log('Run Iteration clicked');
    };

    const handleDialogSubmit = (candidateData: {
        name: string;
        email: string;
        institute: string;
        country: string;
        countryOfOrigin: string;
        gender: string;
        level: string;
        expertise: string;
        dblp: string;
        iteration: string;
        decision: string;
    }) => {
        axios.post('http://localhost:5001/api/candidates', candidateData)
            .then(() => {
                setOpenDialog(false);
                axios.get('http://localhost:5001/api/candidates')
                    .then(response => setData(response.data))
                    .catch(err => setError('Error fetching data'));
            })
            .catch(err => console.error('Error adding candidate:', err));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box sx={{ pt: 10, pl: 5, pr: 5 }}>
            <Typography variant="h4" gutterBottom>
                Candidates
            </Typography>
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default CandidatesTable;