import { useState } from 'react';
import { useVerifyMutation } from '../features/auth/authApi';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.auth.email);
  const [verify, { isLoading, error }] = useVerifyMutation();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('メールアドレスが未設定です。先にサインアップしてください。');
      navigate('/signup');
      return;
    }

    setIsSubmitting(true);
    try {
      await verify({ email, code }).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Verify failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="85vh"
      bgcolor="background.default"
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" mb={2}>
            認証コードの確認
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="認証コード"
              type="text"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                認証に失敗しました
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) ? (
                <CircularProgress size={24} />
              ) : (
                '認証する'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
