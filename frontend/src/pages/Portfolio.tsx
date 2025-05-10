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
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProfileByUsernameQuery,
  useGetSkillsByUsernameQuery,
} from "../features/user/userApi";

export default function Portofolio() {
  const { username } = useParams<{ username: string }>();
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileByUsernameQuery(username ?? "");
  const {
    data: skills,
    isLoading: isSkillsLoading,
    error: skillsError,
  } = useGetSkillsByUsernameQuery(username ?? "");

  const navigate = useNavigate();
  const theme = useTheme();
  const skillsRef = useRef<HTMLDivElement>(null!);
  const worksRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!isProfileLoading && !profile) {
      navigate("/error/404");
    }
  }, [isProfileLoading, profile, navigate]);

  if (isProfileLoading || isSkillsLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (profileError || skillsError)
    return (
      <Box maxWidth={600} mx="auto" mt={4}>
        <Alert severity="error">
          プロフィールまたはスキルの取得に失敗しました
        </Alert>
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

  const scrollToElement = (
    targetRef: React.RefObject<HTMLElement>,
    offset = 0
  ) => {
    if (targetRef.current && containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const targetTop = targetRef.current.getBoundingClientRect().top;
      const scrollOffset =
        targetTop - containerTop + containerRef.current.scrollTop + offset;
      containerRef.current.scrollTo({ top: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <Box display="flex" height="85vh" overflow="hidden">
      {/* プロフィールセクション */}
      <Box
        sx={{
          width: "20%",
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
          <Typography variant="h5" color="text.primary" gutterBottom>
            Profile
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="h6" color="text.secondary" mb={2}>
            {lastName} {firstName}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "75px 15px 1fr",
              rowGap: 1,
              alignItems: "start",
            }}
          >
            {birthDate && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  生年月日
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatJapaneseDate(birthDate)}
                </Typography>
              </>
            )}

            {school && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  学校
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {school}
                </Typography>
              </>
            )}

            {hobby && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  趣味
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hobby}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Tabs
          value={false}
          orientation="vertical"
          variant="scrollable"
          indicatorColor="primary"
          sx={{ alignSelf: "flex-end" }}
        >
          <Tab
            label="▶ Skills"
            onClick={() => scrollToElement(skillsRef, -16)}
            sx={{ color: theme.palette.primary.main }}
          />
          <Tab
            label="▶ Works"
            onClick={() => scrollToElement(worksRef, -16)}
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
        <Box ref={skillsRef} mb={6}>
          <Typography variant="h5" gutterBottom color="text.primary">
            Skills
          </Typography>
          <Grid container spacing={2}>
            {skills?.map((skill, idx) => (
              <Grid
                key={`skill-${idx}`}
                sx={{ flexBasis: { xs: "100%", sm: "49%" } }}
              >
                <Card
                  sx={{
                    height: 180,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {skill.name}
                    </Typography>
                    <Box mb={2} />
                    <Typography variant="body2" color="text.secondary">
                      {skill.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box ref={worksRef}>
          <Typography variant="h5" gutterBottom color="text.primary">
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
        </Box>
      </Box>
    </Box>
  );
}
