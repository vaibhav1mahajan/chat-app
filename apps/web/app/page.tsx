import { Button } from "@repo/ui/button";
import Card from "@repo/ui/card";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
export default function Home() {
  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 w-full h-full -z-10 bg-neutral-900">
        <div className="absolute hidden md:block bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1100px_at_50%_200px,#021526,transparent)]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_200px_at_50%_300px,#021526,transparent)]"></div>
      </div>
      <Navbar />
      <Hero />
    </div>
  );
}
