export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-5 pt-8 sm:px-8 sm:pt-12">
      <div className="h-5 w-40 rounded-full bg-well" />
      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="aspect-square rounded-[2rem] bg-well" />
        <div className="lg:py-6">
          <div className="h-4 w-24 rounded-full bg-well" />
          <div className="mt-4 h-12 w-3/4 rounded-2xl bg-well" />
          <div className="mt-6 h-7 w-20 rounded-full bg-well" />
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded-full bg-well" />
            <div className="h-4 w-5/6 rounded-full bg-well" />
            <div className="h-4 w-2/3 rounded-full bg-well" />
          </div>
          <div className="mt-10 h-12 w-full rounded-full bg-well" />
        </div>
      </div>
    </div>
  );
}
