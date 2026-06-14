"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl border border-border bg-card shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)] max-w-xs w-full"
              >
                <div className="text-sm leading-relaxed text-foreground/90">{text}</div>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={image}
                    alt={name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="font-display font-semibold tracking-tight leading-5 truncate">{name}</div>
                    <div className="leading-5 text-xs tracking-tight text-muted-foreground truncate">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
