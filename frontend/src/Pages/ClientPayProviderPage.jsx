
import { useEffect, useState } from "react";
import useClientDashboardStore from "../store/clientDashboardStore";
import { Flex, Card, Text, Button, Avatar, Badge, Skeleton, Box, Dialog } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../store/paymentStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/clientDashboardComponents/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function ClientPayProviderPage() {
    const { acceptedProviders, getAcceptedProviders, gettingAcceptedProviders } = useClientDashboardStore();
    const { payProvider, isCreating, clientSecret, payment_id } = usePaymentStore();
    const navigate = useNavigate();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    useEffect(() => {
        getAcceptedProviders();
    }, [getAcceptedProviders]);

    const handlePayProvider = async(job_id, provider_id, amount, description) => {
        const success = await payProvider(job_id, provider_id, amount, description);
        if(success){
            setIsPaymentDialogOpen(true);
        }
    }

    return (
        <div className="flex flex-col w-full p-10 max-w-6xl mx-auto" data-aos="fade-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} style={{cursor:'pointer'}}>
                    <ArrowLeftIcon className="mr-2"/>Back
                </Button>
            </div>
            <div className="w-full bg-blue-500 p-8 rounded-xl mb-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Pending Payments</h1>
                <p className="text-blue-100">
                    Select a completed job to process payment for your provider.
                </p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {gettingAcceptedProviders ? (
                     // Skeleton Loading
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-4">
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
                                className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default border-2 border-transparent hover:border-blue-100"
                            >
                                <Flex justify="between" align="center" gap="4" direction={{ initial: 'column', sm: 'row' }} className="p-2">
                                    
                                    {/* Provider & Job Info */}
                                    <Flex gap="4" align="center" className="flex-1">
                                        <Avatar
                                            size="5"
                                            src={`http://localhost:8000/storage/${job.provider.profile_picture}`}
                                            fallback={job.provider.name?.[0]}
                                            radius="full"
                                            className="border-2 border-white shadow-sm cursor-pointer"
                                            onClick={()=>navigate(`/provider-profile/${job.provider.id}`)}
                                        />
                                        <Box>
                                            <Text as="div" size="4" weight="bold" className="text-gray-900">
                                                {job.job.title}
                                            </Text>
                                            <Flex gap="2" align="center" className="text-gray-500 text-sm mt-1">
                                                <Text>Provider: <span className="font-medium text-gray-700 cursor-pointer hover:underline hover:text-blue-600"
                                                                    onClick={()=>navigate(`/provider-profile/${job.provider.id}`)}
                                                                    >
                                                                        {job.provider.name}
                                                                    </span>
                                                </Text>
                                                <span>•</span>
                                                <Text>Budget: <span className="font-medium text-green-600">${job.job.budget}</span></Text>
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
                                            {isCreating ? "Initializing..." : "Pay Now"}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Text className="text-gray-400 text-lg">No pending payments for completed jobs.</Text>
                    </div>
                )}
            </div>

            {/* Payment Dialog */}
            <Dialog.Root open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <Dialog.Content style={{ maxWidth: 500 }}>
                    <Dialog.Title>Complete Payment</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Enter your card details securely below to complete the transaction.
                    </Dialog.Description>

                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm 
                                paymentId={payment_id} 
                                onSuccess={() => {
                                    setIsPaymentDialogOpen(false);
                                    getAcceptedProviders(); // Refresh list
                                }} 
                            />
                        </Elements>
                    ) : (
                        <div className="py-4 text-center">
                            <Text>Loading payment details...</Text>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
}