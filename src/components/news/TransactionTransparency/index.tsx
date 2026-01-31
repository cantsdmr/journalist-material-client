import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Receipt,
  AccountBalance,
  ExpandMore,
  Visibility,
  Info,
  MonetizationOn,
  Payment
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { ExpenseOrder } from '@/types/entities/ExpenseOrder';
import { FundSummary, FundContribution } from '@/APIs/app/FundingAPI';
import { ExpenseOrderStatus, ExpenseOrderStatusColors, ExpenseOrderStatusLabels } from '@/enums/ExpenseOrderEnums';
import { formatCurrency } from '@/utils/stringUtils';

interface TransactionTransparencyProps {
  newsId: string;
  channelId: string;
  newsFund?: any;
}

interface TransactionSummary {
  totalFunding: number;
  totalExpenses: number;
  netAmount: number;
  fundingContributions: number;
  expenseCount: number;
  payoutAmount: number;
}

const TransactionTransparency: React.FC<TransactionTransparencyProps> = ({
  newsId,
  channelId,
  newsFund
}) => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [loading, setLoading] = useState(true);
  const [fundSummary, setFundSummary] = useState<FundSummary | null>(null);
  const [expenseOrders, setExpenseOrders] = useState<ExpenseOrder[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch fund summary for the news
        const fundResult = await execute(
          () => api?.app.funding.getFundSummary('news', newsId),
          { showErrorToast: false }
        );

        // Fetch expense orders for the channel
        const expenseResult = await execute(
          () => api?.app.expenseOrder.getExpenseOrdersByChannel(channelId),
          { showErrorToast: false }
        );

        setFundSummary(fundResult || null);
        setExpenseOrders(expenseResult?.items || []);

        // Calculate transaction summary
        const summary: TransactionSummary = {
          totalFunding: fundResult?.fund?.current_amount || newsFund?.amount || 0,
          totalExpenses: expenseResult?.items?.reduce((sum, expense) => 
            expense.status === ExpenseOrderStatus.PAID ? sum + expense.amount : sum, 0
          ) || 0,
          netAmount: 0,
          fundingContributions: fundResult?.total_contributors || 0,
          expenseCount: expenseResult?.items?.length || 0,
          payoutAmount: 0
        };

        summary.netAmount = summary.totalFunding - summary.totalExpenses;
        setTransactionSummary(summary);

      } catch (err) {
        setError('Failed to load transaction data');
        console.error('Transaction data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [newsId, channelId, newsFund, api, execute]);

  const renderFundingVisualization = () => {
    if (!transactionSummary) return null;

    const fundingPercentage = transactionSummary.totalFunding > 0 ? 
      Math.min((transactionSummary.totalFunding / (newsFund?.goal_amount || transactionSummary.totalFunding)) * 100, 100) : 0;

    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" color="success.main">
              Funding Received
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" gutterBottom>
                  {formatCurrency(transactionSummary.totalFunding)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Raised
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Funding Progress</Typography>
                    <Typography variant="body2">{fundingPercentage.toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={fundingPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Contributors: {transactionSummary.fundingContributions}
                  </Typography>
                  {newsFund?.goal_amount && (
                    <Typography variant="body2" color="text.secondary">
                      Goal: {formatCurrency(newsFund.goal_amount)}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderExpenseVisualization = () => {
    if (!transactionSummary) return null;

    const paidExpenses = expenseOrders.filter(expense => expense.status === ExpenseOrderStatus.PAID);
    const pendingStatuses: ExpenseOrderStatus[] = [ExpenseOrderStatus.SUBMITTED, ExpenseOrderStatus.UNDER_REVIEW, ExpenseOrderStatus.APPROVED];
    const pendingExpenses = expenseOrders.filter(expense =>
      pendingStatuses.includes(expense.status)
    );

    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingDown color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="error.main">
              Expenses & Payouts
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main" gutterBottom>
                  {formatCurrency(transactionSummary.totalExpenses)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Paid Out
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Paid Expenses:</Typography>
                  <Typography variant="body2" color="success.main">
                    {paidExpenses.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Pending Expenses:</Typography>
                  <Typography variant="body2" color="warning.main">
                    {pendingExpenses.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Expense Orders:</Typography>
                  <Typography variant="body2">
                    {transactionSummary.expenseCount}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderNetAmountVisualization = () => {
    if (!transactionSummary) return null;

    const isPositive = transactionSummary.netAmount >= 0;

    return (
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          bgcolor: isPositive ? 'success.light' : 'warning.light',
          color: isPositive ? 'success.contrastText' : 'warning.contrastText',
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <AccountBalance sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" component="div">
            {formatCurrency(Math.abs(transactionSummary.netAmount))}
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          {isPositive ? 'Net Surplus' : 'Net Deficit'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {isPositive 
            ? 'Available for future expenses or reinvestment'
            : 'Additional funding may be needed'
          }
        </Typography>
      </Paper>
    );
  };

  const renderDetailedBreakdown = () => {
    return (
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MonetizationOn sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Funding Contributions</Typography>
              {fundSummary && (
                <Chip 
                  label={`${fundSummary.contributions.length} contributions`}
                  size="small" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {fundSummary?.contributions.length ? (
              <List dense>
                {fundSummary.contributions.slice(0, 10).map((contribution: FundContribution) => (
                  <ListItem key={contribution.id}>
                    <ListItemIcon>
                      <AttachMoney color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${formatCurrency(contribution.amount)} ${contribution.currency}`}
                      secondary={
                        contribution.isAnonymous 
                          ? 'Anonymous contributor'
                          : contribution.user?.name || 'Unknown contributor'
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                ))}
                {fundSummary.contributions.length > 10 && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          +{fundSummary.contributions.length - 10} more contributions
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            ) : (
              <Alert severity="info">
                No funding contributions found for this news article.
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Payment sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Expense Orders</Typography>
              {expenseOrders.length > 0 && (
                <Chip 
                  label={`${expenseOrders.length} expenses`}
                  size="small" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {expenseOrders.length ? (
              <List dense>
                {expenseOrders.map((expense) => (
                  <ListItem key={expense.id}>
                    <ListItemIcon>
                      <Receipt 
                        sx={{ 
                          color: ExpenseOrderStatusColors[expense.status] 
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={expense.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {expense.journalist.displayName} • {expense.type.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(expense.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(expense.amount)} {expense.currency}
                      </Typography>
                      <Chip
                        label={ExpenseOrderStatusLabels[expense.status]}
                        size="small"
                        sx={{
                          bgcolor: ExpenseOrderStatusColors[expense.status],
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    {expense.receiptUrl && (
                      <Tooltip title="View Receipt">
                        <IconButton 
                          size="small" 
                          onClick={() => window.open(expense.receiptUrl, '_blank')}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                No expense orders found for this channel.
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading transaction data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!transactionSummary || (transactionSummary.totalFunding === 0 && transactionSummary.totalExpenses === 0)) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Info sx={{ mr: 1 }} />
          No transaction data available for this news article.
        </Box>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccountBalance sx={{ mr: 1 }} />
        Transaction Transparency
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderFundingVisualization()}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderExpenseVisualization()}
        </Grid>
        
        <Grid item xs={12}>
          {renderNetAmountVisualization()}
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          {renderDetailedBreakdown()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionTransparency;