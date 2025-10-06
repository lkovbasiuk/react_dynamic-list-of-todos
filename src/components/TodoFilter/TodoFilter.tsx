import React, { useState } from 'react';

type Props = {
  todos: Todo[];
  onFilter: (filtered: Todo[]) => void;
};

interface FilterParams {
  query: string;
  sortField: string;
}

function getPreparedList(todos: Todo[], { query, sortField }: FilterParams) {
  let preparedList = [...todos];

  if (query) {
    preparedList = preparedList.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  if (sortField !== 'all') {
    preparedList = preparedList.filter(todo =>
      sortField === 'active' ? !todo.completed : todo.completed,
    );
  }

  return preparedList;
}

export const TodoFilter: React.FC<Props> = ({ todos, onFilter }) => {
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('all');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    const filtered = getPreparedList(todos, { query: newQuery, sortField });

    onFilter(filtered);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value;

    setSortField(newSort);

    const filtered = getPreparedList(todos, { query, sortField: newSort });

    onFilter(filtered);
  };

  const handleClear = () => {
    setQuery('');
    onFilter(getPreparedList(todos, { query: '', sortField }));
  };

  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            value={sortField}
            onChange={handleSortChange}
            data-cy="statusSelect"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          className="input"
          placeholder="Search..."
          value={query}
          onChange={handleQueryChange}
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        {query && (
          <span className="icon is-right" style={{ pointerEvents: 'all' }}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="clearSearchButton"
              type="button"
              className="delete"
              onClick={handleClear}
            />
          </span>
        )}
      </p>
    </form>
  );
};
