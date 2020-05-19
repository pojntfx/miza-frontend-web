import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo, TodoID, NewTodo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { Heading, Text, Card, Box, Button, Flex } from "rebass";
import styled from "styled-components";
import {
  FaPlus,
  FaRegCheckSquare,
  FaCog,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import {
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SyncLoader } from "react-spinners";
import { Transition } from "react-spring/renderprops";
import { LoaderSizeProps } from "react-spinners/interfaces";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { Label, Input, Textarea } from "@rebass/forms";
import UpdateTodo from "./UpdateTodo";
import { ActionBar } from "./ActionBar";

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

const TodoCard = styled(Card)<{ theme: Theme; style: any }>`
  padding: 0 !important;
  margin-left: ${({ theme }) => theme.space[1]}rem !important;
  margin-right: ${({ theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }) => theme.space[1]}rem !important;
  margin-bottom: ${({ theme }) => theme.space[1]}rem !important;

  &:first-of-type {
    margin-top: ${({ theme }) => theme.space[1]}rem !important;
  }

  ${withHover(false, true)}
`;

const TodoCardContent = styled(Box)`
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TodoLink = styled(Link)`
  text-decoration: inherit;
  color: inherit;
  overflow-x: auto;
  flex: 1;
`;

const ListWrapper = styled(Box)<{ theme: Theme }>`
  margin-bottom: 4rem !important;

  > * {
    margin-top: -${({ theme }) => theme.space[1]}rem !important;
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      width: calc(100% - ${({ theme }) => (theme.space[1] as number) * 2}rem);
      max-width: calc(
        ${({ theme }) => (theme.space[8] as number) * 4}px -
          ${({ theme }) => (theme.space[1] as number) * 2}rem
      );

      > * {
        > * {
          border-radius: ${({ theme }: { theme: Theme }) =>
            theme.space[1]}rem !important;

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
  }
`;

const Container = styled(Box)<{ theme: Theme }>`
  max-width: ${({ theme }) => (theme.space[8] as number) * 4}px;
  margin: 0 auto !important;
  padding: 0 ${({ theme }) => theme.space[1]}rem;
`;

const Header = styled(Box)<{ theme: Theme }>`
  padding-top: ${({ theme }) => theme.space[1]}rem !important;
  padding-bottom: ${({ theme }) => theme.space[1]}rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background: #ff8833 !important;
  padding: ${({ theme }: { theme: Theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white !important;
  text-decoration: none;
  font-weight: bold;

  & > *:first-child {
    margin-right: ${({ theme }: { theme: Theme }) =>
      (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #ff6a00 !important;
  }

  ${withHover(true, true)}
`;

const IconButton = styled(Button)<{ theme: Theme; inverted?: boolean }>`
  min-width: initial !important;

  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;

  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  color: ${({ theme, inverted }) =>
    inverted ? `${theme.colors.text} !important` : "inherit"};
  background: transparent !important;

  &:hover,
  &:active {
    color: ${({ inverted }) => (inverted ? "red" : "#d9d9d9")} !important;
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

const HoverButton = styled(Button)<{ theme: Theme }>`
  ${withHover(false, true)}

  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: Theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;

  & > *:last-child:not(:first-child) {
    margin-left: ${({ theme }: { theme: Theme }) =>
      (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #00406e;
  }
`;

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

const getItemStyle = (draggableStyle: any) => {
  const { transform } = draggableStyle;
  let activeTransform = {};
  if (transform) {
    activeTransform = {
      transform: `translate(0, ${transform.substring(
        transform.indexOf(",") + 1,
        transform.indexOf(")")
      )})`,
    };
  }
  return {
    ...draggableStyle,
    ...activeTransform,
  };
};

export const Loading = ({ loading }: { loading?: boolean }) => (
  <Transition
    items={loading}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
  >
    {(loading) =>
      loading &&
      ((props) => (
        <SyncLoader
          color="#ff6a00"
          size={7.5}
          loading={loading}
          css={(props as unknown) as LoaderSizeProps["css"]}
        />
      ))
    }
  </Transition>
);

export default () => {
  const client = new TodosClient(process.env.API_ENDPOINT);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(false);

  const refresh = () => {
    setLoading(true);

    client.list(new Todo(), (e, res) => {
      e ? console.error(e) : setTodos(res.getTodosList());

      setLoading(false);
    });
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <ThemeUIThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/todos/:id"
              render={(props) => (
                <UpdateTodo
                  client={client}
                  id={parseInt(props.match.params.id)}
                />
              )}
            />
            <Route path="/new">
              {withRouter((props) => (
                <Container>
                  <Header>
                    <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
                      New Todo
                    </Heading>
                    <Flex>
                      <Loading loading={loading} />
                      <Link to="/">
                        <IconButton inverted>
                          <FaTimes />
                        </IconButton>
                      </Link>
                    </Flex>
                  </Header>

                  <Box
                    as="form"
                    onSubmit={(e) => {
                      e.preventDefault();

                      const todo = new NewTodo();
                      todo.setTitle((e.target as any).title.value);
                      todo.setBody((e.target as any).body.value);

                      setLoading(true);

                      client.create(todo, (e) => {
                        e && console.error(e);

                        refresh();

                        return props.history.push("/");
                      });
                    }}
                    pt={0}
                    pb={5}
                  >
                    <Flex mx={-2} mb={3}>
                      <Box width={1} px={2}>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue=""
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
                          defaultValue=""
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
                </Container>
              ))}
            </Route>
            <Route path="/">
              <Container>
                <Header>
                  <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
                    Todos
                  </Heading>
                  <Loading loading={loading} />
                </Header>
              </Container>
              <DragDropContext
                onDragEnd={(d) =>
                  console.log("Reordering", parseInt(d.draggableId))
                }
              >
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <ListWrapper
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <SwipeableList>
                        {todos.map((todo, i) => (
                          <Draggable
                            draggableId={todo.getId().toString()}
                            index={i}
                            key={todo.getId()}
                          >
                            {(provided) => {
                              const deleteTodo = () => {
                                const todoID = new TodoID();
                                todoID.setId(todo.getId());

                                const shouldDelete = confirm(
                                  `Do you want to delete todo ${todo.getTitle()}?`
                                );

                                if (shouldDelete) {
                                  setLoading(true);

                                  client.delete(todoID, (e) => {
                                    e && console.error(e);

                                    refresh();
                                  });
                                }
                              };

                              return (
                                <TodoCard
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    provided.draggableProps.style
                                  )}
                                >
                                  <SwipeableListItem
                                    swipeLeft={{
                                      content: (
                                        <SwipeActionWrapper>
                                          <FaTrash />
                                          <span>Delete</span>
                                        </SwipeActionWrapper>
                                      ),
                                      action: deleteTodo,
                                    }}
                                    swipeRight={{
                                      content: (
                                        <SwipeActionWrapper>
                                          <FaRegCheckSquare />
                                          <span>Select</span>
                                        </SwipeActionWrapper>
                                      ),
                                      action: () =>
                                        console.log("Selecting", todo.getId()),
                                    }}
                                    key={i}
                                  >
                                    <TodoCardContent
                                      as={TodoLink}
                                      to={`/todos/${todo.getId()}`}
                                    >
                                      <Box overflowX="auto" mr={3}>
                                        {todo.getTitle() != "" && (
                                          <Heading>{todo.getTitle()}</Heading>
                                        )}
                                        {todo.getBody() != "" && (
                                          <Text>{todo.getBody()}</Text>
                                        )}
                                      </Box>

                                      <IconButton
                                        onClick={(e) => {
                                          e.preventDefault();

                                          deleteTodo();
                                        }}
                                        inverted
                                      >
                                        <FaTimes />
                                      </IconButton>
                                    </TodoCardContent>
                                  </SwipeableListItem>
                                </TodoCard>
                              );
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </SwipeableList>
                    </ListWrapper>
                  )}
                </Droppable>
              </DragDropContext>

              <ActionBar
                start={
                  <IconButton>
                    <FaRegCheckSquare />
                  </IconButton>
                }
                center={
                  <AddNoteButton as={Link} to="/new">
                    <FaPlus />
                    <span>Add Todo</span>
                  </AddNoteButton>
                }
                end={
                  <IconButton>
                    <FaCog />
                  </IconButton>
                }
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeUIThemeProvider>
    </StyledComponentsThemeProvider>
  );
};
