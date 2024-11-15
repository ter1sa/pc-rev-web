import { useMemo, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
    MRT_RowSelectionState,
} from 'material-react-table';
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Candidate } from '../types';
import { debounce } from 'lodash';

const CandidatesTable = () => {
    const [pcSize, setPcSize] = useState<number>(70);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});



    const previousRowSelection = useRef<MRT_RowSelectionState>({});

    const { mutateAsync: batchUpdateSelection } = useBatchUpdateSelection();

    useEffect(() => {
        const updateSelection = debounce(() => {
            const updates: { userId: string; isSelected: boolean }[] = [];

            // Detect newly selected rows (isSelected = true)
            Object.keys(rowSelection).forEach((userId) => {
                if (!previousRowSelection.current[userId]) {
                    updates.push({ userId, isSelected: true });
                }
            });

            // Detect deselected rows (isSelected = false)
            Object.keys(previousRowSelection.current).forEach((userId) => {
                if (!rowSelection[userId]) {
                    updates.push({ userId, isSelected: false });
                }
            });

            if (updates.length > 0) {
                batchUpdateSelection(updates);
            }

            // Update the previous selection reference
            previousRowSelection.current = { ...rowSelection };
        }, 300);  // Debounce interval of 300ms

        updateSelection();

        return () => {
            updateSelection.cancel();  // Clean up debounce on unmount
        };
    }, [rowSelection, batchUpdateSelection]);


    const columns = useMemo<MRT_ColumnDef<Candidate>[]>(
        () => [
            {
                accessorKey: 'ID', header: 'ID',
                enableEditing: false,
            },
            {
                accessorKey: 'NAME', header: 'Name',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.NAME,
                    helperText: validationErrors?.NAME,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            NAME: undefined,
                        }),
                },
            },
            {
                accessorKey: 'EMAIL', header: 'Email',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.EMAIL,
                    helperText: validationErrors?.EMAIL,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            EMAIL: undefined,
                        }),
                },
            },
            {
                accessorKey: 'INSTITUTE', header: 'Institute',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.INSTITUTE,
                    helperText: validationErrors?.INSTITUTE,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            INSTITUTE: undefined,
                        }),
                },
            },
            {
                accessorKey: 'COUNTRY', header: 'Country',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.COUNTRY,
                    helperText: validationErrors?.COUNTRY,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            COUNTRY: undefined,
                        }),
                },
            },
            {
                accessorKey: 'COUNTRYOFORIGIN', header: 'Country of Origin',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.COUNTRYOFORIGIN,
                    helperText: validationErrors?.COUNTRYOFORIGIN,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            COUNTRYOFORIGIN: undefined,
                        }),
                },
            },
            {
                accessorKey: 'GENDER', header: 'Gender',
                editSelectOptions: ['male', 'female'],
                // muiEditTextFieldProps: {
                //     required: true,
                //     select: true,
                //     error: !!validationErrors?.GENDER,
                //     helperText: validationErrors?.GENDER,
                //     onFocus: () =>
                //         setValidationErrors({
                //             ...validationErrors,
                //             GENDER: undefined,
                //         }),
                // },
            },
            {
                accessorKey: 'LEVEL', header: 'Level',
                editSelectOptions: ['senior', 'junior'],
                // muiEditTextFieldProps: {
                //     required: true,
                //     select: true,
                //     error: !!validationErrors?.LEVEL,
                //     helperText: validationErrors?.LEVEL,
                //     onFocus: () =>
                //         setValidationErrors({
                //             ...validationErrors,
                //             LEVEL: undefined,
                //         }),
                // },
            },
            {
                accessorKey: 'EXPERTISE', header: 'Expertise',
                // muiEditTextFieldProps: {
                //     required: true,
                //     error: !!validationErrors?.EXPERTISE,
                //     helperText: validationErrors?.EXPERTISE,
                //     onFocus: () =>
                //         setValidationErrors({
                //             ...validationErrors,
                //             EXPERTISE: undefined,
                //         }),
                // },
            },
            {
                accessorKey: 'DBLP', header: 'DBLP',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.DBLP,
                    helperText: validationErrors?.DBLP,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            DBLP: undefined,
                        }),
                },
            },
            // {
            //     accessorKey: 'coauthor_hist', header: 'Co-author History',
            //     enableEditing: false,
            //     Cell: ({ cell }) => <CollapsibleCell value={cell.getValue()} />
            // },
            // {
            //     accessorKey: 'years_of_pub', header: 'Years of Publication',
            //     enableEditing: false,
            //     Cell: ({ cell }) => <CollapsibleCell value={cell.getValue()} />
            // },
            // {
            //     accessorKey: 'coauthors', header: 'Co-authors',
            //     enableEditing: false,
            //     Cell: ({ cell }) => <CollapsibleCell value={cell.getValue()} />
            // },
            {
                accessorKey: 'ITERATION', header: 'Iteration',
                muiEditTextFieldProps: {
                    type: 'number',
                    inputProps: {
                        step: '1',
                        min: '0',
                    },
                },
            },
            {
                accessorKey: 'DECISION', header: 'Decision',
                editSelectOptions: ['Accepted', 'Declined', 'Uninvited'],
                muiEditTextFieldProps: {
                    required: false,
                    select: true,
                },
            },
        ],
        [validationErrors],
    );

    const { mutateAsync: runIteration, isPending: isRunningIteration } = useRunIteration();
    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } =
        useCreateUser();
    //call READ hook
    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers();
    //call UPDATE hook
    const { mutateAsync: updateUser, isPending: isUpdatingUser } =
        useUpdateUser();
    //call DELETE hook
    const { mutateAsync: deleteUser, isPending: isDeletingUser } =
        useDeleteUser();

    useEffect(() => {
        const initialSelection: MRT_RowSelectionState = {};
        fetchedUsers.forEach((user) => {
            if (user.isSelected) initialSelection[user.ID] = true;
        });
        setRowSelection(initialSelection);
    }, [fetchedUsers]);

    //CREATE action
    const handleCreateUser: MRT_TableOptions<Candidate>['onCreatingRowSave'] = async ({
        values,
        table,
    }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createUser(values);
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveUser: MRT_TableOptions<Candidate>['onEditingRowSave'] = async ({
        values,
        table,
    }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateUser(values);
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row: MRT_Row<Candidate>) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(row.original.ID);
        }
    };


    const handleRunIteration = async () => {
        console.log('Run Iteration with PC Size:', pcSize);
        try {
            const selectedCandidates = await runIteration(pcSize);  // Get selected candidates from runIteration
            console.log('Selected Candidates:', selectedCandidates);

            // Update rowSelection to select rows of the returned candidates
            const newSelection: MRT_RowSelectionState = {};
            selectedCandidates.forEach((id: string) => {
                newSelection[id] = true;  // Set each selected candidate's ID to true
            });

            setRowSelection(newSelection);  // Update row selection
            console.log('Iteration completed');
        } catch (error) {
            console.error("Error running iteration:", error);
        }
    };



    const table = useMaterialReactTable({
        columns,
        data: fetchedUsers,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        enableStickyHeader: true,
        initialState: {
            columnVisibility: { ID: false },
            density: 'compact',
            pagination: { pageSize: 100, pageIndex: 0 }
        },
        enableColumnResizing: true,
        muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 350px)' } },
        muiTablePaperProps: {
            sx: {
                m: 'auto',
                maxWidth: 'calc(100vw - 150px)'
            }
        },
        muiPaginationProps: {
            rowsPerPageOptions: [10, 50, 100, 250]
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        enableRowPinning: true,
        rowPinningDisplayMode: 'select-sticky',
        getRowId: (row) => row.ID,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateUser,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveUser,

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Create New User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),

        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box>
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box display="flex" alignItems="center" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(true);
                    }}
                    sx={{ mr: 3 }}
                >
                    Create New User
                </Button>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1">
                        PC Size:
                    </Typography>
                    <TextField
                        variant="outlined"
                        type="number"
                        value={pcSize}
                        onChange={(e) => setPcSize(Number(e.target.value))}
                        sx={{ width: 100 }}
                    />
                    <Button variant="contained" color="secondary" onClick={handleRunIteration}>Run Iteration</Button>
                </Box>
            </Box>
        ),
        state: {
            rowSelection,
            isLoading: isLoadingUsers,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return <Box sx={{ pt: 10, pl: 5, pr: 5 }}>
        <Typography variant="h4" gutterBottom>
            PC Candidates
        </Typography>
        <MaterialReactTable table={table} />
    </Box>;
};

