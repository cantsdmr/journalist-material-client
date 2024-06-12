import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface PollOption {
  id: number;
  headline: string;
  text: string;
  order: number;
  imageUrl: string;
  videoUrl: string;
}

const CreatePoll: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: 1, headline: '', text: '', order: 1, imageUrl: 'https://via.placeholder.com/150', videoUrl: '' },
  ]);

  const handleOptionChange = (id: number, key: keyof PollOption, value: string | number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => (option.id === id ? { ...option, [key]: value } : option))
    );
  };

  const addOption = () => {
    if (options.length < 7) {
      setOptions([
        ...options,
        { id: options.length + 1, headline: '', text: '', order: options.length + 1, imageUrl: 'https://via.placeholder.com/150', videoUrl: '' },
      ]);
    }
  };

  const removeOption = (id: number) => {
    setOptions((prevOptions) => prevOptions.filter((option) => option.id !== id));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create a Poll
      </Typography>
      <TextField
        fullWidth
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        margin="normal"
      />
      {options.map((option, index) => (
        <Card key={option.id} sx={{ mt: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  label="Headline"
                  value={option.headline}
                  onChange={(e) => handleOptionChange(option.id, 'headline', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  value={option.order}
                  onChange={(e) => handleOptionChange(option.id, 'order', Number(e.target.value))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  value={option.imageUrl}
                  onChange={(e) => handleOptionChange(option.id, 'imageUrl', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Video URL"
                  value={option.videoUrl}
                  onChange={(e) => handleOptionChange(option.id, 'videoUrl', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <IconButton color="primary" onClick={() => removeOption(option.id)}>
                    <RemoveCircleOutline />
                  </IconButton>
                  {index === options.length - 1 && options.length < 7 && (
                    <IconButton color="primary" onClick={addOption}>
                      <AddCircleOutline />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => {
          console.log('Poll Data:', { question, options });
          // Add your submit logic here
        }}
      >
        Submit Poll
      </Button>
    </Container>
  );
};

export default CreatePoll;
