import * as React from "react";
import { Box, Flex, Button } from "rebass";
import { Label, Input, Textarea } from "@rebass/forms";
import styled from "styled-components";
import { Theme } from "theme-ui";
import { FaSave } from "react-icons/fa";
import { withHover } from "../utils/withHover";

interface ITodoForm {
  title: string;
  body: string;
  onSubmit: (event: React.FormEvent<HTMLDivElement>) => void;
}

export const TodoForm: React.FC<ITodoForm> = ({
  title,
  body,
  onSubmit,
  ...rest
}) => (
  <Box as="form" onSubmit={onSubmit} pt={0} pb={5} {...rest}>
    <Flex mx={-2} mb={3}>
      <Box width={1} px={2}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={title}
          sx={{
            borderRadius: 4,
          }}
        />
      </Box>
    </Flex>
    <Flex mx={-2} mb={5}>
      <Box width={1} px={2}>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={body}
          autoFocus
          required
          sx={{
            borderRadius: 4,
            resize: "vertical",
          }}
        />
      </Box>
    </Flex>
    <Flex mx={-2} flexWrap="wrap">
      <Box px={2} ml="auto">
        <HoverButton>
          <FaSave />
          <span>Create</span>
        </HoverButton>
      </Box>
    </Flex>
  </Box>
);

const HoverButton = styled(Button)<{ theme: Theme }>`
  ${withHover(false, true)}

  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }) => theme.space[1]}rem !important;

  & > *:last-child:not(:first-child) {
    margin-left: ${({ theme }) => (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #00406e;
  }
`;
