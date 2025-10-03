import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Button,
  Stack,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Visibility,
  Download,
} from '@mui/icons-material';
import { Note } from '../../types/notes';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onVote: (id: number, value: 1 | -1) => void;
  onView: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onVote, onView }) => {
  const handleVote = (value: 1 | -1) => {
    onVote(note.id, value);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, rgba(104, 85, 224, 0.7), rgba(104, 85, 224, 0.3))',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover': {
          '&::before': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {note.title}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {note.subject} - {note.topic}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {note.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {note.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              sx={{ marginBottom: 1 }}
            />
          ))}
        </Stack>

        {note.file && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              File: {note.file_type} ({formatFileSize(note.file_size)})
            </Typography>
            <Button
              startIcon={<Download />}
              size="small"
              href={note.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              color={note.user_vote === 1 ? 'primary' : 'default'}
              onClick={() => handleVote(1)}
            >
              <ThumbUp />
            </IconButton>
            <Typography variant="body2">{note.vote_count}</Typography>
            <IconButton
              size="small"
              color={note.user_vote === -1 ? 'primary' : 'default'}
              onClick={() => handleVote(-1)}
            >
              <ThumbDown />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography variant="body2">{note.view_count}</Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            By {note.user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};