import React from "react";
import {Stack, Typography} from "@mui/material";

export const EmptyState = React.memo(() => {
    return (
        <Stack spacing={1.5} sx={{alignItems: "center", justifyContent: "center", minHeight: "100%", textAlign: "center"}}>
            <Typography variant="subtitle1">暫時冇任務</Typography>
        </Stack>
    );
});
