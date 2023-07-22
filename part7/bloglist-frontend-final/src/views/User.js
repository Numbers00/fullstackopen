import { useParams } from 'react-router-dom';

import Header from '../components/Header';

import { useUserQuery } from '../hooks';

const UserContents = () => {
  const { id: userId } = useParams();

  const userRes = useUserQuery(userId);

  if (userRes.isLoading) return <div>Loading user...</div>;
  if (userRes.isError) return <div>Failed to load user</div>;

  const user = userRes.data;
  return (
    <div>
      <h2>{ user.name }</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((b, i) => (
          <li key={i}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
};

const User = () => {

  return (
    <div>
      <Header />
      <UserContents />
    </div>
  );
};

export default User;
