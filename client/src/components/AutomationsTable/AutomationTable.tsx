import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Gateway from '@src/api/gateway';
import { toTitleCase } from '@src/common/utils';

import type { Automation } from '@sharedTypes/types';

const AutomationTable = (): JSX.Element => {
  const [automationsData, setAutomationsData] = useState<{ data: Automation[]; total: number }>({
    data: [],
    total: 0
  });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<keyof Automation | ''>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const headers: (keyof Automation)[] = ['id', 'name', 'status', 'creationTime', 'type'];

  const handleSort = (header: keyof Automation) => {
    if (sortBy === header) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(header);
      setOrder('asc');
    }
  };

  useEffect(() => {
    const fetchAutomationsData = async (): Promise<void> => {
      const response = await Gateway.getAutomations({
        page: page + 1, // server expects 1-based index
        limit,
        sortBy,
        order
      });

      if (response?.data) {
        const { data, total } = response?.data || { data: [], total: 0 };
        setAutomationsData({ data, total });
      }
    };
    fetchAutomationsData();
  }, [page, limit, sortBy, order]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTableHeader = (): JSX.Element => (
    <TableHead sx={{ background: 'lightgreen' }}>
      <TableRow key="table-header" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        {headers.map((header) => (
          <TableCell
          key={header}
          onClick={() => handleSort(header)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {toTitleCase(header)}
          {sortBy === header ? (order === 'asc' ? ' 🔼' : ' 🔽') : null}
        </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = (): JSX.Element => (
    <TableBody>
      {automationsData?.data.map((row) => (
        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
         {headers.map((key) => (
          <TableCell key={`${row.name}_${key}`}>{row[key]?.toString()}</TableCell>
        ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '1000px', overflow: 'scroll' }} aria-label="simple table">
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
        <TablePagination
          component="div"
          count={automationsData.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem'
            },
            '& .MuiSelect-icon': {
              color: '#fff'
            },
            '& .MuiTablePagination-actions svg': {
              color: '#fff'
            }
          }}
        />
      </TableContainer>
    </>
  );
};

export default AutomationTable;
