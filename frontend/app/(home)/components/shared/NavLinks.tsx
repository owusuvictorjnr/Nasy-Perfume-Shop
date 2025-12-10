"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="">
      <ul className="flex flex-col md:flex-row md:space-x-8 justify-center items-start md:items-center py-4 md:py-2 uppercase font-medium">
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/">home</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/fine-fragrances">fine fragrances</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/body-hair-face">body-hair-face</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/grooming">grooming</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/home-creations">home creations</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/gifts">gift</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/samples">samples</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/about-us">About Us</Link>
        </li>
        <li className="px-4 py-2 md:p-0 hover:text-blue-400">
          <Link href="/contact-us">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
