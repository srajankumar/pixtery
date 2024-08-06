import { ReactNode } from "react";
import {
  HTMLMotionProps,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import Balancer from "react-wrap-balancer";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

interface FeatureCardProps extends HTMLMotionProps<"div"> {
  feature: {
    title: ReactNode;
    category: string;
    imageUrl: string;
  };
  zIndexOffset?: number;
}

function FeatureCard({
  feature,
  className,
  zIndexOffset = 0,
  ...props
}: FeatureCardProps) {
  const { title, category, imageUrl } = feature;
  const springValue = useSpring(0, {
    bounce: 0,
  });
  const zIndex = useTransform(
    springValue,
    (value) => +Math.floor(value * 10) + 10 + zIndexOffset
  );
  const scale = useTransform(springValue, [0, 1], [1, 1.1]);

  const content = (
    <>
      <img
        src={imageUrl}
        alt=""
        className="-z-1 absolute inset-0 h-full w-full object-cover"
      />
      <div className="z-10 flex h-full w-full flex-col gap-2 p-3">
        {/* <small className="inline w-fit rounded-xl bg-orange-950 bg-opacity-50 px-2 py-1 text-xs font-medium leading-none text-white">
          {category}
        </small> */}

        <div className="flex-1" />
        <h3 className="rounded-xl bg-blue-500/80 p-3 text-base font-semibold leading-none text-white backdrop-blur-sm">
          {title}
        </h3>
      </div>
    </>
  );

  const containerClassName = cn(
    "relative flex h-52 w-40 md:h-64 md:w-48 flex-col overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-xl",
    className
  );

  return (
    <>
      <motion.div
        onMouseEnter={() => springValue.set(1)}
        onMouseLeave={() => springValue.set(0)}
        style={{
          zIndex,
          scale,
        }}
        className={cn(containerClassName, "flex")}
        {...props}
      >
        {content}
      </motion.div>
      {/* <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0, transition: { duration: 0.5 } }}
        className={cn(containerClassName, "flex sm:hidden")}
      >
        {content}
      </motion.div> */}
    </>
  );
}

export default function Hero() {
  const cardWidth = 48 * 4;
  const angle = 6;
  const yOffset = 30;

  return (
    <section className="flex w-full flex-col gap-4 bg-blue-50 min-h-screen justify-center items-center md:py-10 py-32">
      <motion.header
        initial={{
          y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
        className="flex max-w-md flex-col items-center gap-2 text-center"
      >
        <h1 className="text-4xl font-black text-primary">Pixtery</h1>
        <Balancer className="block text-lg">
          Draw and guess pixel art with friends and family!
        </Balancer>
      </motion.header>

      <motion.div
        initial={{
          y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
        className="max-w-sm w-full px-5"
      >
        <div className="flex gap-3 w-full justify-center items-center">
          <Link href="/draw" className="w-full">
            <Button className="w-full">Draw</Button>
          </Link>
          <Link href="/guess" className="w-full">
            <Button className="w-full">Guess</Button>
          </Link>
        </div>
      </motion.div>

      {/* <motion.div
        initial={{ y: -100 }}
        whileInView={{ y: 0, transition: { duration: 0.5 } }}
        className="flex sm:hidden mt-10 px-5"
      >
        <img src="/assets/image.png" alt="" />
      </motion.div> */}

      <div className="relative flex w-full justify-center px-4 py-12 flex-row gap-0">
        <FeatureCard
          feature={{
            category: "Medium",
            imageUrl: "/assets/hero1.png",
            title: "Heart",
          }}
          initial={{
            x: cardWidth,
            y: yOffset,
            opacity: 0,
            rotate: 0,
            scale: 0.9,
          }}
          animate={{
            x: yOffset,
            y: 10,
            opacity: 1,
            scale: 0.95,
            rotate: -angle,
            transition: {
              type: "spring",
              delay: 0.8,
            },
          }}
        />

        <FeatureCard
          feature={{
            category: "Jugs",
            title: "Turtle",
            imageUrl: "/assets/hero3.png",
          }}
          initial={{
            y: yOffset,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              delay: 0.4,
            },
          }}
          zIndexOffset={1}
        />

        <FeatureCard
          feature={{
            category: "Bottles",
            title: "Amongus",
            imageUrl: "/assets/hero2.png",
          }}
          initial={{
            x: -cardWidth,
            y: yOffset,
            opacity: 0,
            rotate: 0,
            scale: 0.9,
          }}
          animate={{
            x: -yOffset,
            y: 10,
            opacity: 1,
            rotate: angle,
            scale: 0.95,
            transition: {
              type: "spring",
              delay: 0.6,
            },
          }}
        />
      </div>
    </section>
  );
}
