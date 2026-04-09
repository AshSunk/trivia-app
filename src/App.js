import React from 'react';
import { Container, Typography } from '@mui/material';

function App() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                Trivia Game
            </Typography>
        </Container>
    );
}

export default App;