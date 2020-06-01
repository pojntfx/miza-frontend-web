import * as React from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Heading, Text } from "rebass";
import { Link } from "react-router-dom";
import { IconButton } from "../components/IconButton";
import { FaTimes, FaEdit } from "react-icons/fa";
import { HeaderEndWrapper } from "../components/HeaderEndWrapper";

interface IGetTodoPageProps {
  id: number;
  title: string;
  body: string;
  getPath: (id: number) => string;
  backPath: string;
}

export const GetTodoPage: React.FC<IGetTodoPageProps> = ({
  id,
  title,
  body,
  getPath,
  backPath,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Header
      start={
        title && (
          <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
            {title}
          </Heading>
        )
      }
      end={
        <HeaderEndWrapper>
          <Link to={getPath(id)}>
            <IconButton inverted primary>
              <FaEdit />
            </IconButton>
          </Link>
          <Link to={backPath}>
            <IconButton inverted>
              <FaTimes />
            </IconButton>
          </Link>
        </HeaderEndWrapper>
      }
    />
    {body && <Text>{body}</Text>}
  </Container>
);
