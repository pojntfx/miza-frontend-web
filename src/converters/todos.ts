import { Todo } from "../proto/generated/src/proto/todos_pb";
import { ITodo } from "../services/todos";

interface ITodosConverter {
  toInternal: (todo: Todo) => ITodo;
  toExternal: (todo: ITodo) => Todo;
}

export class TodosConverter implements ITodosConverter {
  toInternal(todo: Todo) {
    return {
      id: todo.getId(),
      title: todo.getTitle(),
      body: todo.getBody(),
      index: todo.getIndex(),
    };
  }

  toExternal(todo: ITodo) {
    const itodo = new Todo();

    itodo.setId(todo.id);
    itodo.setTitle(todo.title);
    itodo.setBody(todo.body);
    itodo.setIndex(todo.index);

    return itodo;
  }
}
