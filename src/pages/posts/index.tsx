import Link from 'next/link';
import Modal from '../../components/modal';
import { api } from '../../utils/api';

function PostList() {
  const { data, isLoading } = api.post.post.useQuery();

  if (isLoading) {
    return <Modal>Loading...</Modal>;
  }

  return (
    <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <ul>
        {data?.map((post) => {
          return (
            <li key={post.id}>
              <div className="mb-5 max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {post.title}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {post.body}
                </p>
                <Link
                  href={`posts/${post.id}`}
                  className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    aria-hidden="true"
                    className="ml-2 -mr-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostList;
