// ** React Imports
import { useState, useContext, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { useRouter } from 'next/router'
import moment from 'moment'

const TableStickyHeader = () => {
  const router = useRouter()

  const {
    contextTokenValue: { token }
  } = useContext(SettingsContext)

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const fetchCompanies = async () => {
    console.log(token)

    try {
      const res = await axios({
        method: 'GET',
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: '/company/showCompanies',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Companies', res)
      setData(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const verifyLogin = token => {
    if (token === null) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    const t = localStorage.getItem('atoken')
    token = t
    console.log('token here inside curent page', token)
    fetchCompanies()
    console.log(data)
    if (!verifyLogin(t)) {
      toast.error('Please Login')
      router.push('pages/c/login')
    }
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>All User Information</Typography>
      </Grid>
      {loading ? (
        <p>Loading...</p> // Display a loading message or spinner while data is being fetched
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 170 }}>Company Id</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>Company Name</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>Username</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>Email</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>Register at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(info => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={1}>
                      <TableCell key={info.id} align='left'>
                        {info.company_id}
                      </TableCell>
                      <TableCell key={info.id} align='left'>
                        {info.company_name}
                      </TableCell>
                      <TableCell key={info.id} align='left'>
                        {info.username}
                      </TableCell>
                      <TableCell key={info.id} align='left'>
                        {info.email}
                      </TableCell>
                      <TableCell key={info.id} align='left'>
                        {moment(info.created_at).format('YYYY-MM-DD')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Grid>
  )
}

export default TableStickyHeader
