import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const questions = [
  {
    id: 1,
    question: "Quel est le principal avantage du programme NIRD ?",
    options: [
      "Augmenter les coûts de licence",
      "Démocratiser l'accès au numérique pour tous les élèves",
      "Utiliser uniquement des logiciels propriétaires",
      "Augmenter la consommation énergétique"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Quelle technologie utilise principalement le NIRD ?",
    options: [
      "Logiciels propriétaires exclusifs",
      "Logiciels libres et open-source",
      "Technologies obsolètes",
      "Systèmes fermés"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Quel est l'impact environnemental du NIRD ?",
    options: [
      "Augmentation de l'empreinte carbone",
      "Aucun impact",
      "Réduction de l'empreinte carbone",
      "Impact neutre"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Combien de temps dure l'accompagnement personnalisé ?",
    options: [
      "1 mois",
      "3 mois",
      "6 mois",
      "12 mois"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Quel principe le NIRD respecte-t-il ?",
    options: [
      "Dépendance aux fournisseurs",
      "Souveraineté numérique nationale",
      "Exclusivité commerciale",
      "Propriété fermée"
    ],
    correctAnswer: 1
  }
];

const QuizCard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    setAnsweredQuestions([...answeredQuestions, {
      questionId: questions[currentQuestion].id,
      correct: isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "🎉 Bravo !",
        description: "Bonne réponse !",
        duration: 2000,
      });
    } else {
      toast({
        title: "😅 Oups !",
        description: "Ce n'est pas la bonne réponse.",
        variant: "destructive",
        duration: 2000,
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions([]);
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 border-4 border-purple-400 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-4xl font-black text-gray-800 mb-2">
            Quiz du Village NIRD
          </h2>
          <p className="text-lg text-gray-600 font-semibold">
            Testez vos connaissances !
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-600">
                    Question {currentQuestion + 1} / {questions.length}
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    Score: {score}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border-3 font-semibold text-left transition-all duration-300 ${
                        selectedAnswer === null
                          ? 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          : selectedAnswer === index
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : 'bg-red-100 border-red-500'
                          : index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer !== null && (
                          <span>
                            {index === questions[currentQuestion].correctAnswer ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : selectedAnswer === index ? (
                              <XCircle className="w-6 h-6 text-red-600" />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
              </motion.div>
              
              <h3 className="text-4xl font-black text-gray-800 mb-4">
                Quiz terminé !
              </h3>
              
              <p className="text-3xl font-bold mb-8 text-purple-600">
                Votre score : {score} / {questions.length}
              </p>
              
              <p className="text-xl text-gray-700 mb-8 font-semibold">
                {score === questions.length
                  ? "🎉 Parfait ! Vous êtes un expert NIRD !"
                  : score >= questions.length * 0.6
                  ? "👏 Bien joué ! Vous connaissez bien le NIRD !"
                  : "💪 Continuez à explorer le village NIRD !"}
              </p>
              
              <Button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Recommencer le quiz
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default QuizCard;