import { Card, Badge } from 'antd';
import Link from 'next/link';
import { currencyFormatter } from '../../utils/helpers';

const { Meta } = Card;

const CourseCard = ({ course }) => {
  // destructure
  const { name, instructor_id, price, image, slug, paid, category } = course;
  // console.log('course==>', course);
  return (
    <Link href='/course/[slug]' as={`/course/${slug}`}>
      <a>
        <Card
          className='mb-4'
          cover={
            <img
              src={'/course.png'}
              alt={name}
              style={{ height: '200px', objectFit: 'cover' }}
              className='p-1'
            />
          }
        >
          <h2 className='h4 font-weight-bold'>{name}</h2>
          <p>by {instructor_id}</p>

          {/* {category.map((c) => ( */}
          <Badge
            count={category}
            style={{ backgroundColor: '#03a9f4' }}
            className='pb-2 mr-2'
          />
          {/* ))} */}

          <h4 className='pt-2'>
            {paid
              ? '$$' /**currencyFormatter({
                  amount: price,
                  currency: 'Birr',
                })**/
              : 'Free'}
          </h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
