import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';

interface PayPalSubscriptionButtonProps {
    planId: string;
    channelId: string;
    tierName: string;
    tierId: string;
    onSuccess: (tierName: string, tierId: string) => void;
    onError: (error: Error) => void;
    onCancel?: () => void;
    disabled?: boolean;
}

const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
    planId,
    channelId,
    tierName,
    tierId,
    onSuccess,
    onError,
    onCancel,
    disabled = false
}) => {
    const [sdkLoading, setSdkLoading] = React.useState(true);
    const { api } = useApiContext();

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                PayPal is not configured. Please contact support.
            </Alert>
        );
    }

    if (!planId) {
        return (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                PayPal plan not configured for this tier. Please contact the channel owner.
            </Alert>
        );
    }

    return (
        <Box sx={{ minHeight: 50 }}>
            <PayPalScriptProvider
                options={{
                    clientId: clientId,
                    vault: true,
                    intent: 'subscription',
                    currency: 'USD'
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
                        label: 'subscribe'
                    }}
                    disabled={disabled}
                    onInit={() => {
                        setSdkLoading(false);
                    }}
                    createSubscription={(_data, actions) => {
                        console.log('Creating PayPal subscription for plan:', planId);
                        return actions.subscription.create({
                            plan_id: planId,
                            custom_id: `${channelId}_${tierId}`, // Store channel and tier info
                            application_context: {
                                shipping_preference: 'NO_SHIPPING',
                                user_action: 'SUBSCRIBE_NOW'
                            } as any
                        });
                    }}
                    onApprove={async (data) => {
                        console.log('PayPal subscription approved:', {
                            subscriptionID: data.subscriptionID,
                            orderID: data.orderID,
                            tierName
                        });

                        try {
                            // Call backend to activate subscription
                            await api?.subscriptionApi?.activatePayPalSubscription(channelId, {
                                tierId,
                                paypalSubscriptionId: data.subscriptionID,
                                notificationLevel: 1
                            });

                            // Call success callback
                            onSuccess(tierName, tierId);
                        } catch (error) {
                            console.error('Failed to activate subscription:', error);
                            onError(new Error('Failed to activate subscription. Please contact support.'));
                        }
                    }}
                    onCancel={() => {
                        console.log('PayPal subscription cancelled by user');
                        onCancel?.();
                    }}
                    onError={(err) => {
                        console.error('PayPal subscription error:', err);
                        onError(new Error(typeof err === 'string' ? err : 'PayPal subscription failed'));
                    }}
                />
            </PayPalScriptProvider>
        </Box>
    );
};

export default PayPalSubscriptionButton;
