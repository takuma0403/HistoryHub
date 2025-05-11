import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Container,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Fragment, useState } from "react";
import {
  useGetProfileQuery,
  useCreateProfileMutation,
  useGetUsernameQuery,
} from "../features/user/userApi";

export default function Home() {
  const token = localStorage.getItem("token");

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, { skip: !token });

  const {
    data: usernameData,
    isLoading: usernameLoading,
  } = useGetUsernameQuery(undefined, { skip: !profile });

  const [createProfile] = useCreateProfileMutation();

  const [editableProfile, setEditableProfile] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    school: "",
    hobby: "",
  });

  const handleProfileChange = (key: keyof typeof editableProfile, value: string) => {
    setEditableProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateProfile = async () => {
    try {
      await createProfile({
        ...editableProfile,
        birthDate: editableProfile.birthDate
        ? new Date(editableProfile.birthDate).toISOString()
        : ""
      }).unwrap();
      await refetchProfile();
    } catch (err) {
      console.error("プロフィール作成エラー:", err);
    }
  };

  const handleCopy = () => {
    if (usernameData?.username) {
      const url = `${window.location.origin}/${usernameData.username}`;
      navigator.clipboard.writeText(url);
    }
  };

  const inputFields = [
    ["姓（必須）", "lastName"],
    ["名（必須）", "firstName"],
    ["生年月日", "birthDate"],
    ["学校", "school"],
    ["趣味", "hobby"],
  ];

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "80vh",
        py: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!token ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="text.primary" gutterBottom>
            Welcome to HistoryHub
          </Typography>
          <Stack spacing={2} mt={4}>
            <Button
              href="/login"
              variant="outlined"
              sx={{
                borderRadius: "8px",
                borderColor: "primary.main",
                color: "primary.main",
                ":hover": { bgcolor: "primary.main", color: "#fff" },
              }}
            >
              ログイン
            </Button>
            <Button
              href="/signup"
              variant="contained"
              sx={{
                borderRadius: "8px",
                bgcolor: "primary.main",
                ":hover": { opacity: 0.85 },
              }}
            >
              新規登録
            </Button>
          </Stack>
        </Box>
      ) : profileLoading || usernameLoading ? (
        <Typography align="center">読み込み中...</Typography>
      ) : !profile ? (
        <Box>
          <Typography variant="h6" mb={3}>
            プロフィールを作成してください
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "75px 15px 1fr",
              rowGap: 2,
              alignItems: "center",
            }}
          >
            {inputFields.map(([label, key]) => (
              <Fragment key={key}>
                <Typography fontWeight="bold" color="text.primary">
                  {label}
                </Typography>
                <Typography color="text.primary">:</Typography>
                <TextField
                  required={key === "lastName" || key === "firstName"}
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

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, borderRadius: "8px", bgcolor: "primary.main" }}
            onClick={handleCreateProfile}
            disabled={!editableProfile.lastName || !editableProfile.firstName}
          >
            プロフィールを登録する
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            ようこそ、{profile.lastName}さん
          </Typography>

          <Stack spacing={2} mt={4}>
            <Button
              variant="contained"
              href={`/${usernameData?.username}`}
              sx={{
                borderRadius: "8px",
                bgcolor: "primary.main",
                ":hover": { opacity: 0.85 },
              }}
            >
              自分のポートフォリオを見る
            </Button>

            <Button
              variant="outlined"
              href={`/${usernameData?.username}/edit`}
              sx={{
                borderRadius: "8px",
                borderColor: "primary.main",
                color: "primary.main",
                ":hover": { bgcolor: "primary.main", color: "#fff" },
              }}
            >
              自分のポートフォリオを編集する
            </Button>

            <Button
              variant="text"
              onClick={handleCopy}
              startIcon={<ContentCopyIcon />}
              sx={{
                color: "primary.main",
                ":hover": { textDecoration: "underline" },
              }}
            >
              ポートフォリオURLを共有する
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  );
}
