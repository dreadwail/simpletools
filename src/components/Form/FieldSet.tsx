import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FC } from 'react';

import type { Direction } from './types';

type FieldSetProps = {
  readonly label: string;
  readonly direction: Direction;
};

const FieldSet: FC<FieldSetProps> = ({ label, children }) => (
  <Paper variant="outlined">
    <Box px={2} py={1}>
      <FormControl component="fieldset" fullWidth>
        <Box mb={2}>
          <FormLabel component="legend">
            <Typography variant="subtitle2" color="primary">
              {label}
            </Typography>
          </FormLabel>
        </Box>
        {children}
      </FormControl>
    </Box>
  </Paper>
);

export default FieldSet;
