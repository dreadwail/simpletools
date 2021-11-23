import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import MaterialTable from '@material-ui/core/Table';
import MaterialTableBody from '@material-ui/core/TableBody';
import MaterialTableCell from '@material-ui/core/TableCell';
import MaterialTableContainer from '@material-ui/core/TableContainer';
import MaterialTableHead from '@material-ui/core/TableHead';
import MaterialTableRow from '@material-ui/core/TableRow';
import type { FC } from 'react';

const TableHead: FC = ({ children }) => <MaterialTableHead>{children}</MaterialTableHead>;
const TableBody: FC = ({ children }) => <MaterialTableBody>{children}</MaterialTableBody>;
const TableRow: FC = ({ children }) => <MaterialTableRow>{children}</MaterialTableRow>;
const TableCell: FC = ({ children }) => <MaterialTableCell>{children}</MaterialTableCell>;

type TableComponentType = FC & {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
};

const Table: TableComponentType = ({ children }) => (
  <Box mb={3}>
    <MaterialTableContainer component={Paper} elevation={0} variant="outlined">
      <MaterialTable size="small">{children}</MaterialTable>
    </MaterialTableContainer>
  </Box>
);

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
