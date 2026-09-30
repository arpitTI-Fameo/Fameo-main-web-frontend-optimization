import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function FameoThemeDemo() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-text">
          Fameo learning centre
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">
          Creator <span className="font-serif italic text-primary">Knowledge</span> Hub.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          For the craft you love. And the career you’re building.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button>Explore courses</Button>
        <Button variant="secondary">Membership</Button>
        <Button variant="outline">View resources</Button>
        <Badge variant="secondary">Creator toolkit</Badge>
      </div>
      <div className="max-w-md space-y-2">
        <label htmlFor="resource-search" className="text-sm font-medium">Search resources</label>
        <Input id="resource-search" type="search" placeholder="Find your next course" />
      </div>
      <Card className="bg-silver-sheen shadow-fameo-soft">
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium tracking-tight">Your creative toolkit.</h2>
          <p className="mt-2 text-muted-foreground">White, rose and silver. One shared theme.</p>
        </CardContent>
      </Card>
    </section>
  );
}
