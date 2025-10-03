import React, { useEffect, useState } from 'react';
import { getTodos } from '../../api';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Loader } from '../Loader';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsTodoLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => setErrorMessage('Try again later'))
      .finally(() => setIsTodoLoading(false));
  }, []);

  return (
    <>
      {isTodoLoading && <Loader />}

      {!isTodoLoading && !errorMessage && (
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
              <th> </th>
            </tr>
          </thead>

          <tbody>
            {todos.map(todo => (
              <tr
                key={todo.id}
                data-cy="todo"
                className={cn(
                  todo.id % 2 === 0 ? 'has-background-info-light' : '',
                )}
              >
                <td className="is-vcentered">{todo.id}</td>
                <td className="is-vcentered" />
                <td className="is-vcentered is-expanded">
                  <p className="has-text-danger">{todo.title}</p>
                </td>
                <td className="has-text-right is-vcentered">
                  <button
                    data-cy="selectButton"
                    className="button"
                    type="button"
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
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};
