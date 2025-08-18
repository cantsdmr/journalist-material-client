import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  ButtonProps
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import FundingModal, { FundingData } from './FundingModal';

interface FundingButtonProps extends Omit<ButtonProps, 'onClick'> {
  contentType: 'news' | 'poll';
  contentId: string;
  contentTitle: string;
  fundingData: Omit<FundingData, 'id' | 'title'>;
  onContributionSuccess?: (contribution: any) => void;
  variant?: 'button' | 'icon';
  icon?: 'money' | 'heart';
  text?: string;
}

const FundingButton: React.FC<FundingButtonProps> = ({
  contentType,
  contentId,
  contentTitle,
  fundingData,
  onContributionSuccess,
  variant = 'button',
  icon = 'money',
  text,
  ...buttonProps
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleContributionSuccess = (contribution: any) => {
    setModalOpen(false);
    if (onContributionSuccess) {
      onContributionSuccess(contribution);
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return <HeartIcon />;
      case 'money':
      default:
        return <MoneyIcon />;
    }
  };

  const getButtonText = () => {
    if (text) return text;
    
    switch (contentType) {
      case 'news':
        return 'Fund Article';
      case 'poll':
        return 'Fund Poll';
      default:
        return 'Fund';
    }
  };

  const fullFundingData: FundingData = {
    id: contentId,
    title: contentTitle,
    ...fundingData
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={getButtonText()}>
          <IconButton
            onClick={() => setModalOpen(true)}
            color="primary"
            {...buttonProps}
          >
            {getIcon()}
          </IconButton>
        </Tooltip>
        
        <FundingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContributionSuccess}
          contentType={contentType}
          contentId={contentId}
          fundingData={fullFundingData}
        />
      </>
    );
  }

  return (
    <>
      <Button
        startIcon={getIcon()}
        onClick={() => setModalOpen(true)}
        variant="outlined"
        color="primary"
        {...buttonProps}
      >
        {getButtonText()}
      </Button>
      
      <FundingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleContributionSuccess}
        contentType={contentType}
        contentId={contentId}
        fundingData={fullFundingData}
      />
    </>
  );
};

export default FundingButton;