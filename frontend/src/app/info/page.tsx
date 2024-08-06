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
          <h2 className="text-xl font-bold mb-2">About Pixtery</h2>
          <p>
            This game is best played{" "}
            <span className="font-bold text-primary">in-person</span> with
            friends or family. One (or more) players will choose a word and{" "}
            <span className="font-bold text-primary">draw</span> it, while the
            others try to <span className="font-bold text-primary">guess</span>{" "}
            the word based on the drawing. The player who guesses the word the
            fastest wins!{" "}
          </p>
        </div>
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">Draw</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Enter the word to draw, and click{" "}
              <span className="font-bold text-primary">Start Drawing</span>{" "}
              button.
            </li>
            <li>
              Choose any color from the palette, and start drawing. (use white
              color as an eraser)
            </li>
            <li>
              Meanwhile, other players will try to guess the word you have
              entered based on your drawing.
            </li>
            <li>
              Use <span className="font-bold text-primary">Clear Canvas</span>{" "}
              button to clear the canvas.
            </li>
            <li>
              If you wish to start a new game, clear the canvas, type in a new
              word, and press{" "}
              <span className="font-bold text-primary">Start Drawing</span>{" "}
              again.
            </li>
          </ul>
        </div>
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">Guess</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Whenever the person starts the drawing (i.e., clicks the{" "}
              <span className="font-bold text-primary">Start Drawing</span>{" "}
              button),{" "}
              <span className="font-bold text-primary">Time elapsed</span> will
              reset / start.
            </li>
            <li>
              Based on the drawing seen on the canvas, you will have to guess
              the word.
            </li>
            <li>Type in your guess in the input field given.</li>
            <li>
              If your guess is correct, then you can see how fast (
              <span className="font-bold text-primary">Time in seconds</span>)
              you have guessed the word correctly.
            </li>
            <li>
              The player who guesses the word the{" "}
              <span className="font-bold text-primary">fastest</span> wins!
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
