import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';

function App() {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://the-trivia-api.com/v2/questions?limit=5');
            const data = await response.json();

            const formattedQuestions = data.map((q) => {
                const answers = [...q.incorrectAnswers, q.correctAnswer];
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
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer) => {
        // Prevent changing the answer after the initial selection
        if (selectedAnswers[questionId]) return;

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                Trivia Game
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
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
                                    const isAnswered = !!selectedAnswers[q.id];

                                    return (
                                        <Grid item xs={12} sm={6} key={i}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleAnswerSelect(q.id, answer)}
                                                disabled={isAnswered && !isSelected}
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