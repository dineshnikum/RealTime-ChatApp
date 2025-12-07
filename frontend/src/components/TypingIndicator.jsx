import { motion } from 'framer-motion';

const TypingIndicator = ({ userName }) => {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{userName} is typing</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2 w-2 rounded-full bg-muted-foreground"
              animate={{
                y: ['0%', '-50%', '0%'],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

