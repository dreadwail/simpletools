import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FC } from 'react';

type FieldSetProps = {
  readonly label: string;
  readonly helperText?: string;
  readonly visualGap?: number;
};

const DEFAULT_GAP = 1;

const FieldSet: FC<FieldSetProps> = ({ label, children, helperText, visualGap = DEFAULT_GAP }) => (
  <Box mb={visualGap} width="100%">
    <Paper variant="elevation" elevation={0}>
      <FormControl component="fieldset" fullWidth>
        <Box mb={visualGap}>
          <FormLabel component="legend">
            <Typography variant="subtitle2" color="primary">
              {label}
            </Typography>
          </FormLabel>
        </Box>
        <Box mt={visualGap}>{children}</Box>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Paper>
  </Box>
);

export default FieldSet;
