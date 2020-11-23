import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const columns = [
  { id: 'name', label: 'Name (TL=Team Lead)', minWidth: 50, maxWidth: 100, },
  { id: 'date_time', label: 'Date/Time', minWidth: 10, maxWidth: 30, align: 'center' },
  {
    id: 'duration',
    label: 'Duration',
    minWidth: 10,
    maxWidth: 30,
    align: 'center',
  },
  {
    id: 'remove',
    label: 'Delete',
    minWidth: 10,
    maxWidth: 30,
    align: 'center',
  },
];

function createData(name, date_time, duration, remove) {
  return { name, date_time, duration, remove };
}

const deleteIcon = <DeleteForeverIcon />
const rows = [
  createData('John (TL)', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('James', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('Jimmy', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('Jacky', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('Tom', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('Ronald', 'Dec 1, 11:30', '1 hr', deleteIcon),
  createData('Carl', 'Dec 1, 11:30', '1 hr', deleteIcon),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 250,
  },
});

export default function Assignments() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
