import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Modal = (props: Props) => {
  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-md items-center space-y-8">
        {/* <Loading /> */}
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
