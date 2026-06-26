import React from "react";
import {Flex, Heading, IconButton, Stack} from "@chakra-ui/react";
import {FiPlus, FiRefreshCw} from "react-icons/fi";

interface HeaderProps {
    isLoading: boolean;
    onRefresh: () => void;
    onOpenDrawer: () => void;
}

export const Header = React.memo(({isLoading, onRefresh, onOpenDrawer}: HeaderProps) => {
    return (
        <Flex align="center" justify="space-between" gap="3">
            <Stack gap="1">
                <Heading as="h1" size="xl">
                    任務清單
                </Heading>
            </Stack>
            <Stack direction="row" gap="2">
                <IconButton aria-label="重新整理" variant="outline" onClick={onRefresh} loading={isLoading}>
                    <FiRefreshCw />
                </IconButton>
                <IconButton aria-label="新增任務" variant="solid" colorPalette="blue" onClick={onOpenDrawer}>
                    <FiPlus />
                </IconButton>
            </Stack>
        </Flex>
    );
});
