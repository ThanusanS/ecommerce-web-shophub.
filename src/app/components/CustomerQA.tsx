import { useState } from 'react';
import { MessageCircle, ThumbsUp, User } from 'lucide-react';
import { motion } from 'motion/react';

interface QA {
  id: string;
  question: string;
  answer: string;
  questionAuthor: string;
  answerAuthor: string;
  questionDate: string;
  answerDate: string;
  helpful: number;
}

// Mock Q&A data
const MOCK_QA: QA[] = [
  {
    id: '1',
    question: 'What is the material quality like?',
    answer: 'The material is excellent quality, very durable and comfortable. I\'ve been using it for 3 months with no issues.',
    questionAuthor: 'Sarah M.',
    answerAuthor: 'John D.',
    questionDate: '2026-02-15',
    answerDate: '2026-02-16',
    helpful: 24,
  },
  {
    id: '2',
    question: 'Does this come with a warranty?',
    answer: 'Yes, it comes with a 1-year manufacturer warranty. You can also purchase extended warranty at checkout.',
    questionAuthor: 'Mike R.',
    answerAuthor: 'Customer Service',
    questionDate: '2026-02-10',
    answerDate: '2026-02-10',
    helpful: 18,
  },
  {
    id: '3',
    question: 'Is this compatible with other brands?',
    answer: 'Yes, it works with most major brands. I use it with multiple devices without any problems.',
    questionAuthor: 'Emily T.',
    answerAuthor: 'Alex K.',
    questionDate: '2026-02-05',
    answerDate: '2026-02-06',
    helpful: 15,
  },
];

export function CustomerQA() {
  const [qaList, setQaList] = useState<QA[]>(MOCK_QA);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const handleAskQuestion = () => {
    if (newQuestion.trim()) {
      const newQA: QA = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: '',
        questionAuthor: 'You',
        answerAuthor: '',
        questionDate: new Date().toISOString().split('T')[0],
        answerDate: '',
        helpful: 0,
      };
      setQaList([newQA, ...qaList]);
      setNewQuestion('');
      setShowAskQuestion(false);
    }
  };

  const handleHelpful = (id: string) => {
    if (!helpfulClicked.has(id)) {
      setHelpfulClicked(new Set(helpfulClicked).add(id));
      setQaList(qaList.map(qa => 
        qa.id === id ? { ...qa, helpful: qa.helpful + 1 } : qa
      ));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-accent" />
          <h3 className="text-xl font-bold">Customer Questions & Answers</h3>
        </div>
        <button
          onClick={() => setShowAskQuestion(!showAskQuestion)}
          className="text-accent hover:text-accent/80 font-semibold text-sm transition-colors"
        >
          {showAskQuestion ? 'Cancel' : 'Ask a Question'}
        </button>
      </div>

      {/* Ask Question Form */}
      {showAskQuestion && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-muted rounded-lg"
        >
          <label className="block text-sm font-semibold mb-2">
            Your Question
          </label>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to know about this product?"
            className="w-full p-3 border border-border rounded-lg bg-card resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAskQuestion}
              disabled={!newQuestion.trim()}
              className="bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 text-[#0F1111] font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Submit Question
            </button>
            <button
              onClick={() => {
                setShowAskQuestion(false);
                setNewQuestion('');
              }}
              className="border border-border hover:bg-muted px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Q&A List */}
      <div className="space-y-6">
        {qaList.map((qa, index) => (
          <motion.div
            key={qa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-border last:border-0 pb-6 last:pb-0"
          >
            {/* Question */}
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Q: {qa.question}</p>
                  <p className="text-xs text-muted-foreground">
                    {qa.questionAuthor} • {qa.questionDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer */}
            {qa.answer && (
              <div className="ml-11 bg-muted rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">A: {qa.answer}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {qa.answerAuthor} • {qa.answerDate}
                    </p>
                    
                    {/* Helpful Button */}
                    <button
                      onClick={() => handleHelpful(qa.id)}
                      disabled={helpfulClicked.has(qa.id)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ThumbsUp className={`h-4 w-4 ${helpfulClicked.has(qa.id) ? 'fill-accent text-accent' : ''}`} />
                      <span>Helpful ({qa.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Answer Yet */}
            {!qa.answer && (
              <div className="ml-11 text-sm text-muted-foreground italic">
                Waiting for an answer...
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* View More */}
      {qaList.length > 3 && (
        <div className="mt-6 text-center">
          <button className="text-accent hover:text-accent/80 font-semibold text-sm transition-colors">
            See all {qaList.length} questions
          </button>
        </div>
      )}
    </div>
  );
}
