import type { NextPage } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Loading } from '../../components/loading';
import Modal from '../../components/modal';
import type { CreatePostInput } from '../../schema/post';
import { api } from '../../utils/api';

const SinglePost: NextPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { data, isLoading } = api.post.singlePost.useQuery({
    postId,
  });

  if (isLoading) {
    return <Modal>Loading posts...</Modal>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div>
          <div>
            <label
              htmlFor="title"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div
              className='sm:text-sm" placeholder="Your post title relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10
              focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
            >
              {data?.title}
            </div>
          </div>
          <div className="mt-3">
            <label
              htmlFor="body"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Body
            </label>
            <div className="relative block h-96 w-full appearance-none rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
              {data?.body}
            </div>
          </div>
          <div className={`flex h-10 items-center text-xs font-bold`}></div>
        </div>
      </div>
    </div>
  );
};
export default SinglePost;
