export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-5 pt-14 sm:px-8 sm:pt-20">
      <div className="h-12 w-56 rounded-2xl bg-well" />
      <div className="mt-4 h-5 w-72 rounded-full bg-well" />
      <div className="mt-10 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-10 w-24 rounded-full bg-well" />
        ))}
      </div>
      <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-3xl bg-well" />
            <div className="mt-4 h-4 w-2/3 rounded-full bg-well" />
          </div>
        ))}
      </div>
    </div>
  );
}
