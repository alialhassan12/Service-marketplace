import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button, Flex, Text } from "@radix-ui/themes";
import { usePaymentStore } from "../../store/paymentStore";


export default function CheckoutForm({ onSuccess, paymentId }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { confirmPayment } = usePaymentStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/client/payment-success",
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Confirm with backend
            const confirmed = await confirmPayment(paymentId, paymentIntent.id);
            if (confirmed) {
                onSuccess();
            }
            setIsLoading(false);
        } else {
            setMessage("Payment processing...");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <PaymentElement />
            {message && (
                <Text color="red" size="2" className="mt-2 block">
                    {message}
                </Text>
            )}
            <Flex gap="3" mt="5" justify="end">
                <Button disabled={isLoading || !stripe || !elements} type="submit" size="3">
                    {isLoading ? "Processing..." : "Pay Now"}
                </Button>
            </Flex>
        </form>
    );
}
