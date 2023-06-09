import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function DetailsInput({setFormData}) {
  return (
    <div>
        <div className='flex gap-2 mt-8 mb-0'>
            <TextField  fullWidth onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} id="filled-name" label="Full Name" variant="outlined" />
            <TextField fullWidth onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} id="filled-emal" label="email address" variant="outlined" />
        </div>
    </div>
  );
}