// NOT IN USE
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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
import { SancusDB } from '../types';

const Example = () => {
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    const columns = useMemo<MRT_ColumnDef<SancusDB>[]>(
        () => [
            {
                accessorKey: 'id', header: 'ID',
                enableEditing: false,
            },
            {
                accessorKey: 'name', header: 'Name',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            name: undefined,
                        }),
                },
            },
            {
                accessorKey: 'email', header: 'Email',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.email,
                    helperText: validationErrors?.email,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                        }),
                },
            },
            {
                accessorKey: 'organization', header: 'Organization',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.organization,
                    helperText: validationErrors?.organization,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            organization: undefined,
                        }),
                },
            },
            {
                accessorKey: 'country', header: 'Country',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.country,
                    helperText: validationErrors?.country,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            country: undefined,
                        }),
                },
            },
            {
                accessorKey: 'countryoforigin', header: 'Country of Origin',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.countryoforigin,
                    helperText: validationErrors?.countryoforigin,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            countryoforigin: undefined,
                        }),
                },
            },
            {
                accessorKey: 'dblp', header: 'DBLP',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.dblp,
                    helperText: validationErrors?.dblp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            dblp: undefined,
                        }),
                },
            },
        ],
        [validationErrors],
    );

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

    //CREATE action
    const handleCreateUser: MRT_TableOptions<SancusDB>['onCreatingRowSave'] = async ({
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
    const handleSaveUser: MRT_TableOptions<SancusDB>['onEditingRowSave'] = async ({
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
    const openDeleteConfirmModal = (row: MRT_Row<SancusDB>) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(row.original.id);
        }
    };

    const handleRunIteration = () => {
        // Add logic for running iteration
        console.log('Run Iteration clicked');
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedUsers,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        enableStickyHeader: true,
        initialState: { columnVisibility: { id: false } },
        enableColumnResizing: true,
        muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 300px)' } },
        muiTablePaperProps: {
            sx: {
                m: 'auto',
                maxWidth: 'calc(100vw - 150px)'
            }
        },
        getRowId: (row) => row.id,
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
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Create New User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <>
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                        //or you can pass in a row object to set default values with the `createRow` helper function
                        // table.setCreatingRow(
                        //   createRow(table, {
                        //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                        //   }),
                        // );
                    }}
                >
                    Create New User
                </Button>
                <Button variant="contained" color="secondary" onClick={handleRunIteration}>Run Iteration</Button>
            </>
        ),
        state: {
            isLoading: isLoadingUsers,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return <Box sx={{ pt: 10, pl: 5, pr: 5 }}>
        <Typography variant="h4" gutterBottom>
            Imported Data
        </Typography>
        <MaterialReactTable table={table} />
    </Box>;
};

//CREATE hook (post new user to api)
function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: SancusDB) => {
            axios.post('http://localhost:5001/api/sancus', { ...user });
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo: SancusDB) => {
            queryClient.setQueryData(
                ['users'],
                (prevUsers: any) =>
                    [
                        ...prevUsers,
                        {
                            ...newUserInfo
                        },
                    ] as SancusDB[],
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

//READ hook (get users from api)
function useGetUsers() {
    return useQuery<SancusDB[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5001/api/sancus');
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: SancusDB) => {
            console.log(user);
            await axios.put(`http://localhost:5001/api/sancus/${user.id}`, { ...user });
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo: SancusDB) => {
            queryClient.setQueryData(['users'], (prevUsers: any) =>
                prevUsers?.map((prevUser: SancusDB) =>
                    prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
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
            await axios.delete(`http://localhost:5001/api/sancus/${userId}`);
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (userId: string) => {
            queryClient.setQueryData(['users'], (prevUsers: any) =>
                prevUsers?.filter((user: SancusDB) => user.id !== userId),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <Example />
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

function validateUser(user: SancusDB) {
    return {
        name: !validateRequired(user.name) ? 'Name is Required' : '',
        email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
        organization: !validateRequired(user.organization) ? 'Organization is Required' : '',
        country: !validateRequired(user.country) ? 'Country is Required' : '',
        countryoforigin: !validateRequired(user.countryoforigin) ? 'Country Of Origin is Required' : '',
        dblp: !validateRequired(user.dblp) ? 'DBLP is Required' : '',
    };
}

export default ExampleWithProviders;