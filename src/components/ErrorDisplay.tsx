import React from "react";
import {Box, Text} from "@chakra-ui/react";

interface ErrorDisplayProps {
    error: string;
}

export const ErrorDisplay = React.memo(({error}: ErrorDisplayProps) => {
    return (
        <Box borderWidth="1px" borderColor="red.subtle" bg="red.subtle" borderRadius="lg" p="3">
            <Text color="red.fg" fontSize="sm">
                {error}
            </Text>
        </Box>
    );
});
