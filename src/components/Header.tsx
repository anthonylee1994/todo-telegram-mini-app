import React from "react";
import {AppBar, CircularProgress, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface HeaderProps {
    isLoading: boolean;
    onRefresh: () => void;
    children: React.ReactNode;
}

export const Header = React.memo(({isLoading, onRefresh, children}: HeaderProps) => {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Typography variant="h6" component="div">
                    任務清單
                </Typography>
                <Stack direction="row" spacing={0.5}>
                    <IconButton onClick={onRefresh} aria-label="重新整理" disabled={isLoading} color="inherit">
                        {isLoading ? <CircularProgress sx={{color: "white"}} size={18} /> : <RefreshIcon />}
                    </IconButton>
                </Stack>
            </Toolbar>
            {children}
        </AppBar>
    );
});
