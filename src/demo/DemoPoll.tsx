import React, { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    LinearProgress,
} from '@mui/material';

const DemoPoll = () => {
    // Example poll data
    const poll = {
        question: "What is the most pressing global issue today?",
        options: [
            { id: 1, text: "Climate Change", votes: 45 },
            { id: 2, text: "Economic Inequality", votes: 25 },
            { id: 3, text: "Global Conflicts", votes: 30 },
        ],
    };

    // State to track user's selected option and if they voted
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Handle vote submission
    const handleVote = () => {
        if (selectedOption !== null) {
            const updatedOptions = poll.options.map((option) =>
                option.id === selectedOption
                    ? { ...option, votes: option.votes + 1 }
                    : option
            );
            poll.options = updatedOptions;
            setHasVoted(true);
        }
    };

    // Calculate total votes for percentage calculations
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {poll.question}
                    </Typography>
                    {!hasVoted ? (
                        <>
                            <RadioGroup
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(Number(e.target.value) as any)}
                            >
                                {poll.options.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={option.id}
                                        control={<Radio />}
                                        label={option.text}
                                    />
                                ))}
                            </RadioGroup>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={selectedOption === null}
                                onClick={handleVote}
                            >
                                Submit Vote
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Poll Results
                            </Typography>
                            {poll.options.map((option) => (
                                <div key={option.id} style={{ marginBottom: '10px' }}>
                                    <Typography variant="body1">
                                        {option.text}: {((option.votes / totalVotes) * 100).toFixed(1)}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(option.votes / totalVotes) * 100}
                                        style={{ height: '10px', borderRadius: '5px' }}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default DemoPoll;
