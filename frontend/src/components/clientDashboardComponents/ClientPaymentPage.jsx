import { Box, Flex, Card, Button, Badge, Table, TextField, Select, Text, Skeleton, Tabs } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlusIcon, DownloadIcon, CardStackIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../store/paymentStore';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function ClientPaymentPage() {
    const navigate = useNavigate();
    const { payments, pagination, isLoadingHistory, getPaymentHistory,totalSpent,pendingAmount,downloadInvoice,isDownloadingInvoice,downloadingInvoiceId } = usePaymentStore();
    const [selectedTab, setSelectedTab] = useState('all');
    useEffect(() => {
        getPaymentHistory();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            getPaymentHistory(newPage);
        }
    };

    const handlePayProvider = () => {
        navigate('/client/pay-provider');
    }
    const handleDownloadInvoice = (payment_id) => {
        downloadInvoice(payment_id);
    }

    return (
    <div className="flex flex-col w-full p-10" data-aos="fade-up">
      {/* Header Section */}
        <div className="w-full bg-blue-500 p-5 rounded-xl mb-6">
            <h1 className="text-2xl font-bold text-white">Payments</h1>
            <p className="text-gray-200 font-light">
                Review your payment history, manage methods, and settle pending invoices.
            </p>
        </div>

        <Flex direction="column" gap="6">
        {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 hover:shadow-md transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold">Total Spent (This Page)</h3>
                    <p className="text-3xl font-bold text-gray-800">
                        {isLoadingHistory ? <Skeleton className="w-20 h-6" /> : `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 hover:shadow-md transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold">Pending Amount (This Page)</h3>
                    <p className="text-3xl font-bold text-amber-500">
                        {isLoadingHistory ? <Skeleton className="w-20 h-6" /> : `${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </p>
                </div>
            </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
            {[
                { label: 'Pay Provider', icon: <PlusIcon width="30" height="30" />,onClick:handlePayProvider},
                // { label: 'Add Method', icon: <CardStackIcon width="30" height="30" /> },
                // { label: 'Invoices', icon: <FileTextIcon width="30" height="30" /> },
                { label: 'Support', icon: <PersonIcon width="30" height="30" /> }
            ].map((action) => (
                <div key={action.label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600 cursor-pointer" onClick={action.onClick}>
                        {action.icon}
                    </div>
                    <p className="font-bold text-gray-800">{action.label}</p>
                </div>
            ))}
        </div>

        {/* Recent Activity Filters and Table */}
        <Flex direction="column" gap="4" className="mt-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            
            {/* Filters (Visual Only for now unless backend supports it) */}
            <Flex gap="4" direction={{ initial: 'column', sm: 'row' }} className="mb-2">
                <Tabs.Root defaultValue="all" className="w-full" value={selectedTab} onValueChange={(value)=>{
                    setSelectedTab(value);
                    getPaymentHistory();
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
                            <Table.ColumnHeaderCell>Provider</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Service</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {isLoadingHistory ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <Table.Row key={i}>
                                    <Table.RowHeaderCell>
                                        <Flex direction="column" gap="1">
                                            <Skeleton width="120px" height="20px" />
                                            <Skeleton width="80px" height="16px" />
                                        </Flex>
                                    </Table.RowHeaderCell>
                                    <Table.Cell><Skeleton width="100px" /></Table.Cell>
                                    <Table.Cell><Skeleton width="60px" /></Table.Cell>
                                    <Table.Cell><Skeleton width="80px" /></Table.Cell>
                                    <Table.Cell><Skeleton width="60px" /></Table.Cell>
                                    <Table.Cell><Skeleton width="70px" style={{ borderRadius: '999px' }} /></Table.Cell>
                                    <Table.Cell><Skeleton width="24px" height="24px" /></Table.Cell>
                                </Table.Row>
                            ))
                        ) : payments.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan="7" className="text-center py-10">
                                    <Text color="gray">No transactions found.</Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            payments.map((payment) => {
                                if(selectedTab === 'all' || selectedTab === payment.status.toLowerCase()){
                                    return(
                                <Table.Row key={payment.id}>
                                    <Table.RowHeaderCell>
                                        <Flex direction="column">
                                            <span className="font-medium">{payment.provider_name || 'Unknown'}</span>
                                            
                                        </Flex>
                                    </Table.RowHeaderCell>
                                    <Table.Cell>{payment.service || 'Custom Service'}</Table.Cell>
                                    <Table.Cell><code className="text-xs bg-gray-100 p-1 rounded">{payment.transaction_id?.substring(0,8)}...</code></Table.Cell>
                                    <Table.Cell>{dayjs(payment.created_at).format('MMM D, YYYY')}</Table.Cell>
                                    <Table.Cell className="font-medium">{payment.amount}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={payment.status.toLowerCase() === 'paid' ? 'green' : payment.status.toLowerCase() === 'pending' ? 'amber' : 'gray'} variant="solid" radius="full">
                                            {payment.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                            variant="ghost" 
                                            size="1" 
                                            onClick={() => handleDownloadInvoice(payment.id)}
                                            disabled={isDownloadingInvoice}
                                        >
                                            <div className={isDownloadingInvoice && downloadingInvoiceId === payment.id ? 'animate-download' : ''}>
                                                <DownloadIcon />
                                            </div>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            })
                        )}
                    </Table.Body>
                </Table.Root>
            </Card>
        </Flex>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <Flex justify="end" gap="2" align="center" className="mt-2">
                    <Button 
                        variant="soft" 
                        disabled={pagination.current_page === 1 || isLoadingHistory}
                        onClick={() => handlePageChange(Number(pagination.current_page) - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <Button 
                        variant="soft" 
                        disabled={pagination.current_page === pagination.last_page || isLoadingHistory}
                        onClick={() => handlePageChange(Number(pagination.current_page) + 1)}
                    >
                        Next
                    </Button>
                </Flex>
            )}
        </Flex>
    </div>
    );
}