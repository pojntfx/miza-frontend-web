import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { Heading, Text, Card, Box } from "rebass";
import styled from "styled-components";

const TodoCard = styled(Card)`
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  margin-bottom: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.13);
  }

  &:active {
    transform: scale(1);
    background: rgba(0, 0, 0, 0.13);
  }
`;

const Container = styled(Box)`
  max-width: ${({ theme }: { theme: Theme }) =>
    (theme.space[8] as number) * 4}px;
  margin: 0 auto !important;
  padding: 0 ${({ theme }: { theme: Theme }) => theme.space[1]}rem;
`;

const Header = styled.div`
  padding-top: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  padding-bottom: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
`;

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

export default () => {
  const client = new TodosClient("http://localhost:8080");
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

          {todos.map((todo, i) => (
            <TodoCard key={i}>
              {todo.getTitle() != "" && <Heading>{todo.getTitle()}</Heading>}
              {todo.getBody() != "" && <Text>{todo.getBody()}</Text>}
            </TodoCard>
          ))}
        </Container>
      </ThemeUIThemeProvider>
    </StyledComponentsThemeProvider>
  );
};
