import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { ExpenseOrderStatus, ExpenseOrderStatusLabels } from '@/enums/ExpenseOrderEnums';

interface ExpenseOrderStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: ExpenseOrderStatus;
}

const ExpenseOrderStatusChip: React.FC<ExpenseOrderStatusChipProps> = ({ 
  status, 
  ...props 
}) => {
  const getStatusColor = (status: ExpenseOrderStatus) => {
    switch (status) {
      case ExpenseOrderStatus.APPROVED:
      case ExpenseOrderStatus.PAID:
        return 'success';
      case ExpenseOrderStatus.REJECTED:
      case ExpenseOrderStatus.CANCELLED:
        return 'error';
      case ExpenseOrderStatus.SUBMITTED:
      case ExpenseOrderStatus.UNDER_REVIEW:
        return 'info';
      case ExpenseOrderStatus.DRAFT:
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={ExpenseOrderStatusLabels[status]}
      color={getStatusColor(status)}
      size="small"
      variant="filled"
      sx={{
        borderRadius: 1,
        fontWeight: 500,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...props.sx
      }}
      {...props}
    />
  );
};

export default ExpenseOrderStatusChip; 