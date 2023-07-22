import { Link } from 'react-router-dom';

import Header from '../components/Header';

import { useUsersQuery } from '../hooks';

const UsersTable = () => {
  const usersRes = useUsersQuery();

  if (usersRes.isLoading) return <div>Loading users...</div>;
  if (usersRes.isError) return <div>Failed to load users</div>;

  const users = usersRes.data;
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={i}>
            <Link to={`/users/${u.id}`}>
              <td>{u.name}</td>
            </Link>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Users = () => {

  return (
    <div>
      <Header />
      <h2>Users</h2>
      <UsersTable />
    </div>
  );
};

export default Users;
