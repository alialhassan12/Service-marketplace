import { Flex, Card, Button, Badge, Table, TextField, Select, Tabs, Skeleton, Text } from '@radix-ui/themes';
import { MagnifyingGlassIcon, DownloadIcon, FileTextIcon } from '@radix-ui/react-icons';
import { usePaymentStore } from '../../store/paymentStore';
import { useEffect, useState } from 'react';

const getStatusColor = (status) => {
    switch (status) {
        case 'paid': return 'green';
        case 'pending': return 'amber';
        case 'refunded': return 'gray';
        default: return 'gray';
    }
};

export default function ProviderEarningsPage() {
    const {
        getProviderPaymentHistory,
        providerPayments,
        providerPagination,
        isLoadingProviderHistory,
        getProviderBalance,
        providerPendingAmount,
        providerTotalEarned,
        isLoadingBalance,
        downloadInvoice,
        isDownloadingInvoice,
        downloadingInvoiceId
    }=usePaymentStore();
    
    const [filter,setFilter]=useState("all");
    const [page,setPage]=useState(1);

    useEffect(()=>{
        getProviderPaymentHistory(page);
        getProviderBalance();
    },[page]);

    const handleDownloadInvoice = (payment_id) => {
        downloadInvoice(payment_id);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (providerPagination?.last_page || 1)) {
            setPage(newPage);
        }
    };

    return (
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            {/* Header Section */}
            <div className="w-full mb-8 border-b border-border-subtle pb-4">
                <h1 className="text-3xl font-bold text-primary">Earnings</h1>
            </div>

            <Flex direction="column" gap="6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Total Income */}
                    <div className="bg-card p-6 rounded-3xl shadow-soft border border-border-subtle flex flex-col gap-1 hover:translate-y-[-2px] transition-all duration-300">
                        <h3 className="text-secondary text-sm font-bold uppercase tracking-wider">Total Income</h3>
                        <p className="text-3xl font-bold text-green-500">
                            {isLoadingBalance ? <Skeleton width="120px" height="32px" /> : `$${providerTotalEarned}`}
                        </p>
                    </div>

                    {/* pending payments */}
                    <div className="bg-card p-6 rounded-3xl shadow-soft border border-border-subtle flex flex-col justify-between gap-1 hover:translate-y-[-2px] transition-all duration-300">
                        <div>
                            <h3 className="text-secondary text-sm font-bold uppercase tracking-wider">Pending Payments</h3>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-bold text-primary">
                                    {isLoadingBalance ? <Skeleton width="120px" height="32px" /> : `$${providerPendingAmount}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Filters and Table */}
                <Flex direction="column" gap="4" className="mt-8">
                    <h2 className="text-2xl font-bold text-primary">Transaction History</h2>
                    <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                        <Tabs.Root defaultValue="all" className="w-full" value={filter}  onValueChange={(value)=>{
                            setFilter(value);
                            setPage(1);
                            getProviderPaymentHistory(1);
                        }}>
                            <Tabs.List variant="surface">
                                <Tabs.Trigger value="all">All Transactions</Tabs.Trigger>
                                <Tabs.Trigger value="paid">Paid</Tabs.Trigger>
                                <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
                            </Tabs.List>
                        </Tabs.Root>
                    </Flex>

                    {/* Transactions Table */}
                    <Card>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Client</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Service</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {isLoadingProviderHistory ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <Table.Row key={i}>
                                            <Table.RowHeaderCell><Skeleton width="120px" height="20px" /></Table.RowHeaderCell>
                                            <Table.Cell><Skeleton width="100px" /></Table.Cell>
                                            <Table.Cell><Skeleton width="80px" /></Table.Cell>
                                            <Table.Cell><Skeleton width="60px" /></Table.Cell>
                                            <Table.Cell><Skeleton width="70px" style={{ borderRadius: '999px' }} /></Table.Cell>
                                            <Table.Cell><Skeleton width="24px" height="24px" /></Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : providerPayments.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan="6" className="text-center py-10">
                                            <Text color="gray">No transactions found.</Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    providerPayments.map((payment) => {
                                        if(filter=== "all" ||filter===payment.status.toLowerCase() ){
                                            return(
                                                 <Table.Row key={payment.id}>
                                                    <Table.RowHeaderCell className="font-bold text-primary">{payment.client_name}</Table.RowHeaderCell>
                                                    <Table.Cell className="text-secondary">{payment.service}</Table.Cell>
                                                    <Table.Cell className="text-secondary">{payment.date}</Table.Cell>
                                                    <Table.Cell className="font-bold text-primary">{payment.amount}</Table.Cell>
                                                    <Table.Cell>
                                                        <Badge color={getStatusColor(payment.status.toLowerCase())}>{payment.status}</Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="1" 
                                                                onClick={() => handleDownloadInvoice(payment.id)}
                                                                title="Download Invoice PDF"
                                                                disabled={isDownloadingInvoice}
                                                            >
                                                                <div className={isDownloadingInvoice && downloadingInvoiceId === payment.id ? 'animate-download' : ''}>
                                                                    <DownloadIcon />
                                                                </div>
                                                            </Button>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        }
                                    })
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Card>
                </Flex>

                {/* Pagination */}
                {providerPagination && providerPagination.last_page > 1 && (
                    <Flex justify="end" gap="2" align="center">
                        <Button 
                            variant="soft" 
                            disabled={page === 1 || isLoadingProviderHistory}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-bold text-secondary">
                            Page {page} of {providerPagination.last_page}
                        </span>
                        <Button 
                            variant="soft"
                            disabled={page === providerPagination.last_page || isLoadingProviderHistory}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Next
                        </Button>
                    </Flex>
                )}
            </Flex>
        </div>
    );
}