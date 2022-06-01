import { Box, Button, Popover, Text, View } from 'native-base';
import React from 'react';

const PopoverComponent = ({ children }) => {
    return (
        <Box h="60%" w="100%" alignItems="center">
            <Popover
                trigger={(triggerProps) => {
                    return (
                        <View {...triggerProps}>
                            <Text>123</Text>
                            {children}
                        </View>
                    );
                }}
            >
                <Popover.Content accessibilityLabel="" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Body>Để sử dụng tính năng bạn cần đăng nhập</Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                        <Button.Group space={2}>
                            <Button colorScheme="coolGray" variant="ghost">
                                Đóng
                            </Button>
                            <Button colorScheme="danger">Đăng nhập</Button>
                        </Button.Group>
                    </Popover.Footer>
                </Popover.Content>
            </Popover>
        </Box>
    );
};

export default PopoverComponent;
