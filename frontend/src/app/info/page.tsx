import Back from "@/components/Back";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
const pixel = Pixelify_Sans({ subsets: ["latin"] });

const page = () => {
  return (
    <div className="max-w-md px-5 gap-5 mx-auto min-h-[100dvh] flex flex-col justify-center items-center">
      <Back />
      <h1 className={`${pixel.className} text-4xl font-black text-primary`}>
        Info
      </h1>
      <ScrollArea className="h-[500px] w-full rounded-md border-2 border-secondary p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">About</h2>
          <p>
            <span className="font-bold text-primary">Pixtery</span> is a
            multiplayer, real-time strategy game where players compete to
            conquer a shared grid by coloring as many tiles as possible. In this
            fast-paced game, each player's objective is to capture and maintain
            the most territory on the grid by the end of the game.
          </p>
        </div>
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The game board consists of{" "}
              <span className="font-bold text-primary">grid</span> of tiles.
            </li>
            <li>
              Each tile starts as{" "}
              <span className="font-bold text-primary">white</span> and can be
              colored by any player.
            </li>
            <li>
              Players are assigned{" "}
              <span className="font-bold text-primary">unique colors</span> when
              they join the game.
            </li>
            <li>
              Color as{" "}
              <span className="font-bold text-primary">
                many tiles as possible
              </span>{" "}
              to expand your territory.
            </li>
            <li>
              The player who controls the{" "}
              <span className="font-bold text-primary">most tiles</span> on the
              grid <span className="font-bold text-primary">wins</span>.
            </li>
            <li>
              Players' <span className="font-bold text-primary">scores</span>{" "}
              are updated in real-time as tiles are captured.
            </li>
          </ul>
        </div>

        <div className="font-bold">
          created by{" "}
          <Link
            href="https://srajan.vercel.app"
            target="_blank"
            className="hover:text-primary transition-colors duration-300"
          >
            srajankumar
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
};

export default page;
