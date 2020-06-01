// package: todos
// file: src/proto/todos.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class NewTodo extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewTodo.AsObject;
  static toObject(includeInstance: boolean, msg: NewTodo): NewTodo.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: NewTodo,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): NewTodo;
  static deserializeBinaryFromReader(
    message: NewTodo,
    reader: jspb.BinaryReader
  ): NewTodo;
}

export namespace NewTodo {
  export type AsObject = {
    title: string;
    body: string;
  };
}

export class Todo extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTitle(): string;
  setTitle(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Todo.AsObject;
  static toObject(includeInstance: boolean, msg: Todo): Todo.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Todo,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): Todo;
  static deserializeBinaryFromReader(
    message: Todo,
    reader: jspb.BinaryReader
  ): Todo;
}

export namespace Todo {
  export type AsObject = {
    id: number;
    title: string;
    body: string;
    index: number;
  };
}

export class TodoList extends jspb.Message {
  clearTodosList(): void;
  getTodosList(): Array<Todo>;
  setTodosList(value: Array<Todo>): void;
  addTodos(value?: Todo, index?: number): Todo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TodoList.AsObject;
  static toObject(includeInstance: boolean, msg: TodoList): TodoList.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TodoList,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): TodoList;
  static deserializeBinaryFromReader(
    message: TodoList,
    reader: jspb.BinaryReader
  ): TodoList;
}

export namespace TodoList {
  export type AsObject = {
    todosList: Array<Todo.AsObject>;
  };
}

export class TodoID extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TodoID.AsObject;
  static toObject(includeInstance: boolean, msg: TodoID): TodoID.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TodoID,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): TodoID;
  static deserializeBinaryFromReader(
    message: TodoID,
    reader: jspb.BinaryReader
  ): TodoID;
}

export namespace TodoID {
  export type AsObject = {
    id: number;
  };
}

export class TodoReorder extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TodoReorder.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TodoReorder
  ): TodoReorder.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TodoReorder,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): TodoReorder;
  static deserializeBinaryFromReader(
    message: TodoReorder,
    reader: jspb.BinaryReader
  ): TodoReorder;
}

export namespace TodoReorder {
  export type AsObject = {
    id: number;
    offset: number;
  };
}
