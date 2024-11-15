import React from 'react';
import { useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import { Box, Paper } from '@mui/material';

interface CandidateConnection {
    name: string;
    connectionsWithinSubset: number;
}

interface ChosenCandidatesTableProps {
    chosenCandidates: CandidateConnection[];
}

const ChosenCandidatesTable: React.FC<ChosenCandidatesTableProps> = ({ chosenCandidates }) => {
    const columns = [
        { accessorKey: 'name', header: 'Name', minSize: 400, size: 1 },
        { accessorKey: 'connectionsWithinSubset', header: 'Connections with other candidates', minSize: 400, size: 1 },
    ];

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Paper sx={{ maxWidth: 1600, width: '100%' }}>
                <MaterialReactTable
                    columns={columns}
                    data={chosenCandidates}
                    enableStickyHeader
                    enableColumnResizing
                    initialState={
                        {
                            columnVisibility: { ID: false },
                            density: 'compact',
                            pagination: { pageSize: 100, pageIndex: 0 }
                        }
                    }
                    muiTableContainerProps={{ sx: { maxHeight: 'calc(100vh - 300px)' } }}
                    muiTablePaperProps={{
                        sx: {
                            m: 'auto',
                            maxWidth: 'calc(100vw - 150px)',
                        },
                    }}
                />
            </Paper>
        </Box>
    );
};

export default ChosenCandidatesTable;
