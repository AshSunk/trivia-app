import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';

function App() {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    //Stretch Goal: Tracking the user's running score
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://the-trivia-api.com/v2/questions?limit=5');

            //Catching 500 errors early so the app doesn't hang on a bad JSON parse
            if (!response.ok) {
                throw new Error(`API Server Error: ${response.status}`);
            }

            const data = await response.json();

            const formattedQuestions = data.map((q) => {
                const answers = [...q.incorrectAnswers, q.correctAnswer];
                //Standard sort trick to shuffle the correct answer so it isn't predictably last
                answers.sort(() => Math.random() - 0.5);

                return {
                    id: q.id,
                    questionText: q.question.text,
                    answers: answers,
                    correctAnswer: q.correctAnswer
                };
            });

            setQuestions(formattedQuestions);
        } catch (err) {
            console.error("API failed:", err);
            setError(`Failed to load questions. ${err.message}. Please try refreshing.`);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer, correctAnswer) => {
        //Bail out early if they already answered this specific question
        if (selectedAnswers[questionId]) return;

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));

        if (answer === correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                Trivia Game
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'medium' }}>
                    Current Score: {score}
                </Typography>
            </Box>

            {loading && !error ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center" variant="h6" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            ) : (
                questions.map((q, index) => (
                    <Card key={q.id} sx={{ mb: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {index + 1}. {q.questionText}
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {q.answers.map((answer, i) => {
                                    const isSelected = selectedAnswers[q.id] === answer;
                                    const isCorrect = answer === q.correctAnswer;
                                    const isAnswered = !!selectedAnswers[q.id];

                                    let buttonColor = "primary";
                                    let variant = "outlined";

                                    //Figuring out which buttons to highlight green/red and which to gray out
                                    if (isAnswered) {
                                        if (isSelected) {
                                            buttonColor = isCorrect ? "success" : "error";
                                            variant = "contained";
                                        } else if (isCorrect) {
                                            buttonColor = "success";
                                            variant = "contained";
                                        } else {
                                            buttonColor = "inherit";
                                        }
                                    }

                                    return (
                                        <Grid item xs={12} sm={6} key={i}>
                                            <Button
                                                fullWidth
                                                variant={variant}
                                                color={buttonColor !== "inherit" ? buttonColor : "inherit"}
                                                onClick={() => handleAnswerSelect(q.id, answer, q.correctAnswer)}
                                                disabled={isAnswered && !isSelected && !isCorrect}
                                                sx={{
                                                    textTransform: 'none',
                                                    justifyContent: 'flex-start',
                                                    textAlign: 'left',
                                                    py: 1.5,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {answer}
                                            </Button>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default App;