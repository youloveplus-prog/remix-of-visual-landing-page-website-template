import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { homeType } from "@/components/home/typography";

const testimonials = [
  {
    text: "The Bangla AI tutor explained recursion better than any teacher. I finally got my first Python project working.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    name: "Ayesha Rahman",
    role: "Python Student, Dhaka",
  },
  {
    text: "Bought the prompt library, and within a week I was earning from freelance writing gigs. Best investment I made.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    name: "Tanvir Hossain",
    role: "Freelancer, Chattogram",
  },
  {
    text: "My daughter loves the 1-on-1 mentor sessions. She actually looks forward to learning now.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    name: "Nusrat Jahan",
    role: "Parent, Sylhet",
  },
  {
    text: "Honest reviews, instant delivery, real value. Asikon is the only learning platform I trust in Bangladesh.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    name: "Mehedi Hasan",
    role: "AI Engineer, Dhaka",
  },
  {
    text: "Earned 500 coins in my first month. The streak system actually keeps me learning every single day.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    name: "Sumaiya Akter",
    role: "ML Beginner, Khulna",
  },
  {
    text: "From zero coding to building my own chatbot in 3 months. The structured tracks are a game changer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    name: "Rakib Mahmud",
    role: "Prompt Engineer",
  },
  {
    text: "The mentor matched my child's learning pace perfectly. We've never seen her this confident.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    name: "Farhana Begum",
    role: "Parent, Rajshahi",
  },
  {
    text: "Bangla + English support is a blessing. I can finally learn without translating every other word.",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
    name: "Hassan Ali",
    role: "Student, Barishal",
  },
  {
    text: "The community keeps me accountable. Real learners, real progress, no fake hype.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    name: "Sana Sheikh",
    role: "Data Analyst",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsColumns({ title = "Loved by learners across Bangladesh" }: { title?: string }) {
  return (
    <section className="section-x">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
        >
          <h2 className={`mt-5 ${homeType.bandTitle}`}>
            {title}
          </h2>
          <p className="text-center mt-4 text-muted-foreground">
            Real stories from learners, parents, and mentors growing with Asikon.
          </p>
        </motion.div>

        {/* Mobile: animated 1-col (xs) / 2-col (sm) */}
        <div className="flex md:hidden justify-center gap-3 mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[480px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden sm:block" duration={19} />
        </div>

        {/* Desktop: animated columns */}
        <div className="hidden md:flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

      </div>
    </section>
  );
}

export default TestimonialsColumns;
