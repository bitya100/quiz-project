import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, Paper, LinearProgress, Zoom, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Confetti from "react-confetti"; 
import quizService from "../services/quizService";
import resultService from "../services/resultService";

const audioCorrect = new Audio('/music/correct.mp3');
const audioWrong = new Audio('/music/false.mp3');
const audioVictory = new Audio('/music/applause.mp3');

const playSound = (type) => {
  try {
    let audio;
    if (type === 'correct') { audioCorrect.currentTime = 0; audio = audioCorrect; }
    else if (type === 'wrong') { audioWrong.currentTime = 0; audio = audioWrong; }
    else if (type === 'victory') { audioVictory.currentTime = 0; audio = audioVictory; }
    if (audio) audio.play().catch(e => console.warn("Audio play blocked", e));
  } catch (err) {
    console.error("Audio error", err);
  }
};

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);

  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      } catch (err) { console.error(err); }
    };
    fetchQuiz();
    
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (!quiz || showScore) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (delayRef.current) clearTimeout(delayRef.current);

    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(20);

    const currentQ = quiz.questions[currentQuestion];
    if (currentQ) {
      setCorrectAnswerText(currentQ.options[currentQ.correctAnswer]);
      setShuffledOptions([...currentQ.options].sort(() => Math.random() - 0.5));
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

  }, [quiz, currentQuestion, showScore]);

  useEffect(() => {
    if (timeLeft === 0 && selectedAnswer === null && !showScore) {
      handleTimeOut();
    }
  }, [timeLeft, selectedAnswer, showScore]);

  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(-1); 
    setIsCorrect(false);
    playSound('wrong');
    
    delayRef.current = setTimeout(() => {
      advanceQuestion(score);
    }, 2000);
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null || timeLeft === 0) return; 
    
    if (timerRef.current) clearInterval(timerRef.current); 

    const clickedText = shuffledOptions[index];
    const correct = clickedText === correctAnswerText;

    setSelectedAnswer(index);
    setIsCorrect(correct);
    
    let newScore = score;
    if (correct) {
      newScore = score + 1;
      setScore(newScore);
      playSound('correct');
    } else {
      playSound('wrong'); 
    }

    delayRef.current = setTimeout(() => {
      advanceQuestion(newScore);
    }, 1500);
  };

  const advanceQuestion = (currentScore) => {
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz(currentScore);
    }
  };

  const finishQuiz = async (finalScore) => {
    setShowScore(true);
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('victory'); 
    try {
      await resultService.saveResult({
        quizId: quiz._id,
        quizTitle: quiz.title,
        score: finalScore,
        totalQuestions: quiz.questions.length
      });
    } catch (err) { console.error("Error saving result", err); }
  };

  if (!quiz) return <LinearProgress sx={{ color: '#40e0d0', mt: 10 }} />;

  const isPerfectScore = score === quiz.questions.length;

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center', pb: 5 }}>
      
      {showScore && isPerfectScore && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          recycle={false}
          numberOfPieces={400} 
        />
      )}

      {showScore ? (
        <Zoom in={true}>
          <Paper elevation={10} sx={{ p: 5, borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'white', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h3" gutterBottom sx={{ color: '#40e0d0', fontWeight: 'bold' }}>
              {isPerfectScore ? 'מושלם! 🏆' : 'סיימת!'}
            </Typography>
            <Typography variant="h2" sx={{ color: '#40e0d0', mb: 2 }}>{Math.round((score / quiz.questions.length) * 100)}%</Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>ענית נכון על {score} מתוך {quiz.questions.length}</Typography>
            <Button variant="contained" fullWidth onClick={() => navigate('/quizzes')} sx={{ bgcolor: '#40e0d0', color: '#020617', fontWeight: 'bold', '&:hover': { bgcolor: '#00c1ab' } }}>חזרה לתפריט</Button>
          </Paper>
        </Zoom>
      ) : (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ 
              color: timeLeft <= 5 ? '#f44336' : '#40e0d0', 
              fontWeight: 'bold',
              background: 'rgba(0,0,0,0.5)',
              px: 2, py: 0.5, borderRadius: 2,
              border: `2px solid ${timeLeft <= 5 ? '#f44336' : '#40e0d0'}`
            }}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </Typography>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: '#40e0d0', mb: 1 }}>שאלה {currentQuestion + 1} מתוך {quiz.questions.length}</Typography>
              <LinearProgress variant="determinate" value={((currentQuestion + 1) / quiz.questions.length) * 100} sx={{ width: 150, height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#40e0d0' } }} />
            </Box>
          </Box>

          <Paper sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: 'white' }}>
            {/* התיקון כאן: הוספת הקידומת http://localhost:3001 במקרה והתמונה מתיקיית ההעלאות */}
            {quiz.questions[currentQuestion]?.image && (
              <CardMedia 
                component="img" 
                image={
                  quiz.questions[currentQuestion].image.startsWith('/uploads') 
                    ? `http://localhost:3001${quiz.questions[currentQuestion].image}` 
                    : quiz.questions[currentQuestion].image
                } 
                sx={{ borderRadius: 2, mb: 3, maxHeight: 250, objectFit: 'contain' }} 
              />
            )}
            
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>{quiz.questions[currentQuestion]?.questionText}</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {shuffledOptions.map((option, index) => {
                const isThisOptionCorrect = option === correctAnswerText;
                let btnColor = 'rgba(64, 224, 208, 0.3)';
                let bgColor = 'transparent';
                let Icon = null;

                if (selectedAnswer !== null) { 
                  if (selectedAnswer === index) {
                    btnColor = isCorrect ? '#4caf50' : '#f44336';
                    bgColor = isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
                    Icon = isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
                  } else if (isThisOptionCorrect) {
                    btnColor = '#4caf50';
                    bgColor = 'rgba(76, 175, 80, 0.1)';
                    Icon = <CheckCircleIcon color="success" />;
                  }
                }

                return (
                  <Button key={index} variant="outlined" fullWidth onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswer !== null} 
                    sx={{ 
                      p: 2, color: 'white', 
                      borderColor: btnColor, 
                      bgcolor: bgColor,
                      '&:disabled': { color: 'white', opacity: selectedAnswer === index || isThisOptionCorrect ? 1 : 0.5 }
                    }}
                    startIcon={Icon}>
                    {option}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default QuizPage;