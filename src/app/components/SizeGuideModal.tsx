import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

// Size guide data for different categories
const SIZE_GUIDES = {
  mens: {
    title: "Men's Clothing Size Guide",
    measurements: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Sleeve (in)'],
    data: [
      ['XS', '32-34', '26-28', '32-34', '32'],
      ['S', '34-36', '28-30', '34-36', '33'],
      ['M', '38-40', '32-34', '38-40', '34'],
      ['L', '42-44', '36-38', '42-44', '35'],
      ['XL', '46-48', '40-42', '46-48', '36'],
      ['XXL', '50-52', '44-46', '50-52', '37'],
    ],
  },
  womens: {
    title: "Women's Clothing Size Guide",
    measurements: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    data: [
      ['XS', '30-32', '24-26', '33-35', '28'],
      ['S', '32-34', '26-28', '35-37', '28.5'],
      ['M', '34-36', '28-30', '37-39', '29'],
      ['L', '36-38', '30-32', '39-41', '29.5'],
      ['XL', '38-40', '32-34', '41-43', '30'],
      ['XXL', '40-42', '34-36', '43-45', '30.5'],
    ],
  },
  kids: {
    title: "Kids' Clothing Size Guide",
    measurements: ['Age', 'Height (in)', 'Chest (in)', 'Waist (in)'],
    data: [
      ['2-3 Years', '35-38', '20-21', '20-21'],
      ['4-5 Years', '41-44', '22-23', '21-22'],
      ['6-7 Years', '47-50', '24-25', '22-23'],
      ['8-9 Years', '53-56', '26-27', '23-24'],
      ['10-11 Years', '59-62', '28-29', '24-25'],
      ['12-13 Years', '63-66', '30-32', '25-26'],
    ],
  },
  shoes: {
    title: 'Shoe Size Guide',
    measurements: ['US Size', 'EU Size', 'UK Size', 'Length (in)'],
    data: [
      ['6', '39', '5.5', '9.25'],
      ['7', '40', '6.5', '9.625'],
      ['8', '41', '7', '9.75'],
      ['9', '42', '8', '10.125'],
      ['10', '43', '9', '10.5'],
      ['11', '44', '10', '10.875'],
      ['12', '45', '11', '11.25'],
    ],
  },
};

export function SizeGuideModal({ isOpen, onClose, category = 'mens' }: SizeGuideModalProps) {
  const guideKey = category.toLowerCase().includes('women')
    ? 'womens'
    : category.toLowerCase().includes('kid')
    ? 'kids'
    : category.toLowerCase().includes('shoe') || category.toLowerCase().includes('footwear')
    ? 'shoes'
    : 'mens';

  const guide = SIZE_GUIDES[guideKey];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-card rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{guide.title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Measurement Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  How to Measure
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use a soft measuring tape for accurate measurements</li>
                  <li>• Measure over light clothing for best fit</li>
                  <li>• Keep the tape parallel to the floor</li>
                  <li>• If between sizes, we recommend sizing up</li>
                </ul>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {guide.measurements.map((header, index) => (
                        <th
                          key={index}
                          className="p-3 text-left font-semibold border border-border"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.data.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`p-3 border border-border ${
                              cellIndex === 0 ? 'font-semibold' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Still need help?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our customer service team for personalized sizing recommendations.
                  Available 24/7 via chat, email, or phone.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <button
                onClick={onClose}
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-colors font-semibold"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
