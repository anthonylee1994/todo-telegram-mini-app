import React from "react";
import {Box, Heading, Stack, Text} from "@chakra-ui/react";

export const EmptyState = React.memo(() => {
    return (
        <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" p="8">
            <Stack gap="2" textAlign="center">
                <Heading as="h2" size="md">
                    暫時冇任務
                </Heading>
                <Text color="fg.muted" fontSize="sm">
                    加第一個任務，等自己唔使靠記憶硬撐。
                </Text>
            </Stack>
        </Box>
    );
});
