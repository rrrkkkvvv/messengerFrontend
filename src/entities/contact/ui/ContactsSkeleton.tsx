const ContactsSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <>
      {skeletonContacts.map((_, index) => (
        <div
          key={index}
          className="
                    w-full
                    relative
                    flex
                    items-center
                    space-x-3
                    rounded-lg
                    transition
                    cursor-pointer
                    border-b-2
                    border-green-200
                    p-2
                    animate-pulse"
        >
          <div className="h-9 w-9 rounded-full bg-gray-200 relative"></div>

          <div>
            <div className=" h-4  w-20 rounded-lg bg-gray-200"></div>
            <div className=" flex   gap-2 relative text-center items-center mt-2">
              <div className=" h-4  w-7 rounded-lg bg-gray-200"></div>

              <div className=" h-4  w-20 rounded-lg bg-gray-200"></div>
            </div>
          </div>
          <div className="absolute right-5 top-2 h-4  w-16 rounded-lg bg-gray-200"></div>
        </div>
      ))}
    </>
  );
};

export default ContactsSkeleton;
