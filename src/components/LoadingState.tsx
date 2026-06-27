import React from "react";
import {CircularProgress, Stack} from "@mui/material";

export const LoadingState = React.memo(() => {
    return (
        <Stack spacing={1.5} sx={{alignItems: "center", justifyContent: "center", minHeight: "100%", textAlign: "center"}}>
            <CircularProgress size={28} />
        </Stack>
    );
});
