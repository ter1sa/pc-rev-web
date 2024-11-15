import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { ReactSpreadsheetImport } from "react-spreadsheet-import";

const UploadFilePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false); // State for modal visibility
    const [selectedDblpUrl, setSelectedDblpUrl] = useState<string | null>(null);


    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            // console.log(data);
            const validData = data.validData;
            const response = await axios.get(`http://localhost:5001/api/sancus`);

            for (const userData of validData) {
                const { NAME, EMAIL, INSTITUTE, COUNTRY } = userData;
                const dblpData = response.data.filter((item: any) => item.email === EMAIL);
                const dblpUrl = dblpData[0].dblp;
                // const { NAME, EMAIL, INSTITUTE, COUNTRY, COUNTRYOFORIGIN, GENDER, LEVEL, EXPERTISE, DBLP } = userData;
                // const dblpUrl = DBLP;

                console.log(`Fetching DBLP data for URL: ${dblpUrl}`);
                const dblpResponse = await axios.get(`http://localhost:5001/api/dblp-data`, { params: { dblpUrl } });

                const dblpDataForCandidate = dblpResponse.data;

                // Remove the trailing numbers
                const cleanedCoauthors = dblpDataForCandidate?.coauthors
                    ? dblpDataForCandidate.coauthors.map((coauthor: string) =>
                        coauthor.replace(/\s\d+$/, '')
                    )
                    : [];

                const cleanedCoauthorHist = dblpDataForCandidate?.coauthor_hist
                    ? Object.fromEntries(
                        Object.entries(dblpDataForCandidate.coauthor_hist).map(([key, value]) => [
                            key.replace(/\s\d+$/, ''),
                            value,
                        ])
                    )
                    : {};

                // Calculate LEVEL based on years_of_pub
                const yearsOfPub = dblpDataForCandidate?.years_of_publication || [];
                const currentYear = new Date().getFullYear();
                const earliestYear = Math.min(...yearsOfPub);
                const yearsSinceFirstPublication = currentYear - earliestYear;
                const level = yearsSinceFirstPublication >= 10 ? 'senior' : 'junior';

                console.log('DBLP data for candidate:', NAME, dblpDataForCandidate);

                if (dblpData) {
                    const updatedCandidate = {
                        NAME,
                        EMAIL,
                        INSTITUTE,
                        COUNTRY,
                        COUNTRYOFORIGIN: dblpData[0].country,
                        LEVEL: level,
                        DBLP: dblpUrl,
                        coauthor_hist: cleanedCoauthorHist,
                        years_of_pub: dblpDataForCandidate.years_of_publication,
                        coauthors: cleanedCoauthors,
                    };

                    await axios.post(`http://localhost:5001/api/candidates`, updatedCandidate);
                    // console.log(`Updated candidate: ${EMAIL}`, updatedCandidate);
                } else {
                    console.log(`No DBLP data found for ${EMAIL}`);
                }

                // if (userData) {
                //     const updatedCandidate = {
                //         NAME,
                //         EMAIL,
                //         INSTITUTE,
                //         COUNTRY,
                //         COUNTRYOFORIGIN,
                //         GENDER,
                //         LEVEL,
                //         EXPERTISE,
                //         DBLP,
                //         coauthor_hist: cleanedCoauthorHist,
                //         years_of_pub: dblpDataForCandidate.years_of_publication,
                //         coauthors: cleanedCoauthors,
                //     };

                //     await axios.post(`http://localhost:5001/api/candidates`, updatedCandidate);
                // } else {
                //     console.log(`No DBLP data found for ${EMAIL}`);
                // }
            }
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data');
        }
        handleClose();
    };

    const validateEmail = (email: string) =>
        !!email.length &&
        email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );

    const fields = [
        {
            label: "NAME",
            key: "NAME",
            fieldType: {
                type: "input"
            },
            validations: [
                {
                    rule: "required",
                    errorMessage: "Name is required",
                    level: "error"
                }
            ]
        },
        {
            label: "EMAIL",
            key: "EMAIL",
            fieldType: {
                type: "input"
            },
            validations: [
                {
                    rule: "regex",
                    errorMessage: "Incorrect Email Format",
                    regex: validateEmail,
                    level: "error"
                }
            ]
        },
        {
            label: "INSTITUTE",
            key: "INSTITUTE",
            fieldType: {
                type: "input"
            },
            validations: [
                {
                    rule: "required",
                    errorMessage: "Institute is required",
                    level: "error"
                }
            ]
        },
        {
            label: "COUNTRY",
            key: "COUNTRY",
            fieldType: {
                type: "input"
            },
            validations: [
                {
                    rule: "required",
                    errorMessage: "Country is required",
                    level: "error"
                }
            ]
        },
        // {
        //     label: "COUNTRYOFORIGIN",
        //     key: "COUNTRYOFORIGIN",
        //     fieldType: {
        //         type: "input"
        //     }
        // },
        // {
        //     label: "GENDER",
        //     key: "GENDER",
        //     fieldType: {
        //         type: "input"
        //     }
        // },
        // {
        //     label: "LEVEL",
        //     key: "LEVEL",
        //     fieldType: {
        //         type: "input"
        //     }
        // },
        // {
        //     label: "EXPERTISE",
        //     key: "EXPERTISE",
        //     fieldType: {
        //         type: "input"
        //     }
        // },
        // {
        //     label: "DBLP",
        //     key: "DBLP",
        //     fieldType: {
        //         type: "input"
        //     }
        // }
    ] as const;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Upload User Data
            </Typography>
            <Button variant="contained" onClick={handleOpen}>
                Upload File
            </Button>
            <ReactSpreadsheetImport
                isOpen={isOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                fields={fields}
            />
        </Box>
    );
};

export default UploadFilePage;
