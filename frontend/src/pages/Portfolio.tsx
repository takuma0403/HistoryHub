import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
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
  useGetWorksByUsernameQuery,
} from "../features/user/userApi";
import BASE_URL from "../constants/api";

export default function Portofolio() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading: isProfileLoading } =
    useGetProfileByUsernameQuery(username ?? "");
  const { data: skills, isLoading: isSkillsLoading } =
    useGetSkillsByUsernameQuery(username ?? "");
  const { data: works, isLoading: isWorksLoading } = useGetWorksByUsernameQuery(
    username ?? ""
  );

  console.log(works);

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

  useEffect(() => {
    if (profile) {
      document.title = `${profile.firstName} ${profile.lastName} のポートフォリオ`;
    }
    return () => {
      document.title = `HistoryHub`; // アンマウント時に元に戻す
    };
  }, [profile]);

  if (isProfileLoading || isSkillsLoading || isWorksLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="primary" />
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
    <Box display="flex" height="90vh" overflow="hidden">
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
          <Typography variant="h5" color="text.secondary" gutterBottom>
            ABOUT
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="h5" color="text.primary" mb={2}>
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
                  color="text.primary"
                  fontWeight="bold"
                >
                  生年月日
                </Typography>
                <Typography variant="body2" color="text.primary">
                  :
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {formatJapaneseDate(birthDate)}
                </Typography>
              </>
            )}

            {school && (
              <>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  学校
                </Typography>
                <Typography variant="body2" color="text.primary">
                  :
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {school}
                </Typography>
              </>
            )}

            {hobby && (
              <>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  趣味
                </Typography>
                <Typography variant="body2" color="text.primary">
                  :
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ whiteSpace: "pre-line" }}
                >
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
            label="▶ Works"
            onClick={() => scrollToElement(worksRef, -16)}
            sx={{ color: theme.palette.primary.main }}
          />
          <Tab
            label="▶ Skills"
            onClick={() => scrollToElement(skillsRef, -16)}
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
        <Box ref={worksRef} mb={6}>
          <Typography variant="h5" gutterBottom color="text.secondary">
            WORKS
          </Typography>
          {works?.map((work, idx) => (
            <Card
              key={`work-${idx}`}
              sx={{
                mb: 2,
                height: "70vh",
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flex: 1, display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {work.name}
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: 210,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: 2,
                        border: "1px solid #ccc",
                        boxShadow: 2,
                      }}
                    >
                      {work.imagePath ? (
                        <Box
                          component="img"
                          src={BASE_URL + work.imagePath}
                          alt={work.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 2,
                            transition: "transform 0.3s",
                            "&:hover": {
                              transform: "scale(1.03)",
                            },
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.primary">
                          No Image
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {work.period && (
                      <Typography variant="body1" color="text.primary">
                        <strong>制作期間：</strong> {work.period}
                      </Typography>
                    )}

                    {work.use && (
                      <Typography variant="body1" color="text.primary">
                        <strong>使用技術：</strong> {work.use}
                      </Typography>
                    )}

                    {work.link &&
                      (() => {
                        try {
                          const urlObj = new URL(work.link);
                          return (
                            <Box
                              sx={{
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                p: 2,
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                backgroundColor: "#fafafa",
                              }}
                            >
                              <Box>
                                <img
                                  src={`https://www.google.com/s2/favicons?domain_url=${urlObj.origin}`}
                                  alt="favicon"
                                  style={{ width: 24, height: 24 }}
                                />
                              </Box>

                              <Box sx={{ overflow: "hidden" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <a
                                    href={work.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: theme.palette.primary.main,
                                    }}
                                  >
                                    {work.link}
                                  </a>
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.primary"
                                  sx={{ wordBreak: "break-all" }}
                                >
                                  {urlObj.hostname}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                  </Box>
                </Box>

                {work.description && (
                  <Box
                    sx={{
                      width: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        px: 2,
                        wordBreak: "break-word",
                      }}
                    >
                      {work.description}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box ref={skillsRef}>
          <Typography variant="h5" gutterBottom color="text.secondary">
            SKILLS
          </Typography>
          <Grid container spacing={2}>
            {skills?.map((skill, idx) => (
              <Grid
                key={`skill-${idx}`}
                sx={{ flexBasis: { xs: "100%", sm: "32%" } }}
              >
                <Card
                  sx={{
                    height: 180,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {skill.name}
                    </Typography>
                    <Box mb={2} />
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                        px: 2,
                        wordBreak: "break-word",
                      }}
                    >
                      {skill.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
