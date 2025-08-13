import { AppBar } from "@/components/AppBar";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 right-0 left-0">
        <AppBar />
      </div>
      <LandingPage />
    </div>
  );
}
