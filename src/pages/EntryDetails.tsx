import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Chip, Avatar, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Divider, Button } from '@mui/material';
import { allVideos } from '../constants/videos';
import EntryStats from '../components/EntryStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApiContext } from '../contexts/ApiContext';
import { News } from '../APIs/NewsAPI';

interface Transaction {
  id: number;
  type: 'contribution' | 'expense';
  amount: number;
  title: string;
  reason: string;
}

const transactions: Transaction[] = [
  { id: 1, type: 'contribution', amount: 300, title: 'Initial Funding', reason: 'Kickstart the project' },
  { id: 2, type: 'expense', amount: 50, title: 'Marketing', reason: 'Social media ads' },
  { id: 3, type: 'contribution', amount: 200, title: 'Second Funding', reason: 'Support project expansion' },
  { id: 4, type: 'expense', amount: 70, title: 'Equipment', reason: 'Purchase new microphone' },
  { id: 5, type: 'contribution', amount: 400, title: 'Third Funding', reason: 'Additional resources' },
  { id: 6, type: 'expense', amount: 100, title: 'Hosting', reason: 'Annual web hosting fee' },
];

const EntryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { api, isAuthenticated } = useApiContext();
  const [entry, setEntry] = useState<Nullable<News>>(null);

  // const totalFund = transactions.filter(t => t.type === 'contribution').reduce((acc, t) => acc + t.amount, 0);
  // const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  // const remainingAmount = totalFund - totalExpense;

  // Calculate cumulative fund amount over time
  // let cumulativeAmount = 0;
  // const data = transactions.map(t => {
  //   cumulativeAmount += t.type === 'contribution' ? t.amount : -t.amount;
  //   return { name: t.title, Amount: cumulativeAmount };
  // });

  const renderDetails = (entry: any) => {
    if (!entry) {
      return <Typography variant="h4">Entry not found</Typography>;
    }

    return <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
            <Avatar
              variant="square"
              src={entry.thumbnail}
              alt={entry.title}
              sx={{ width: 150, height: 150, mr: 2 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {entry.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {entry.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {entry.tags.map((tag: string) => (
                    <Chip key={tag} label={tag} variant="outlined" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                <EntryStats news={entry} />
              </CardContent>
            </Box>
          </Box>
        </Card>
        {/* <Box sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Amount ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.title}</TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Total Fund: ${totalFund}</Typography>
                <Typography variant="h6">Remaining Amount: ${remainingAmount}</Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fund Amount Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box> */}
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ mb: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src="https://via.placeholder.com/40" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1">Author Name</Typography>
                  <Typography variant="body2" color="text.secondary">
                    creating Daily Podcasts and videos on the net.
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Become a member
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Posts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {allVideos.slice(0, 5).map((recentVideo) => (
              <Box key={recentVideo.id} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {recentVideo.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {recentVideo.description.slice(0, 50)}...
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  }

  useEffect(() => {
    const getNews = async () => {
      if (id) {
        const newsResult = await api?.newsApi.get(id)
        setEntry(newsResult)
      }
    }

    getNews();
  }, [])


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {renderDetails(entry)}
    </Container>
  );
};

export default EntryDetails;