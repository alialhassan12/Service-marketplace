
import { useEffect, useState } from "react";
import useClientDashboardStore from "../store/clientDashboardStore";
import { Flex, Card, Text, Button, Avatar, Badge, Skeleton, Box, Dialog, Theme, Spinner } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../store/paymentStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/clientDashboardComponents/CheckoutForm";
import { useTheme } from "../contexts/useTheme";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function ClientPayProviderPage() {
    const { acceptedProviders, getAcceptedProviders, gettingAcceptedProviders } = useClientDashboardStore();
    const { payProvider, isCreating, clientSecret, payment_id } = usePaymentStore();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [processingJobId, setProcessingJobId] = useState(null);

    useEffect(() => {
        getAcceptedProviders();
    }, [getAcceptedProviders]);

    const handlePayProvider = async(job_id, provider_id, amount, description) => {
        setProcessingJobId(job_id);
        const success = await payProvider(job_id, provider_id, amount, description);
        if(success){
            setIsPaymentDialogOpen(true);
        }
        setProcessingJobId(null);
    }

    return (
        <Theme appearance={theme}>
            <div className="flex flex-col w-full min-h-screen bg-bg-1 p-6 md:p-10">
                <div className="max-w-6xl mx-auto w-full" data-aos="fade-up">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Button variant="ghost" color="gray" onClick={() => navigate(-1)} style={{cursor:'pointer'}}>
                            <ArrowLeftIcon className="mr-2"/>Back
                        </Button>
                    </div>
                    <div className="w-full bg-blue-600 dark:bg-blue-900 p-8 rounded-2xl mb-8 text-white shadow-lg">
                        <h1 className="text-3xl font-bold mb-2">Pending Payments</h1>
                        <p className="text-blue-100 dark:text-blue-200 opacity-90">
                            Select a completed job to process payment for your provider.
                        </p>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-4">
                        {gettingAcceptedProviders ? (
                             // Skeleton Loading
                            Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="p-4 bg-card border-border-subtle shadow-soft">
                                    <Flex gap="4" align="center">
                                        <Skeleton width="64px" height="64px" style={{ borderRadius: '50%' }} />
                                        <Box className="w-full space-y-2">
                                            <Skeleton width="40%" height="24px" />
                                            <Skeleton width="20%" height="16px" />
                                        </Box>
                                        <Skeleton width="100px" height="32px" />
                                    </Flex>
                                </Card>
                            ))
                        ) : acceptedProviders && acceptedProviders.length > 0 ? (
                            acceptedProviders.map((job) => {
                                // Find the accepted proposal for this job

                                if (!job.provider) return null;

                                return (
                                    <Card 
                                        key={job.id} 
                                        className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border-subtle shadow-soft"
                                    >
                                        <Flex justify="between" align="center" gap="4" direction={{ initial: 'column', sm: 'row' }} className="p-2">
                                            
                                            {/* Provider & Job Info */}
                                            <Flex gap="4" align="center" className="flex-1">
                                                <Avatar
                                                    size="5"
                                                    src={`http://localhost:8000/storage/${job.provider.profile_picture}`}
                                                    fallback={job.provider.name?.[0]}
                                                    radius="full"
                                                    className="ring-2 ring-border-subtle cursor-pointer"
                                                    onClick={()=>navigate(`/provider-profile/${job.provider.id}`)}
                                                />
                                                <Box>
                                                    <Text as="div" size="4" weight="bold" className="text-primary">
                                                        {job.job.title}
                                                    </Text>
                                                    <Flex gap="2" align="center" className="text-secondary text-sm mt-1">
                                                        <Text>Provider: <span className="font-medium text-primary hover:text-blue-500 cursor-pointer transition-colors"
                                                                            onClick={()=>navigate(`/provider-profile/${job.provider.id}`)}
                                                                            >
                                                                                {job.provider.name}
                                                                            </span>
                                                        </Text>
                                                        <span>•</span>
                                                        <Text>Budget: <span className="font-bold text-green-600">${job.job.budget}</span></Text>
                                                    </Flex>
                                                </Box>
                                            </Flex>

                                            {/* Action */}
                                            <Flex align="center" gap="4">
                                                <Badge color="green" variant="soft" radius="full" className="px-3">
                                                    Completed
                                                </Badge>
                                                <Button 
                                                    size="3" 
                                                    variant="solid" 
                                                    disabled={isCreating}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md"
                                                    onClick={() => handlePayProvider(
                                                        job.job_id,
                                                        job.provider.id, 
                                                        job.job.budget, 
                                                        `Payment for job: ${job.job.title}`
                                                    )}
                                                >
                                                    {isCreating && processingJobId === job.job_id ? <>Initializing... <Spinner/></> : "Pay Now"}
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border-subtle">
                                <Text className="text-secondary text-lg">No pending payments for completed jobs.</Text>
                            </div>
                        )}
                    </div>

                    {/* Payment Dialog */}
                    <Dialog.Root open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <Dialog.Content style={{ maxWidth: 500 }} className="bg-card p-6 rounded-2xl">
                            <Dialog.Title className="text-primary text-xl font-bold mb-2">Complete Payment</Dialog.Title>
                            <Dialog.Description size="2" className="text-secondary mb-6 block">
                                Enter your card details securely below to complete the transaction.
                            </Dialog.Description>

                            {clientSecret ? (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: theme === 'dark' ? 'night' : 'stripe' } }}>
                                    <CheckoutForm 
                                        paymentId={payment_id} 
                                        onSuccess={() => {
                                            setIsPaymentDialogOpen(false);
                                            getAcceptedProviders(); // Refresh list
                                        }} 
                                    />
                                </Elements>
                            ) : (
                                <div className="py-8 text-center">
                                    <span className="loading loading-spinner loading-lg text-blue-500"></span>
                                    <Text className="text-secondary block mt-2">Loading payment details...</Text>
                                </div>
                            )}
                        </Dialog.Content>
                    </Dialog.Root>
                </div>
            </div>
        </Theme>
    );
}