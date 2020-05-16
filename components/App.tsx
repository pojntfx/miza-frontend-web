import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { Heading, Text, Card, Box, Button } from "rebass";
import styled from "styled-components";
import { FaPlus, FaRegCheckSquare, FaCog, FaTrash } from "react-icons/fa";
import {
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";

const withHover = (
  center: boolean,
  shadow?: boolean
) => `transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  &:hover {
    transform: ${center ? "translateX(-50%)" : ""} scale(1.05);
    ${shadow ? "box-shadow: 0 0 15px rgba(0, 0, 0, 0.13);" : ""}
  }

  &:active {
    transform: ${center ? "translateX(-50%)" : ""} scale(1);
    ${shadow ? "background: rgba(0, 0, 0, 0.13);" : ""}
  }`;

const TodoCard = styled(Card)`
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  margin-left: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  margin-right: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  margin-top: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  width: 100%;

  ${withHover(false, true)}
`;

const ListWrapper = styled(Box)<{ theme: Theme }>`
  margin-bottom: 4rem !important;

  > * {
    margin-top: -${({ theme }) => theme.space[1]}rem !important;

    > * {
      > *:last-of-type {
        margin: 0 auto;
        max-width: ${({ theme }) => (theme.space[8] as number) * 4}px;
      }
      :not(:first-of-type) {
        margin-top: -${({ theme }) => theme.space[1]}rem !important;
      }

      > * {
        &:first-of-type {
          background: red !important;
        }

        &:nth-of-type(2) {
          background: ${({ theme }) => theme.colors.primary} !important;
        }

        &:last-of-type {
          background: transparent !important;
        }
      }
    }
  }
`;

const Container = styled(Box)<{ theme: Theme }>`
  max-width: ${({ theme }) => (theme.space[8] as number) * 4}px;
  margin: 0 auto !important;
  padding: 0 ${({ theme }) => theme.space[1]}rem;
`;

const Header = styled.div`
  padding-top: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  padding-bottom: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
`;

const Toolbar = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }: { theme: any }) => theme.shadows.card};
`;

const AddNoteButton = styled(Button)`
  position: fixed;
  bottom: ${({ theme }: { theme: Theme }) => theme.space[2]}rem;
  left: 50%;
  transform: translateX(-50%);
  background: #ff8833 !important;
  padding: ${({ theme }: { theme: Theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > *:first-child {
    margin-right: ${({ theme }: { theme: Theme }) =>
      (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #ff6a00 !important;
  }

  ${withHover(true, true)}
`;

const IconButton = styled(Button)`
  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;

  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  &:hover,
  &:active {
    color: #d9d9d9;
  }
`;

const SwipeActionWrapper = styled(Box)<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem;
  color: white !important;

  > * {
    &:first-of-type {
      margin-right: ${({ theme }: { theme: Theme }) =>
        (theme.space[1] as number) / 2}rem !important;
    }
  }
`;

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

export default () => {
  const client = new TodosClient(process.env.API_ENDPOINT);
  const [todos, setTodos] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    client.list(new Todo(), (e, res) => {
      setTodos(res.getTodosList());
    });
  }, []);

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <ThemeUIThemeProvider theme={theme}>
        <Container>
          <Header>
            <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
              Todos
            </Heading>
          </Header>
        </Container>
        <ListWrapper>
          <SwipeableList>
            {todos.map((todo, i) => (
              <SwipeableListItem
                swipeLeft={{
                  content: (
                    <SwipeActionWrapper>
                      <FaTrash />
                      <span>Delete</span>
                    </SwipeActionWrapper>
                  ),
                  action: () => console.log("Deleting"),
                }}
                swipeRight={{
                  content: (
                    <SwipeActionWrapper>
                      <FaRegCheckSquare />
                      <span>Select</span>
                    </SwipeActionWrapper>
                  ),
                  action: () => console.log("Selecting"),
                }}
                key={i}
              >
                <TodoCard key={i}>
                  {todo.getTitle() != "" && (
                    <Heading>{todo.getTitle()}</Heading>
                  )}
                  {todo.getBody() != "" && <Text>{todo.getBody()}</Text>}
                </TodoCard>
              </SwipeableListItem>
            ))}
          </SwipeableList>
        </ListWrapper>
        <Toolbar>
          <IconButton>
            <FaRegCheckSquare />
          </IconButton>
          <AddNoteButton>
            <FaPlus />
            <span>Add Note</span>
          </AddNoteButton>
          <IconButton>
            <FaCog />
          </IconButton>
        </Toolbar>
      </ThemeUIThemeProvider>
    </StyledComponentsThemeProvider>
  );
};
