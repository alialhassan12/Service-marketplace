import { Flex, Card, Button, Badge, Table, TextField, Select } from '@radix-ui/themes';
import { MagnifyingGlassIcon, DownloadIcon, FileTextIcon } from '@radix-ui/react-icons';

// Dummy Data
const earningsStats = {
    totalIncome: 12500.00,
    invoicesCount: 24
};

const transactions = [
    { id: 1, client: 'John Doe', service: 'Logo Design', date: '2023-10-25', amount: 150.00, status: 'paid' },
    { id: 2, client: 'Sarah Connor', service: 'Web Development', date: '2023-10-22', amount: 850.00, status: 'pending' },
    { id: 3, client: 'Bruce Wayne', service: 'SEO Audit', date: '2023-10-20', amount: 200.00, status: 'paid' },
    { id: 4, client: 'Diana Prince', service: 'Content Writing', date: '2023-10-15', amount: 120.00, status: 'refunded' },
    { id: 5, client: 'Clark Kent', service: 'Social Media', date: '2023-10-10', amount: 300.00, status: 'paid' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'paid': return 'green';
        case 'pending': return 'amber';
        case 'refunded': return 'gray';
        default: return 'gray';
    }
};

const handleDownloadInvoice = (transactionId) => {
    // In a real application, this would trigger a backend API call or use a library like jsPDF
    // to generate and download the PDF invoice.
    console.log(`Downloading PDF invoice for transaction ${transactionId}...`);
    alert(`Downloading Invoice #${transactionId} as PDF...`);
};

export default function ProviderEarningsPage() {
    return (
        <div className="flex flex-col w-full p-10" data-aos="fade-up">
            {/* Header Section */}
            <div className="w-full mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Earnings</h1>
            </div>

            <Flex direction="column" gap="6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 hover:shadow-md transition-all duration-300">
                        <h3 className="text-gray-500 text-sm font-bold">Total Income</h3>
                        <p className="text-3xl font-bold text-green-600">
                            ${earningsStats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between gap-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold">Invoices</h3>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-bold text-gray-800">
                                    {earningsStats.invoicesCount}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button size="1" variant="soft" onClick={() => alert("Downloading Invoices Report...")}>
                                <DownloadIcon /> Download PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Filters and Table */}
                <Flex direction="column" gap="4" className="mt-4">
                    <h2 className="text-xl font-bold">Transaction History</h2>
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
                                    <Table.ColumnHeaderCell>Client</Table.ColumnHeaderCell>
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
                                        <Table.RowHeaderCell>{tx.client}</Table.RowHeaderCell>
                                        <Table.Cell>{tx.service}</Table.Cell>
                                        <Table.Cell>{tx.date}</Table.Cell>
                                        <Table.Cell>${tx.amount.toFixed(2)}</Table.Cell>
                                        <Table.Cell>
                                            <Badge color={getStatusColor(tx.status)}>{tx.status}</Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex gap-2">
                                                 <Button 
                                                    variant="ghost" 
                                                    size="1" 
                                                    onClick={() => handleDownloadInvoice(tx.id)}
                                                    title="Download Invoice PDF"
                                                >
                                                    <DownloadIcon />
                                                </Button>
                                                <Button variant="ghost" size="1">
                                                    <FileTextIcon />
                                                </Button>
                                            </div>
                                           
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Card>
                </Flex>

                {/* Pagination */}
                <Flex justify="end" gap="2" align="center">
                    <Button variant="soft" disabled>Previous</Button>
                    <span className="text-sm font-medium">Page 1 of 5</span>
                    <Button variant="soft">Next</Button>
                </Flex>
            </Flex>
        </div>
    );
}