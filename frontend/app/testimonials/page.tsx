import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Hear what our clients have to say about their experience working with us.",
};

const testimonials = [
  {
    quote:
      "Working with this team has completely transformed our business. Their attention to detail and commitment to quality is unmatched. We couldn’t be happier with the results.",
    name: "Sarah Johnson",
    role: "CTO, TechNova",
    initials: "SJ",
  },
  {
    quote:
      "The dashboard they built for us is lightning fast and incredibly intuitive. Our team’s productivity has soared since we rolled it out. Highly recommended!",
    name: "Marcus Williams",
    role: "Founder, Startly",
    initials: "MW",
  },
  {
    quote:
      "From the initial consultation to the final delivery, the process was seamless. They truly understand modern web development and deliver on their promises.",
    name: "Elena Rodriguez",
    role: "VP of Product, ScaleUp",
    initials: "ER",
  },
  {
    quote:
      "Their ability to translate complex requirements into a sleek, user-friendly interface is remarkable. I’ve already referred them to several colleagues.",
    name: "David Chen",
    role: "Engineering Manager, DataSphere",
    initials: "DC",
  },
  {
    quote:
      "Professional, responsive, and incredibly talented. The project was delivered ahead of schedule, and the code quality is top-notch. A pleasure to work with.",
    name: "Priya Patel",
    role: "Creative Director, Lumio",
    initials: "PP",
  },
  {
    quote:
      "I was amazed by how quickly they understood our vision and turned it into reality. The design and performance exceeded our expectations in every way.",
    name: "Alex Thompson",
    role: "CEO, BrightPath",
    initials: "AT",
  },
];

export default function TestimonialsPage() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            What Our Clients Say
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from our satisfied customers about their experience working
            with us.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium text-lg">
                  {testimonial.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <blockquote className="mt-2 flex-1">
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}