import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content:
      "FocusFlow helped me achieve 3+ hours of deep work daily. The AI insights are game-changing for understanding my productivity patterns.",
    avatar: "👩‍💻",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    role: "Graduate Student",
    content:
      "Finally, a productivity app that doesn't stress me out. The gentle reminders and streak system keep me motivated without pressure.",
    avatar: "👨‍🎓",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Content Creator",
    content:
      "The focus sessions feature is amazing! I've built a consistent writing habit and my productivity has doubled in just 2 months.",
    avatar: "✍️",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section-wrapper">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container-wrapper">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading-two">
            Loved by{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              productivity enthusiasts
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who transformed their focus and productivity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-container-lg">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:border-border/50 group-hover:shadow-xl group-hover:shadow-accent/10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex flex-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary  flex-center-all text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-foreground">{testimonial.name}</p>
                    <p className="small-muted-text">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
