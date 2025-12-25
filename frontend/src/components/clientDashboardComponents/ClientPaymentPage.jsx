import { Box, Flex, Card, Button, Badge, Table, TextField, Select } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlusIcon, DownloadIcon, CardStackIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

// Dummy Data
const summaryStats = {
    totalSpent: 4550.00,
    pendingAmount: 850.00
};

const transactions = [
    { id: 1, provider: 'Alice Smith', service: 'Logo Design', date: '2023-10-25', amount: 150.00, status: 'paid' },
    { id: 2, provider: 'Bob Jones', service: 'Web Development', date: '2023-10-22', amount: 850.00, status: 'pending' },
    { id: 3, provider: 'Charlie Day', service: 'SEO Audit', date: '2023-10-20', amount: 200.00, status: 'paid' },
    { id: 4, provider: 'Diane Wu', service: 'Content Writing', date: '2023-10-15', amount: 120.00, status: 'refunded' },
    { id: 5, provider: 'Evan Roe', service: 'Social Media', date: '2023-10-10', amount: 300.00, status: 'paid' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'paid': return 'green';
        case 'pending': return 'amber';
        case 'refunded': return 'gray';
        default: return 'gray';
    }
};

export default function ClientPaymentPage() {
    const navigate = useNavigate();
    // handle navigations
    const handlePayProvider = () => {
        navigate('/client/pay-provider');
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
                    <h3 className="text-gray-500 text-sm font-bold">Total Spent (This Month)</h3>
                    <p className="text-3xl font-bold text-gray-800">
                        ${summaryStats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 hover:shadow-md transition-all duration-300">
                    <h3 className="text-gray-500 text-sm font-bold">Pending Amount</h3>
                    <p className="text-3xl font-bold text-amber-500">
                        ${summaryStats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
                { label: 'Pay Provider', icon: <PlusIcon width="30" height="30" />,onClick:handlePayProvider},
                { label: 'Add Method', icon: <CardStackIcon width="30" height="30" /> },
                { label: 'Invoices', icon: <FileTextIcon width="30" height="30" /> },
                { label: 'Support', icon: <PersonIcon width="30" height="30" /> }
            ].map((action) => (
                <div key={action.label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600" onClick={action.onClick}>
                        {action.icon}
                    </div>
                    <p className="font-bold text-gray-800">{action.label}</p>
                </div>
            ))}
        </div>

        {/* Recent Activity Filters and Table */}
        <Flex direction="column" gap="4" className="mt-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                <TextField.Root placeholder="Search transactions..." style={{ flex: 1 }}>
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Select.Root defaultValue="all">
                    <Select.Trigger placeholder="Filter by status" />
                    <Select.Content>
                        <Select.Item value="all">All Statuses</Select.Item>
                        <Select.Item value="paid">Paid</Select.Item>
                        <Select.Item value="pending">Pending</Select.Item>
                        <Select.Item value="refunded">Refunded</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>

            {/* Transactions Table */}
            <Card>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Provider</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Service</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {transactions.map((tx) => (
                        <Table.Row key={tx.id}>
                            <Table.RowHeaderCell>{tx.provider}</Table.RowHeaderCell>
                            <Table.Cell>{tx.service}</Table.Cell>
                            <Table.Cell>{tx.date}</Table.Cell>
                            <Table.Cell>${tx.amount.toFixed(2)}</Table.Cell>
                            <Table.Cell>
                                <Badge color={getStatusColor(tx.status)}>{tx.status}</Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Button variant="ghost" size="1">
                                    <DownloadIcon />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
                </Table.Root>
            </Card>
        </Flex>

            {/* Pagination (Visual only) */}
            <Flex justify="end" gap="2" align="center">
                <Button variant="soft" disabled>Previous</Button>
                <span className="text-sm font-medium">Page 1 of 5</span>
                <Button variant="soft">Next</Button>
            </Flex>
        </Flex>
    </div>
    );
}