import { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  useTheme,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProfileByUsernameQuery } from "../features/user/userApi";

export default function Portofolio() {
  const { username } = useParams<{ username: string }>();
  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileByUsernameQuery(username ?? "");
  const navigate = useNavigate();
  const theme = useTheme();

  const skillsRef = useRef<HTMLDivElement>(null!);
  const worksRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

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
      {/* プロフィールセクション */}
      <Box
        sx={{
          width: "30%",
          minWidth: 240,
          flexShrink: 0,
          height: "100%",
          p: 3,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box display="flex" flexDirection="column" alignItems="left" mb={2}>
            <Typography variant="h5" color="text.primary">
              {lastName} {firstName}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box>
            {birthDate && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                <strong>生年月日:</strong> {formatJapaneseDate(birthDate)}
              </Typography>
            )}
            {school && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                <strong>学校:</strong> {school}
              </Typography>
            )}
            {hobby && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                <strong>趣味:</strong> {hobby}
              </Typography>
            )}
          </Box>
        </Box>

        <Tabs
          value={false}
          orientation="vertical"
          variant="scrollable"
          indicatorColor="primary"
        >
          <Tab
            label="▶ Skills"
            onClick={() =>
              skillsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            sx={{ color: theme.palette.primary.main }}
          />
          <Tab
            label="▶ Works"
            onClick={() =>
              worksRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            sx={{ color: theme.palette.primary.main }}
          />
        </Tabs>
      </Box>

      {/* スクロールセクション */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          p: 3,
          backgroundColor: theme.palette.background.default,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "4px",
          },
        }}
      >
        <div ref={skillsRef}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Skills
          </Typography>
          {[...Array(5)].map((_, i) => (
            <Card
              key={`skill-${i}`}
              sx={{
                mb: 2,
                height: 150,
                backgroundColor: theme.palette.background.paper,
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
        </div>

        <div ref={worksRef}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Works
          </Typography>
          {[...Array(5)].map((_, i) => (
            <Card
              key={`work-${i}`}
              sx={{
                mb: 2,
                height: 200,
                backgroundColor: theme.palette.background.paper,
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
        </div>
      </Box>
    </Box>
  );
}
