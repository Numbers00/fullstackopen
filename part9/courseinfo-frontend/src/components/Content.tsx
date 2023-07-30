import Part from './Part';

import { CoursePart } from '../types';


interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map((c, i) => (
        <Part key={i} coursePart={c} />
      ))}
    </>
  );
};

export default Content;
