import { Hero } from "../components/hero";
import { Navbar } from "../components/navbar";
import { Gallery } from "../components/gallery";

export function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Gallery />
    </>
  );
}