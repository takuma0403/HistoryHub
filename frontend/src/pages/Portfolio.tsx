import { useEffect } from "react";
import { useGetProfileByUsernameQuery } from "../features/user/userApi";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function Portofolio() {
  const { username } = useParams<{ username: string }>();
  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileByUsernameQuery(username ?? "");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/error/404");
    }
  }, [isLoading, profile, navigate]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (error)
    return (
      <Box maxWidth={600} mx="auto" mt={4}>
        <Alert severity="error">プロフィールの取得に失敗しました</Alert>
      </Box>
    );

  if (!profile) return null;

  const { firstName, lastName, birthDate, school, hobby } = profile;

  const formatJapaneseDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Box display="flex" height="85vh" overflow="hidden">
      {/* 左：プロフィール（固定） */}
      <Box
        sx={{
          width: "35%",
          minWidth: 200,
          flexShrink: 0,
          height: "100%",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          p: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom color="text.primary">
              {lastName} {firstName}
            </Typography>
            <Grid container spacing={2} mt={1}>
              {birthDate && (
                <Typography variant="body2" color="text.secondary">
                  <strong>生年月日:</strong> {formatJapaneseDate(birthDate)}
                </Typography>
              )}
              {school && (
                <Typography variant="body2" color="text.secondary">
                  <strong>学校:</strong> {school}
                </Typography>
              )}
              {hobby && (
                <Typography variant="body2" color="text.secondary">
                  <strong>趣味:</strong> {hobby}
                </Typography>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* 右：スクロールエリア */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          p: 2,
          pr: 1,
          backgroundColor: theme.palette.background.default,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {/* Skills */}
        <Typography variant="h6" gutterBottom color="text.primary">
          Skills
        </Typography>
        {[...Array(5)].map((_, i) => (
          <Card
            key={`skill-${i}`}
            sx={{
              mb: 2,
              height: 150,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                Skill #{i + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                スキルの説明です（スクロール確認用）
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Works */}
        <Typography variant="h6" gutterBottom color="text.primary">
          Works
        </Typography>
        {[...Array(5)].map((_, i) => (
          <Card
            key={`work-${i}`}
            sx={{
              mb: 2,
              height: 200,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                Work #{i + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                作品の説明です（スクロール確認用）
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
