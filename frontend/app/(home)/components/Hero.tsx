"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { IMG1, IMG2, IMG3, IMG4, IMG5, IMG6 } from "@/constants/assets";

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const images = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6];

  return (
    <div className="w-full bg-gradient-to-b from-purple-50 to-white">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-7xl mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-2xl mx-4">
                <Image
                  src={src}
                  alt={`Perfume ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white">
                  <h1 className="text-4xl md:text-7xl font-bold mb-4 max-w-3xl">
                    Discover Your Signature Scent
                  </h1>
                  <p className="text-lg md:text-2xl mb-8 max-w-2xl opacity-90">
                    Premium fragrances crafted for those who appreciate elegance
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="/products"
                      className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="#featured"
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
                    >
                      Explore Collection
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-8 hidden md:flex" />
        <CarouselNext className="right-8 hidden md:flex" />
      </Carousel>
    </div>
  );
}
