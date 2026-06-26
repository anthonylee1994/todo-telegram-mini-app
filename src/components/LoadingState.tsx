import React from "react";
import {Spinner, Stack, Text} from "@chakra-ui/react";

export const LoadingState = React.memo(() => {
    return (
        <Stack align="center" py="12" color="fg.muted">
            <Spinner />
            <Text>載入緊...</Text>
        </Stack>
    );
});
