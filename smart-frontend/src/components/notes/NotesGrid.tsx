import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Chip,
} from '@mui/material';
import { NoteCard } from './NoteCard.tsx';
import { notesApi } from '../../api/notes.ts';
import { Note, Tag } from '../../types/notes';

export const NotesGrid: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState('-created_at');

  useEffect(() => {
    loadNotes();
    loadTags();
  }, []);

  useEffect(() => {
    loadNotes();
  }, [selectedTags, subject, topic, searchQuery, sorting]);

  const loadNotes = async () => {
    try {
      const params = {
        tags: selectedTags.map(tag => tag.id.toString()),
        subject: subject || undefined,
        topic: topic || undefined,
        search: searchQuery || undefined,
        ordering: sorting,
      };
      const data = await notesApi.getAllNotes(params);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadTags = async () => {
    try {
      const data = await notesApi.getAllTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleVote = async (id: number, value: 1 | -1) => {
    try {
      await notesApi.voteNote(id, value);
      loadNotes(); // Reload notes to get updated vote count
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleNoteView = (note: Note) => {
    // Implement note view logic (e.g., open modal or navigate to detail page)
    console.log('View note:', note);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          mb: 4,
          mt: 2,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(6, 1fr)',
            },
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: { xs: '1/-1', md: 'span 2' } }}>
            <TextField
              fullWidth
              label="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1/-1', sm: 'span 1', md: 'span 1' } }}>
            <TextField
              fullWidth
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1/-1', sm: 'span 1', md: 'span 1' } }}>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1/-1', sm: 'span 1', md: 'span 1' } }}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sorting}
                label="Sort by"
                onChange={(e) => setSorting(e.target.value)}
              >
                <MenuItem value="-created_at">Newest first</MenuItem>
                <MenuItem value="created_at">Oldest first</MenuItem>
                <MenuItem value="-votes">Most voted</MenuItem>
                <MenuItem value="-view_count">Most viewed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ gridColumn: { xs: '1/-1', sm: 'span 1', md: 'span 1' } }}>
            <Autocomplete
              multiple
              value={selectedTags}
              onChange={(_, newValue) => setSelectedTags(newValue)}
              options={tags}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Select tags" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {notes.map((note) => (
          <Box key={note.id}>
            <NoteCard
              note={note}
              onVote={handleVote}
              onView={handleNoteView}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};
