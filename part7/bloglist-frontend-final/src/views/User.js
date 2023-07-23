import { Link, useParams } from 'react-router-dom';

import { useUserQuery } from '../hooks';


const User = () => {
  const { id: userId } = useParams();

  const userRes = useUserQuery(userId);

  if (userRes.isLoading) return <div>Loading user...</div>;
  else if (userRes.isError) return <div>Failed to load user</div>;

  const user = userRes.data;
  return (
    <div className='mt-5 ms-5'>
      <h2>{ user.name }</h2>
      <h3>added blogs ({ user.blogs.length })</h3>
      <ul>
        {user.blogs.map((b, i) => (
          <li key={i}>
            <Link to={`/blogs/${b.id}`}>{b.title} by {b.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
