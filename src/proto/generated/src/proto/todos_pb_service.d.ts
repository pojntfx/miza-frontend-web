// package: todos
// file: src/proto/todos.proto

import * as src_proto_todos_pb from "../../src/proto/todos_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type TodosCreate = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_todos_pb.NewTodo;
  readonly responseType: typeof src_proto_todos_pb.Todo;
};

type TodosList = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof src_proto_todos_pb.TodoList;
};

type TodosGet = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_todos_pb.TodoID;
  readonly responseType: typeof src_proto_todos_pb.Todo;
};

type TodosUpdate = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_todos_pb.Todo;
  readonly responseType: typeof src_proto_todos_pb.Todo;
};

type TodosDelete = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_todos_pb.TodoID;
  readonly responseType: typeof src_proto_todos_pb.Todo;
};

type TodosReorder = {
  readonly methodName: string;
  readonly service: typeof Todos;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof src_proto_todos_pb.TodoReorder;
  readonly responseType: typeof src_proto_todos_pb.Todo;
};

export class Todos {
  static readonly serviceName: string;
  static readonly Create: TodosCreate;
  static readonly List: TodosList;
  static readonly Get: TodosGet;
  static readonly Update: TodosUpdate;
  static readonly Delete: TodosDelete;
  static readonly Reorder: TodosReorder;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class TodosClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: src_proto_todos_pb.NewTodo,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  create(
    requestMessage: src_proto_todos_pb.NewTodo,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  list(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.TodoList|null) => void
  ): UnaryResponse;
  list(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.TodoList|null) => void
  ): UnaryResponse;
  get(
    requestMessage: src_proto_todos_pb.TodoID,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  get(
    requestMessage: src_proto_todos_pb.TodoID,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  update(
    requestMessage: src_proto_todos_pb.Todo,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  update(
    requestMessage: src_proto_todos_pb.Todo,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: src_proto_todos_pb.TodoID,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  delete(
    requestMessage: src_proto_todos_pb.TodoID,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  reorder(
    requestMessage: src_proto_todos_pb.TodoReorder,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
  reorder(
    requestMessage: src_proto_todos_pb.TodoReorder,
    callback: (error: ServiceError|null, responseMessage: src_proto_todos_pb.Todo|null) => void
  ): UnaryResponse;
}

