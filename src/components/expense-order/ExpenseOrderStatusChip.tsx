import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import {
  type ExpenseOrderStatus,
  getExpenseOrderStatusLabel,
  getExpenseOrderStatusColor
} from '@/enums/ExpenseOrderEnums';

interface ExpenseOrderStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: ExpenseOrderStatus;
}

const ExpenseOrderStatusChip: React.FC<ExpenseOrderStatusChipProps> = ({
  status,
  ...props
}) => {
  return (
    <Chip
      label={getExpenseOrderStatusLabel(status)}
      color={getExpenseOrderStatusColor(status)}
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