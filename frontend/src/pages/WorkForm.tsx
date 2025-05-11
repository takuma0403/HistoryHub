import { useState } from 'react';
import {
  TextField, Button, Box, Typography, InputLabel, FormControl
} from '@mui/material';
import { useCreateWorkMutation } from '../features/user/userApi';

const WorkForm = () => {
  const [createWork] = useCreateWorkMutation();
  const [form, setForm] = useState({
    name: '',
    description: '',
    link: '',
    period: '',
    use: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.length) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('link', form.link);
    formData.append('period', form.period);
    formData.append('use', form.use);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await createWork(formData).unwrap();
      alert('Work created!');
    } catch (error) {
      alert('Error creating work');
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Create Work
      </Typography>
      <TextField label="Name" name="name" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Description" name="description" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Link" name="link" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Period" name="period" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Use" name="use" fullWidth margin="normal" onChange={handleChange} />

      <FormControl fullWidth margin="normal">
        <InputLabel shrink htmlFor="image">Upload Image</InputLabel>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
        />
      </FormControl>

      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default WorkForm;
