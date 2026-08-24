import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChoiceGrid from './ChoiceGrid.jsx';
import FillTiles from './FillTiles.jsx';
import TrueFalse from './TrueFalse.jsx';
import MatchPairs from './MatchPairs.jsx';
import BaseTenBuilder from '../simulate/BaseTenBuilder.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { getRandomCorrectFeedback, getRandomIncorrectFeedback } from '../../utils/narration.js';
import './QuestionCard.css';

const TYPE_INFO = {
  mcq:        { label: 'Multiple Choice', icon: '🔤', color: '#A78BFA' },
  fillTiles:  { label: 'Fill in Blanks',  icon: '✏️', color: '#6EE7B7' },
  trueFalse:  { label: 'True or False',   icon: '⚖️', color: '#FCD34D' },
  matchPairs: { label: 'Match Pairs',     icon: '🔗', color: '#F9A8D4' },
  buildIt:    { label: 'Build It!',       icon: '🧱', color: '#6366F1' },
};

const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard', 'Challenge'];
const DIFFICULTY_COLORS = ['', '#6EE7B7', '#FCD34D', '#FCA5A5', '#F9A8D4'];

export default function QuestionCard({ question, questionNum, totalQuestions, onCorrect, onIncorrect }) {
  const [answered,  setAnswered]  = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const typeInfo = TYPE_INFO[question.type] || TYPE_INFO.mcq;

  // Stop audio when this question card unmounts (new question replaces it)
  useEffect(() => {
    return () => stopNarration();
  }, []);

  function handleAnswer(correct) {
    if (answered) return;
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      narrate(getRandomCorrectFeedback());
      setTimeout(onCorrect, 1800);
    } else {
      narrate(getRandomIncorrectFeedback());
    }
  }

  return (
    <motion.div
      className="qcard glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Meta row */}
      <div className="qcard-meta">
        <span className="qcard-type-pill" style={{ background: typeInfo.color + '22', color: typeInfo.color, borderColor: typeInfo.color + '44' }}>
          {typeInfo.icon} {typeInfo.label}
        </span>
        <span className="qcard-difficulty" style={{ color: DIFFICULTY_COLORS[question.difficulty] }}>
          {'★'.repeat(question.difficulty)} {DIFFICULTY_LABELS[question.difficulty]}
        </span>
        <span className="qcard-num">Q{questionNum}/{totalQuestions}</span>
      </div>

      {/* Prompt */}
      <div className="qcard-prompt">
        <p>{question.prompt}</p>
      </div>

      {/* Interaction zone */}
      <div className="qcard-interact">
        {question.type === 'mcq' && (
          <ChoiceGrid
            options={question.options}
            correctIndex={question.correctIndex}
            onAnswer={handleAnswer}
            disabled={answered}
          />
        )}
        {question.type === 'fillTiles' && (
          <FillTiles
            number={question.number}
            correctValues={question.correctValues}
            onAnswer={handleAnswer}
            disabled={answered}
          />
        )}
        {question.type === 'trueFalse' && (
          <TrueFalse
            correctAnswer={question.correctAnswer}
            onAnswer={handleAnswer}
            disabled={answered}
          />
        )}
        {question.type === 'matchPairs' && (
          <MatchPairs
            pairs={question.pairs}
            onAnswer={handleAnswer}
            disabled={answered}
          />
        )}
        {question.type === 'buildIt' && (
          <BaseTenBuilder targetNumber={question.number} onSuccess={() => handleAnswer(true)} />
        )}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answered && (
          <motion.div
            className={`qcard-explain ${isCorrect ? 'qcard-explain--correct' : 'qcard-explain--wrong'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="qe-icon">{isCorrect ? '🌟' : '💡'}</div>
            <p className="qe-text">{question.explanation}</p>
            {!isCorrect && (
              <button className="btn-primary qe-next" onClick={onIncorrect}>
                Next Question →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
