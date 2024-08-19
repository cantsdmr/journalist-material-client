import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { CreateNewsData } from '../APIs/NewsAPI';
import { useApiContext } from '../contexts/ApiContext';

const CreateOrEditNews: React.FC = () => {
    const [newsData, setNewsData] = useState<CreateNewsData>({
        division_id: '',
        title: '',
        description: '',
        body: '',
        image_url: '',
        video_url: '',
        start_at: new Date(),
        end_at: new Date(),
        tags: [''],
    });
    const { api } = useApiContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setNewsData({
            ...newsData,
            [name as keyof CreateNewsData]: value as string | Date | string[],
        });
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        setNewsData({
            ...newsData,
            [name as keyof CreateNewsData]: value as string | Date | string[],
        });
    };

    const handleAddTag = () => {
        if (newsData.tags.length < 7) {
            setNewsData({
                ...newsData,
                tags: [...newsData.tags, ''],
            });
        }
    };

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...newsData.tags];
        newTags[index] = value;
        setNewsData({
            ...newsData,
            tags: newTags,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newsResult = await api?.newsApi.create(newsData);
        console.log('News Submitted:', newsResult);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
                Create News
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel id="division-label">Division</InputLabel>
                <Select
                    labelId="division-label"
                    name="division_id"
                    value={newsData.division_id}
                    onChange={handleSelectChange}
                >
                    {/* Replace with your actual division options */}
                    <MenuItem value="division1">Division 1</MenuItem>
                    <MenuItem value="division2">Division 2</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Title"
                name="title"
                value={newsData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                name="description"
                value={newsData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Body"
                name="body"
                value={newsData.body}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                label="Image URL"
                name="image_url"
                value={newsData.image_url}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Video URL"
                name="video_url"
                value={newsData.video_url}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Start At"
                name="start_at"
                type="datetime-local"
                value={newsData.start_at.toISOString().slice(0, -1)}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="End At"
                name="end_at"
                type="datetime-local"
                value={newsData.end_at.toISOString().slice(0, -1)}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            {newsData.tags.map((tag, index) => (
                <TextField
                    key={index}
                    label={`Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    fullWidth
                    margin="normal"
                />
            ))}
            {newsData.tags.length < 7 && (
                <Button onClick={handleAddTag}>Add Tag</Button>
            )}
            <Divider sx={{ my: 2 }} />
            <Button type="submit" variant="contained" color="primary">
                Submit News
            </Button>
        </Box>
    );
};

export default CreateOrEditNews;
