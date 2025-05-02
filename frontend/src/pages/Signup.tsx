import { useState } from 'react';
import { useSignupMutation } from '../features/auth/authApi';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail } from '../features/auth/authSlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup({ email, password }).unwrap();
      dispatch(setEmail(email));
      navigate('/verify');
    } catch (err) {
      console.error('Signup failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" mb={2}>
            アカウント作成
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="メールアドレス"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <TextField
              label="パスワード"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                登録に失敗しました
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
                '登録'
              )}
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" align="center">
              すでにアカウントをお持ちの方は{' '}
              <Link component={RouterLink} to="/login">
                ログイン
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
