import { useParams } from 'react-router-dom';

import { useUserQuery } from '../hooks';


const User = () => {
  const { id: userId } = useParams();

  const userRes = useUserQuery(userId);

  if (userRes.isLoading) return <div>Loading user...</div>;
  else if (userRes.isError) return <div>Failed to load user</div>;

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

export default User;
