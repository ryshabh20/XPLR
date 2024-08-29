export const SearchUserLoader = () => {
  return (
    <div className="p-4">
      {new Array(7).fill(null).map((_, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <div
            className={`h-10 w-11 rounded-full bg-neutral-500 animate-pulse`}
            style={{ animationDelay: `${index * 0.2}s` }}
          ></div>
          <div className="w-full">
            <div
              className={`h-4 rounded-sm  bg-neutral-500 mb-2  animate-pulse`}
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
            <div
              className={`h-4 rounded-sm  bg-neutral-500 w-5/6 animate-pulse`}
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
