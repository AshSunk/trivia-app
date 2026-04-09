import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';

function App() {
    const [questions, setQuestions] = useState([]);
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
                //Standard array shuffle
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

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                Trivia Game
            </Typography>
            {/* State is working in the background, UI will render it in the next commit */}
        </Container>
    );
}

export default App;