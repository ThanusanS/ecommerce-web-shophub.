import { Link } from 'react-router';
import { motion } from 'motion/react';

interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
}

export function CategoryCard({ name, image, link }: CategoryCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Link to={link}>
        <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-foreground">{name}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
