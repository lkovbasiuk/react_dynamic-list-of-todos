import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from '../../api';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Loader } from '../Loader';
import { TodoModal } from '../TodoModal';
import { TodoFilter } from '../TodoFilter';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    setIsTodoLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setErrorMessage('Try again later'))
      .finally(() => setIsTodoLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesQuery = todo.title
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus =
        status === 'all' ||
        (status === 'active' && !todo.completed) ||
        (status === 'completed' && todo.completed);

      return matchesQuery && matchesStatus;
    });
  }, [todos, query, status]);

  return (
    <>
      {isTodoLoading && <Loader />}

      {!isTodoLoading && !errorMessage && (
        <>
          <TodoFilter
            query={query}
            status={status}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
          />

          <table className="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <span className="icon">
                    <i className="fas fa-check" />
                  </span>
                </th>
                <th>Title</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {visibleTodos.map(todo => (
                <tr
                  key={todo.id}
                  data-cy="todo"
                  className={cn(
                    selectedTodo?.id === todo.id && 'has-background-info-light',
                  )}
                >
                  <td className="is-vcentered">{todo.id}</td>
                  <td className="is-vcentered">
                    {todo.completed && (
                      <span className="icon has-text-success">
                        <i className="fas fa-check" />
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      'is-vcentered is-expanded',
                      todo.completed ? 'has-text-success' : 'has-text-danger',
                    )}
                  >
                    {todo.title}
                  </td>
                  <td className="has-text-right is-vcentered">
                    <button
                      data-cy="selectButton"
                      className="button"
                      type="button"
                      onClick={() => setSelectedTodo(todo)}
                    >
                      <span className="icon">
                        <i className="far fa-eye" />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      {selectedTodo && (
        <TodoModal
          todoTitle={selectedTodo.title}
          userId={selectedTodo.userId}
          todoId={selectedTodo.id}
          isOpen={!!selectedTodo}
          onClose={() => setSelectedTodo(null)}
        />
      )}
    </>
  );
};
