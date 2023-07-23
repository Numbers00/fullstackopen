import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useUsersQuery } from '../hooks';


const UsersTable = () => {
  const usersRes = useUsersQuery();

  if (usersRes.isLoading) return <div>Loading users...</div>;
  if (usersRes.isError) return <div>Failed to load users</div>;

  const users = usersRes.data;
  return (
    <Table striped>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={i}>
            <td>
              <Link to={`/users/${u.id}`}>
                {u.name}
              </Link>
            </td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Users = () => {

  return (
    <div className='mt-5 ms-5'>
      <h2>Users</h2>
      <UsersTable />
    </div>
  );
};

export default Users;
