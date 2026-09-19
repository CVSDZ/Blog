import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Hello world!</h1>
        <div className="flex gap-2">
          <Button>默认按钮</Button>
          <Button variant="outline">描边按钮</Button>
          <Button variant="destructive">危险按钮</Button>
        </div>
      </div>
    </main>
  );
}
