import React from "react";
import {Flex, Heading, IconButton, Stack} from "@chakra-ui/react";
import {FiRefreshCw} from "react-icons/fi";

interface HeaderProps {
    isLoading: boolean;
    onRefresh: () => void;
}

export const Header = React.memo(({isLoading, onRefresh}: HeaderProps) => {
    return (
        <Flex align="center" justify="space-between" gap="3">
            <Stack gap="1">
                <Heading as="h1" size="xl">
                    任務清單
                </Heading>
            </Stack>
            <IconButton aria-label="重新整理" variant="outline" onClick={onRefresh} loading={isLoading}>
                <FiRefreshCw />
            </IconButton>
        </Flex>
    );
});
