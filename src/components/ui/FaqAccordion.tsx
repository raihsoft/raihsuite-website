"use client";

import { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 bg-white/[0.03] backdrop-blur rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-6 text-white text-left font-bold text-base sm:text-lg hover:text-purple-300 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span
          className={`shrink-0 rounded-full bg-white/5 border border-white/10 p-2 text-purple-400 transition-all duration-300 ${
            isOpen ? "rotate-180 bg-purple-500/20 text-purple-300" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 pt-4 text-sm sm:text-base leading-relaxed text-white/70 border-t border-white/10">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FaqAccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <FaqItem
          key={index}
          question={item.question}
          answer={item.answer}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
