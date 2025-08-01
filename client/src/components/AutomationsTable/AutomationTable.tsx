import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

import Pagination from '@mui/material/Pagination';
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
  const [page, setPage] = useState(1);
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
      const response = await Gateway.getAutomations({ page, limit, sortBy, order });
      if (response?.data) {
        const { data, total } = response?.data || { data: [], total: 0 };
        setAutomationsData({ data, total });
      }
    };
    fetchAutomationsData();
  }, [page, limit, sortBy, order]);

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

  const totalPages = Math.ceil(automationsData.total / limit);

  return (
    <>
    <Pagination count={totalPages}
      page={page}
      onChange={(_, value) => setPage(value)}
      sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
    />

    <Select value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            sx={{ marginTop: 2 }}
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size} per page
              </MenuItem>
            ))}
      </Select>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '1000px', overflow: 'scroll' }} aria-label="simple table">
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </TableContainer>
  </>
  );
};

export default AutomationTable;
