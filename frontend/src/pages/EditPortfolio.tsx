import { useEffect, useRef, useState, Fragment } from "react";
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
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from "../features/user/userApi";

export default function Portofolio() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetProfileQuery();
  const {
    data: skills,
    isLoading: isSkillsLoading,
    error: skillsError,
    refetch: refetchSkills,
  } = useGetSkillsQuery();

  const [updateProfile] = useUpdateProfileMutation();
  const [addSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const [editableProfile, setEditableProfile] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    school: "",
    hobby: "",
  });
  const [editableSkills, setEditableSkills] = useState<
    {
      id: string;
      name: string;
      description: string;
      isMainSkill: boolean;
    }[]
  >([]);

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
  }, [isProfileLoading, profile, navigate]);

  useEffect(() => {
    if (skills) {
      setEditableSkills(skills);
    }
  }, [skills]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchProfile();
        refetchSkills();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchProfile, refetchSkills]);

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

  const handleUpdateProfile = async () => {
    const isoBirthDate = new Date(editableProfile.birthDate).toISOString();
    await updateProfile({
      ...editableProfile,
      birthDate: isoBirthDate,
    });
    await refetchProfile();
  };

  const handleUpdateSkill = async (skill: {
    id: string;
    name: string;
    description: string;
    isMainSkill: boolean;
  }) => {
    await updateSkill({ ...skill });
    await refetchSkills();
  };

  const handleDeleteSkill = async (skill: {
    id: string;
    name: string;
    description: string;
    isMainSkill: boolean;
  }) => {
    await deleteSkill({ ...skill });
    await refetchSkills();
  };

  const handleAddSkill = async () => {
    const newSkill = {
      name: "",
      description: "",
      isMainSkill: false,
    };
    try {
      await addSkill({ ...newSkill }).unwrap();
      await refetchSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

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
                  color="text.secondary"
                >
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  :
                </Typography>
                <TextField
                  type={key === "birthDate" ? "date" : "text"}
                  size="small"
                  value={editableProfile[key as keyof typeof editableProfile]}
                  onChange={(e) =>
                    handleProfileChange(
                      key as keyof typeof editableProfile,
                      e.target.value
                    )
                  }
                  variant="outlined"
                  fullWidth
                  margin="none"
                  InputLabelProps={{ shrink: true }}
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
        <div ref={skillsRef}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" color="text.primary">
              Skills
            </Typography>
            <Button variant="outlined" onClick={handleAddSkill}>
              スキルを追加
            </Button>
          </Box>

          {editableSkills.map((skill) => (
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
                    handleSkillChange(skill.id, "description", e.target.value)
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
          ))}
        </div>

        <div ref={worksRef}>
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
        </div>
      </Box>
    </Box>
  );
}
