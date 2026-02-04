import ShowCard from '@/components/show-card';
import { shows } from '@/lib/data';

export default function ShowsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          All Shows
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Browse our full lineup of spectacular performances. The greatest show on Earth is waiting for you!
        </p>
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-8">
        {shows.map((show) => (
          <div key={show.id} className="w-full max-w-md flex">
            <ShowCard show={show} />
          </div>
        ))}
      </div>
    </div>
  );
}
