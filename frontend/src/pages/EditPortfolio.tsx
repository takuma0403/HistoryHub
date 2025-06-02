import { useEffect, useRef, useState, Fragment } from "react";
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
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetWorksByUsernameQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} from "../features/user/userApi";
import type { SkillResponse, WorkResponse } from "../features/user/types";
import BASE_URL from "../constants/api";
export default function EditPortfolio() {
  const { username } = useParams<{ username: string }>();
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const {
    data: skills,
    isLoading: isSkillsLoading,
    refetch: refetchSkills,
  } = useGetSkillsQuery();

  const {
    data: works,
    isLoading: isWorksLoading,
    refetch: refetchWorks,
  } = useGetWorksByUsernameQuery(username ?? "");

  const [updateProfile] = useUpdateProfileMutation();
  const [createSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [createWork] = useCreateWorkMutation();
  const [updateWork] = useUpdateWorkMutation();
  const [deleteWork] = useDeleteWorkMutation();

  const [editableProfile, setEditableProfile] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    school: "",
    hobby: "",
  });

  const [editableSkills, setEditableSkills] = useState<SkillResponse[]>([]);
  const [editableWorks, setEditableWorks] = useState<
    (WorkResponse & { file?: File | null })[]
  >([]);
  const [previewImages, setPreviewImages] = useState<Record<string, string>>(
    {}
  );

  const navigate = useNavigate();
  const theme = useTheme();
  const skillsRef = useRef<HTMLDivElement>(null!);
  const worksRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (!isProfileLoading && !profile) {
      navigate("/error/404");
    } else if (profile) {
      setEditableProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthDate: profile.birthDate.slice(0, 10),
        school: profile.school,
        hobby: profile.hobby,
      });
    }
  }, [profile, isProfileLoading, navigate]);

  useEffect(() => {
    if (profile) {
      document.title = `[編集中] ${profile.lastName} ${profile.firstName} のポートフォリオ`;
    }
    return () => {
      document.title = `HistoryHub`; // アンマウント時に元に戻す
    };
  }, [profile]);

  useEffect(() => {
    if (skills) {
      setEditableSkills(skills);
    }
  }, [skills]);

  useEffect(() => {
    if (works)
      setEditableWorks(
        works.map((w) => ({
          ...w,
          file: null,
        }))
      );
  }, [works]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchProfile();
        refetchSkills();
        refetchWorks();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchProfile, refetchSkills, refetchWorks]);

  if (isProfileLoading || isSkillsLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!profile) return null;

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

  const handleProfileChange = (
    field: keyof typeof editableProfile,
    value: string
  ) => {
    setEditableProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setEditableSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleWorkChange = (
    id: string,
    field: keyof Omit<WorkResponse, "id" | "userId" | "imagePath">,
    value: string
  ) => {
    setEditableWorks((prev) =>
      prev.map((work) => (work.id === id ? { ...work, [field]: value } : work))
    );
  };

  const handleImageChange = (id: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImages((prev) => ({ ...prev, [id]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    setEditableWorks((prev) =>
      prev.map((work) => (work.id === id ? { ...work, file } : work))
    );
  };

  const handleUpdateProfile = async () => {
    await updateProfile({
      ...editableProfile,
      birthDate: new Date(editableProfile.birthDate).toISOString(),
    }).unwrap();
    await refetchProfile();
  };

  const handleUpdateSkill = async (skill: SkillResponse) => {
    await updateSkill(skill).unwrap();
    await refetchSkills();
  };

  const handleDeleteSkill = async (skill: SkillResponse) => {
    await deleteSkill(skill).unwrap();
    await refetchSkills();
  };

  const handleAddSkill = async () => {
    await createSkill({
      name: "",
      description: "",
      isMainSkill: false,
    }).unwrap();
    await refetchSkills();
  };

  const handleAddWork = async () => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("description", "");
    formData.append("link", "");
    formData.append("period", "");
    formData.append("use", "");
    await createWork(formData).unwrap();
    await refetchWorks();
  };

  const handleUpdateWork = async (
    work: WorkResponse & { file?: File | null }
  ) => {
    const formData = new FormData();
    formData.append("name", work.name);
    formData.append("description", work.description);
    formData.append("link", work.link);
    formData.append("period", work.period);
    formData.append("use", work.use);
    if (work.file) formData.append("image", work.file);

    await updateWork({ id: work.id, formData }).unwrap();
    await refetchWorks();
  };

  const handleDeleteWork = async (id: string) => {
    await deleteWork(id).unwrap();
    await refetchWorks();
  };

  if (isProfileLoading || isSkillsLoading || isWorksLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box display="flex" height="85vh" overflow="hidden">
      {/* プロフィールセクション */}
      <Box
        sx={{
          width: "20%",
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "75px 15px 1fr",
              rowGap: 2,
              alignItems: "center",
            }}
          >
            {[
              ["姓", "lastName"],
              ["名", "firstName"],
              ["生年月日", "birthDate"],
              ["学校", "school"],
              ["趣味", "hobby"],
            ].map(([label, key]) => (
              <Fragment key={key}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {label}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  :
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  type={key === "birthDate" ? "date" : "text"}
                  multiline={key === "school" || key === "hobby"}
                  rows={key === "school" || key === "hobby" ? 2 : 1}
                  value={editableProfile[key as keyof typeof editableProfile]}
                  onChange={(e) =>
                    handleProfileChange(
                      key as keyof typeof editableProfile,
                      e.target.value
                    )
                  }
                />
              </Fragment>
            ))}
          </Box>

          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={handleUpdateProfile}>
              保存
            </Button>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" color="text.secondary">
              WORKS
            </Typography>
            <Button variant="outlined" onClick={handleAddWork}>
              作品を追加
            </Button>
          </Box>
          {editableWorks.map((work, idx) => (
            <Card
              key={`work-${idx}`}
              sx={{
                mb: 2,
                p: 2,
                height: "auto",
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flex: 1, display: "flex", gap: 4 }}>
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <TextField
                      label="作品名"
                      fullWidth
                      value={work.name}
                      onChange={(e) =>
                        handleWorkChange(work.id, "name", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />

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
                        position: "relative",
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          previewImages[work.id] ??
                          (work.imagePath ? BASE_URL + work.imagePath : "")
                        }
                        alt={work.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 2,
                          display:
                            work.imagePath || previewImages[work.id]
                              ? "block"
                              : "none",
                        }}
                      />
                      {!previewImages[work.id] && !work.imagePath && (
                        <Typography variant="caption" color="text.secondary">
                          No Image
                        </Typography>
                      )}

                      <input
                        accept="image/*"
                        id={`upload-button-${work.id}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleImageChange(
                            work.id,
                            e.target.files?.[0] ?? null
                          )
                        }
                      />
                      <label htmlFor={`upload-button-${work.id}`}>
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "background.default",
                            "&:hover": {
                              backgroundColor: "text.primary",
                            },
                          }}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </label>
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
                    <TextField
                      label="リンク"
                      fullWidth
                      value={work.link}
                      onChange={(e) =>
                        handleWorkChange(work.id, "link", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    label="制作期間"
                    fullWidth
                    value={work.period}
                    onChange={(e) =>
                      handleWorkChange(work.id, "period", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="使用技術"
                    fullWidth
                    value={work.use}
                    onChange={(e) =>
                      handleWorkChange(work.id, "use", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="説明"
                    fullWidth
                    multiline
                    value={work.description}
                    onChange={(e) =>
                      handleWorkChange(work.id, "description", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  px: 2,
                  pb: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleUpdateWork(work)}
                >
                  保存
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteWork(work.id)}
                >
                  削除
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        <Box ref={skillsRef}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" color="text.secondary">
              SKILLS
            </Typography>
            <Button variant="outlined" onClick={handleAddSkill}>
              スキルを追加
            </Button>
          </Box>
          <Grid container spacing={2}>
            {editableSkills.map((skill, idx) => (
              <Grid
                key={`skill-${idx}`}
                sx={{ flexBasis: { xs: "100%", sm: "49%" } }}
              >
                <Card
                  key={skill.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent>
                    <TextField
                      label="スキル名"
                      fullWidth
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillChange(skill.id, "name", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="説明"
                      fullWidth
                      multiline
                      minRows={2}
                      value={skill.description}
                      onChange={(e) =>
                        handleSkillChange(
                          skill.id,
                          "description",
                          e.target.value
                        )
                      }
                      sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateSkill(skill)}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteSkill(skill)}
                      >
                        削除
                      </Button>
                    </Box>
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
