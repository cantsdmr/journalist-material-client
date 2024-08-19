import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Grid, Box, LinearProgress, Avatar, Button, IconButton, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link, useNavigate } from 'react-router-dom';

interface PollOption {
  id: number;
  headline: string;
  text: string;
  order: number;
  imageUrl: string;
  videoUrl: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  totalVotes: number;
  options: PollOption[];
  hasVoted: boolean;
  creatorAvatar: string;
  creatorId: number;
}

const initialPolls: Poll[] = [
  {
    id: 1,
    question: "What's your favorite programming language?",
    totalVotes: 50,
    options: [
      { id: 1, headline: 'JavaScript', text: 'The language of the web', order: 1, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 20 },
      { id: 2, headline: 'Python', text: 'Great for AI and ML', order: 2, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 15 },
      { id: 3, headline: 'Java', text: 'Popular for enterprise applications', order: 3, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 10 },
      { id: 4, headline: 'C++', text: 'Powerful for system programming', order: 4, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 5 },
    ],
    hasVoted: false,
    creatorAvatar: 'https://via.placeholder.com/50',
    creatorId: 1,
  },
  {
    id: 2,
    question: "What's your favorite framework?",
    totalVotes: 40,
    options: [
      { id: 1, headline: 'React', text: 'Library for building user interfaces', order: 1, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 18 },
      { id: 2, headline: 'Angular', text: 'Platform for building mobile and desktop web applications', order: 2, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 12 },
      { id: 3, headline: 'Vue', text: 'Progressive framework for building user interfaces', order: 3, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 7 },
      { id: 4, headline: 'Svelte', text: 'New kid on the block', order: 4, imageUrl: 'https://via.placeholder.com/150', videoUrl: '', votes: 3 },
    ],
    hasVoted: false,
    creatorAvatar: 'https://via.placeholder.com/50',
    creatorId: 2,
  },
];

const PollList: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();
  const isCreator = true; // Replace this with actual logic to determine if the user is a creator

  const handleVote = (pollId: number, optionId: number) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              hasVoted: true,
              totalVotes: poll.totalVotes + 1,
              options: poll.options.map((option) =>
                option.id === optionId ? { ...option, votes: option.votes + 1 } : option
              ),
            }
          : poll
      )
    );
    setSelectedOptions((prev) => ({ ...prev, [pollId]: optionId }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Polls
      </Typography>
      {isCreator && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/app/create-poll')}>
            Create Poll
          </Button>
        </Box>
      )}
      <Grid container spacing={4}>
        {polls.map((poll) => (
          <Grid item xs={12} key={poll.id} sx={{ position: 'relative' }}>
            <Link to={`/profile/${poll.creatorId}`}>
              <Avatar
                src={poll.creatorAvatar}
                sx={{
                  width: 60,
                  height: 60,
                  position: 'absolute',
                  top: 8,
                  left: -70,
                  borderRadius: '10%',
                  border: '2px solid #ddd',
                }}
              />
            </Link>
            <Card sx={{ pl: 8 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {poll.question}
                </Typography>
                {poll.hasVoted ? (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {poll.totalVotes} total votes
                    </Typography>
                    {poll.options.map((option) => (
                      <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={option.imageUrl} alt={option.headline} sx={{ width: 50, height: 50, mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1">{option.headline}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(option.votes / poll.totalVotes) * 100}
                            sx={{ height: 10, borderRadius: 5, mt: 1 }}
                          />
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            {Math.round((option.votes / poll.totalVotes) * 100)}% / {option.votes} votes
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                ) : (
                  poll.options.map((option) => (
                    <Box
                      key={option.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: selectedOptions[poll.id] === option.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.2)' },
                      }}
                      onClick={() => setSelectedOptions({ ...selectedOptions, [poll.id]: option.id })}
                    >
                      <Avatar src={option.imageUrl} alt={option.headline} sx={{ width: 50, height: 50, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">{option.headline}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.text}
                        </Typography>
                      </Box>
                      <IconButton edge="end">
                        {selectedOptions[poll.id] === option.id ? <CheckCircleIcon color="primary" /> : <CheckCircleOutlineIcon />}
                      </IconButton>
                    </Box>
                  ))
                )}
                {!poll.hasVoted && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleVote(poll.id, selectedOptions[poll.id])}
                    disabled={!selectedOptions[poll.id]}
                  >
                    Vote
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PollList;
