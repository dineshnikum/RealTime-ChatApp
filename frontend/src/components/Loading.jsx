import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-4 w-4 rounded-full bg-primary"
            animate={{
              y: ['0%', '-50%', '0%'],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;

