import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FC } from 'react';

type FieldSetProps = {
  readonly label: string;
};

const FieldSet: FC<FieldSetProps> = ({ label, children }) => (
  <Paper variant="elevation" elevation={0}>
    <FormControl component="fieldset" fullWidth>
      <Box mb={1}>
        <FormLabel component="legend">
          <Typography variant="subtitle2" color="primary">
            {label}
          </Typography>
        </FormLabel>
      </Box>
      {children}
    </FormControl>
  </Paper>
);

export default FieldSet;
