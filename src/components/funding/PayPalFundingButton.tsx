import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';

interface PayPalFundingButtonProps {
    contentType: 'news' | 'poll';
    contentId: string;
    amount: number;
    currency: string;
    comment?: string;
    onSuccess: (contribution: any) => void;
    onError: (error: Error) => void;
    onCancel?: () => void;
    disabled?: boolean;
}

const PayPalFundingButton: React.FC<PayPalFundingButtonProps> = ({
    contentType,
    contentId,
    amount,
    currency,
    comment,
    onSuccess,
    onError,
    onCancel,
    disabled = false
}) => {
    const [sdkLoading, setSdkLoading] = React.useState(true);
    const [orderData, setOrderData] = React.useState<{ orderId: string; contributionId: string } | null>(null);
    const { api } = useApiContext();

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                PayPal is not configured. Please contact support.
            </Alert>
        );
    }

    return (
        <Box sx={{ minHeight: 50 }}>
            <PayPalScriptProvider
                options={{
                    clientId: clientId,
                    currency: currency.toUpperCase(),
                    intent: 'capture'
                }}
            >
                {sdkLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'pay'
                    }}
                    disabled={disabled || amount <= 0}
                    onInit={() => {
                        setSdkLoading(false);
                    }}
                    createOrder={async () => {
                        console.log('Creating PayPal order for funding:', {
                            contentType,
                            contentId,
                            amount,
                            currency
                        });

                        try {
                            // Call backend to create PayPal order and pending contribution
                            const result = await api?.fundingApi?.createPayPalOrder(
                                contentType,
                                contentId,
                                {
                                    amount,
                                    currency,
                                    comment
                                }
                            );

                            if (!result?.orderId) {
                                throw new Error('Failed to create PayPal order');
                            }

                            // Store order data for capture step
                            setOrderData({
                                orderId: result.orderId,
                                contributionId: result.contributionId
                            });

                            return result.orderId;
                        } catch (error) {
                            console.error('Failed to create PayPal order:', error);
                            onError(new Error('Failed to create payment order. Please try again.'));
                            throw error;
                        }
                    }}
                    onApprove={async (data) => {
                        console.log('PayPal order approved:', {
                            orderID: data.orderID,
                            contributionId: orderData?.contributionId
                        });

                        if (!orderData) {
                            onError(new Error('Order data not found'));
                            return;
                        }

                        try {
                            // Call backend to capture PayPal order and complete contribution
                            const contribution = await api?.fundingApi?.capturePayPalOrder(
                                contentType,
                                contentId,
                                {
                                    orderId: data.orderID,
                                    contributionId: orderData.contributionId
                                }
                            );

                            // Call success callback
                            onSuccess(contribution);
                        } catch (error) {
                            console.error('Failed to capture PayPal order:', error);
                            onError(new Error('Failed to complete payment. Please contact support.'));
                        }
                    }}
                    onCancel={() => {
                        console.log('PayPal payment cancelled by user');
                        setOrderData(null);
                        onCancel?.();
                    }}
                    onError={(err) => {
                        console.error('PayPal payment error:', err);
                        setOrderData(null);
                        onError(new Error(typeof err === 'string' ? err : 'PayPal payment failed'));
                    }}
                />
            </PayPalScriptProvider>
        </Box>
    );
};

export default PayPalFundingButton;
