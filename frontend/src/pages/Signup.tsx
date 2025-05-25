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
  Link as MuiLink,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail } from '../features/auth/authSlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel htmlFor="password">パスワード</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="パスワード"
              />
            </FormControl>
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
                '作成'
              )}
            </Button>
          </Box>
          <Box mt={2}>
            <MuiLink component={Link} to="/login" underline="hover">
              すでにアカウントお持ちの方はこちら
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
