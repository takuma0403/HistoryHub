import { useState } from 'react';
import { useLoginMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/auth/authSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const [isSubmitting, setIsSubmitting] = useState(false); // ← 連打防止用

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken(res.token));
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
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
            ログイン
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="メールアドレス"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                ログインに失敗しました
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading || isSubmitting} // ← ローディング中 & 二重送信防止
            >
              {(isLoading || isSubmitting) ? (
                <CircularProgress size={24} />
              ) : (
                'ログイン'
              )}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <MuiLink component={Link} to="/signup" underline="hover">
              アカウントをお持ちでない方はこちら
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
