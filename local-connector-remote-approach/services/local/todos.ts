export interface ILocalNewTodo {
  title: string;
}

export interface ILocalTodo extends ILocalNewTodo {
  id: string;
}

export interface LocalTodosService {
  create: (todo: ILocalNewTodo) => ILocalTodo;
}

export class LocalTodosServiceImpl implements LocalTodosService {
    
}