// Hook to handle the "Run Iteration" functionality with optimistic updates
function useRunIteration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pcSize: number) => {
            const response = await axios.post('http://localhost:5001/api/run_iteration', { pcSize });
            return response.data.selectedCandidates; // Return the selected candidates
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<Candidate[]>(['users']);

            queryClient.setQueryData(['users'], (oldUsers: Candidate[] | undefined) => {
                if (!oldUsers) return previousUsers;

                // Increment the ITERATION field for all users with no decision
                return oldUsers.map((user) =>
                    user.DECISION === null || user.DECISION === ''
                        ? { ...user, ITERATION: (user.ITERATION ?? 0) + 1 }
                        : user,
                );
            });

            return { previousUsers };
        },
        onError: (err, newUser, context) => {
            queryClient.setQueryData(['users'], context?.previousUsers);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

//CREATE hook (post new user to api)
function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: Candidate) => {
            axios.post('http://localhost:5001/api/candidates', { ...user });
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo: Candidate) => {
            queryClient.setQueryData(
                ['users'],
                (prevUsers: any) =>
                    [
                        ...prevUsers,
                        {
                            ...newUserInfo
                        },
                    ] as Candidate[],
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
}

//READ hook (get users from api)
function useGetUsers() {
    return useQuery<Candidate[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5001/api/candidates');
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: Candidate) => {
            // Create a new object without coauthor_hist, years_of_pub, and coauthors
            const { coauthor_hist, years_of_pub, coauthors, ...userDataToUpdate } = user;
            console.log(user);
            await axios.put(`http://localhost:5001/api/candidates/${user.ID}`, userDataToUpdate);
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo: Candidate) => {
            queryClient.setQueryData(['users'], (prevUsers: any) =>
                prevUsers?.map((prevUser: Candidate) =>
                    prevUser.ID === newUserInfo.ID ? newUserInfo : prevUser,
                ),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            await axios.delete(`http://localhost:5001/api/candidates/${userId}`);
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (userId: string) => {
            queryClient.setQueryData(['users'], (prevUsers: any) =>
                prevUsers?.filter((user: Candidate) => user.ID !== userId),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

function useBatchUpdateSelection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (selections: { userId: string; isSelected: boolean }[]) => {
            await axios.put('http://localhost:5001/api/candidates/batch-selection', selections);
        },
        onMutate: (selections) => {
            queryClient.setQueryData(['users'], (prevUsers: Candidate[]) =>
                prevUsers.map((user) => {
                    const selection = selections.find((s) => s.userId === user.ID);
                    return selection ? { ...user, isSelected: selection.isSelected } : user;
                })
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}



const queryClient = new QueryClient();

const CandidatesPage = () => (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <CandidatesTable />
    </QueryClientProvider>
);

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateUser(user: Candidate) {
    return {
        NAME: !validateRequired(user.NAME) ? 'Name is Required' : '',
        EMAIL: !validateEmail(user.EMAIL) ? 'Incorrect Email Format' : '',
        INSTITUTE: !validateRequired(user.INSTITUTE) ? 'Institute is Required' : '',
        COUNTRY: !validateRequired(user.COUNTRY) ? 'Country is Required' : '',
        COUNTRYOFORIGIN: !validateRequired(user.COUNTRYOFORIGIN) ? 'Country Of Origin is Required' : '',
        GENDER: !validateRequired(user.GENDER) ? 'Gender is Required' : '',
        LEVEL: !validateRequired(user.LEVEL) ? 'Level is Required' : '',
        EXPERTISE: !validateRequired(user.EXPERTISE) ? 'Expertise is Required' : '',
        DBLP: !validateRequired(user.DBLP) ? 'DBLP is Required' : '',
    };
}

export default CandidatesPage;