import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          ページが見つかりません
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          お探しのページは存在しないか、移動された可能性があります。
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
        >
          ホームに戻る
        </Button>
      </Container>
    </Box>
  )
}
