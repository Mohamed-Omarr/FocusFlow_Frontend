import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export function VideoSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Watch how FocusFlow{' '}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              transforms your focus
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See FocusFlow in action in just 60 seconds
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted border border-border shadow-2xl shadow-primary/20">
            {/* Video Thumbnail Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
              
              {/* Play Button */}
              <motion.button
                className="relative z-10 w-20 h-20 bg-foreground/10 backdrop-blur-md rounded-full flex items-center justify-center border border-border group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-8 h-8 text-foreground ml-1 group-hover:text-primary transition-colors" fill="currentColor" />
              </motion.button>

              {/* Decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 border-2 border-border rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Sample Video Content Text */}
            <div className="absolute bottom-8 left-8">
              <p className="text-foreground/80 text-sm">Product Demo</p>
              <p className="text-foreground">See FocusFlow in action</p>
            </div>
          </div>

          {/* Stats below video */}
          <motion.div
            className="grid grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '50M+', label: 'Focus Minutes' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.p 
                  className="text-3xl font-bold text-foreground mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}