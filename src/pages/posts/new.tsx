import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Loading } from '../../components/loading';
import type { CreatePostInput } from '../../schema/post';
import { api } from '../../utils/api';

const CreatePost: NextPage = () => {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();
  const { mutate, error, isLoading } = api.post.createPost.useMutation({
    onSuccess(data) {
      router.push(`/posts/${data.id}`).catch((err) => {
        console.log(err);
      });
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="title"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Your post title"
              {...register('title')}
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="body"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Body
            </label>
            <textarea
              id="body"
              required
              className="relative block h-96 w-full appearance-none rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Your post body"
              {...register('body')}
            />
          </div>
          <div className={`flex h-10 items-center text-xs font-bold`}>
            {!isLoading &&
              (error ? (
                <p className="text-red-600">{error.message}</p>
              ) : (
                <p className="text-green-500"></p>
              ))}
          </div>
          <div>
            <button
              type="submit"
              className={`group  relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {isLoading && <Loading />}
              </span>
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
