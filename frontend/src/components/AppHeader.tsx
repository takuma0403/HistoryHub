import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Stack,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../features/auth/authSlice";
import { RootState } from "../app/store";


const AppHeader = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 3,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          onClick={handleHomeClick}
          sx={{
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}10`,
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <HomeIcon />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, userSelect: "none" }}
            >
              HistoryHub
            </Typography>
          </Stack>
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {token ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
              },
            }}
          >
            ログアウト
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            startIcon={<LoginIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
              },
            }}
          >
            ログイン
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
