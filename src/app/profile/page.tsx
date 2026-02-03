import { Recommendations } from "@/components/recommendations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-10">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User avatar" />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          Welcome, Circus Fan!
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          This is your personal space. Get recommendations tailored just for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Recommendations />
      </div>
    </div>
  );
}
