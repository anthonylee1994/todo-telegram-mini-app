import React from "react";
import {Box, Typography} from "@mui/material";

interface ErrorDisplayProps {
    error: string;
}

export const ErrorDisplay = React.memo(({error}: ErrorDisplayProps) => {
    return (
        <Box
            sx={{
                backgroundColor: "#fdecea",
                borderRadius: 3,
                px: 2,
                py: 1.5,
            }}
        >
            <Typography variant="body2" color="error.dark" sx={{fontWeight: 500}}>
                {error}
            </Typography>
        </Box>
    );
});
