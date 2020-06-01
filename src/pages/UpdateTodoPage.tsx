import * as React from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Heading, Flex } from "rebass";
import { Link } from "react-router-dom";
import { IconButton } from "../components/IconButton";
import { FaTimes } from "react-icons/fa";
import { TodoForm } from "../components/TodoForm";
import { Loading } from "../components/Loading";

interface IUpdateTodoPageProps {
  loading?: boolean;
  id: number;
  title: string;
  body: string;
  onSubmit: (id: number, title: string, body: string) => void;
  backPath: string;
}

export const UpdateTodoPage: React.FC<IUpdateTodoPageProps> = ({
  loading,
  id,
  title,
  body,
  onSubmit,
  backPath,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Header
      start={
        <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
          Update Todo
        </Heading>
      }
      end={
        <Flex>
          <Loading loading={loading} />
          <Link to={backPath}>
            <IconButton inverted>
              <FaTimes />
            </IconButton>
          </Link>
        </Flex>
      }
    />
    <TodoForm
      title={title}
      body={body}
      saveButtonText={"Update"}
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit(
          id,
          (e.target as any).title.value,
          (e.target as any).body.value
        );
      }}
    />
  </Container>
);
