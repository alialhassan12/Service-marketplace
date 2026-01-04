import { Flex, Box, Text, TextField, Button, Avatar, ScrollArea, Separator, Card, Badge, IconButton, Skeleton, Dialog, Spinner } from "@radix-ui/themes";
import { Search, Send, Plus, MoreVertical, ChevronLeft, MessageSquare, UserPlus, SearchCheck } from "lucide-react";
import { useMessagesStore } from '../../store/messagesStore';
import { useAuthStore } from '../../store/authStore';
import useClientDashboardStore from '../../store/clientDashboardStore';
import { useEffect, useRef, useState } from 'react';

const ContactSkeleton = () => (
    <Box p="3" style={{ borderRadius: 'var(--radius-3)' }}>
        <Flex gap="3" align="center">
            <Skeleton width="40px" height="40px" radius="full" />
            <Box style={{ flex: 1, minWidth: 0 }}>
                <Flex justify="between" align="center" gap="2" mb="2">
                    <Skeleton width="100px" height="15px" />
                    <Skeleton width="40px" height="10px" />
                </Flex>
                <Skeleton width="100%" height="12px" />
            </Box>
        </Flex>
    </Box>
);

const MessageSkeleton = ({ isMe }) => (
    <Flex justify={isMe ? 'end' : 'start'} direction="column" align={isMe ? 'end' : 'start'}>
        <Skeleton 
            width={isMe ? "60%" : "70%"} 
            height="40px" 
            style={{ borderRadius: 'var(--radius-4)' }} 
        />
        <Skeleton width="40px" height="10px" mt="1" />
    </Flex>
);

export default function ClientMessagesPage() {
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const [mobileView, setMobileView] = useState('list');
    const {authUser}=useAuthStore();
    const {contacts,loadingContacts,getContacts,messages,loadingMessages,getMessages,sendMessage,loadingSendMessage,subscribeToMessages, addContact,addingContact}=useMessagesStore();
    const {suggestedProviders, getSuggestedProviders, searchProvidersResults, searchProviders, searchingProviders} = useClientDashboardStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQueryNew, setSearchQueryNew] = useState("");
    const [searchContacts,setSearchContacts] = useState("");
    const [addingContactId, setAddingContactId] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        getContacts();
    }, []);
    
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (selectedContact && authUser) {
            const unsubscribe = subscribeToMessages(authUser.id, selectedContact.id);
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [selectedContact, authUser]);

    const handleContactSelect = (contact) => {
        getMessages(contact.id);
        setSelectedContact(contact);
        setMobileView('chat');
    };

    const handleSendMessage=()=>{
        if(messageInput.trim() !== ''){
            sendMessage(selectedContact.id,messageInput);
            setMessageInput('');
        }
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedContact(null);
    };

    const handleSearchNew = (query) => {
        searchProviders(query);
    };

    const handleSelectProvider = async (provider) => {
        const existingContact = contacts.find(c => c.id === provider.id);
        if (existingContact) {
            handleContactSelect(existingContact);
            setIsDialogOpen(false);
            setSearchQueryNew("");
        } else {
            setAddingContactId(provider.id);
            try {
                const success = await addContact(provider.id);
                if (success) {
                    handleContactSelect(provider);
                    setIsDialogOpen(false);
                    setSearchQueryNew("");
                }
            } finally {
                setAddingContactId(null);
            }
        }
    };

    return (
        <Flex direction="column" className="h-screen bg-bg-1 overflow-hidden">
            <Box style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
                <Flex style={{ width: '100%', height: '100%' }}>
                    {/* Contacts List Sidebar */}
                    <Box 
                        className="contact-list-container flex flex-col shrink-0 bg-card border-r border-border-subtle"
                        style={{ 
                            width: '350px', 
                        }}
                    >
                        {/* CSS Hack for media query logic */}
                        <style>{`
                            @media (max-width: 1023px) {
                                .contact-list-container { 
                                    width: 100% !important; 
                                    display: ${mobileView === 'chat' ? 'none' : 'flex'} !important; 
                                }
                                .chat-area-container { display: ${mobileView === 'list' ? 'none' : 'flex'} !important; }
                                .chat-header-container { padding-left: 65px !important; }
                            }
                            @media (min-width: 1024px) {
                                .contact-list-container { display: flex !important; width: 350px !important; }
                                .chat-area-container { display: flex !important; }
                                .mobile-back-button { display: none !important; }
                            }
                        `}</style>

                        <Box p="4" className="border-b border-border-subtle"> 
                            <Flex justify="between" align="center" mb="4">
                                <Text size="5" weight="bold" className="text-primary">Messages</Text>
                                {/* Add new contact Dialog */}
                                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <Dialog.Trigger>
                                        <IconButton variant="ghost" color="gray" onClick={() => {
                                            getSuggestedProviders();
                                            setIsDialogOpen(true);
                                        }}>
                                            <Plus size={18} />
                                        </IconButton>
                                    </Dialog.Trigger>

                                    <Dialog.Content style={{ maxWidth: 450 }}>
                                        <Dialog.Title>Add New Contact</Dialog.Title>
                                        <Dialog.Description size="2" mb="4">
                                            Search for a provider by name to start a new conversation.
                                        </Dialog.Description>

                                        <Flex direction="column" gap="3">
                                            <Flex direction="row" gap="2" align="center">
                                                <TextField.Root
                                                    placeholder="Search providers..."
                                                    value={searchQueryNew}
                                                    style={{ flex: 1 }}
                                                    onChange={(e) => setSearchQueryNew(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSearchNew(searchQueryNew);
                                                    }}
                                                >
                                                    <TextField.Slot>
                                                        <Search size={16} />
                                                    </TextField.Slot>
                                                </TextField.Root>
                                                <Button variant="solid" color="blue" loading={searchingProviders} onClick={() => handleSearchNew(searchQueryNew)}>
                                                    Search
                                                </Button>
                                            </Flex>

                                            <ScrollArea scrollbars="vertical" style={{ height: '300px' }}>
                                                <Flex direction="column" gap="2">
                                                    {(
                                                        <>
                                                            {searchingProviders ? (
                                                                <Flex justify="center" p="4"><Skeleton width="100%" height="20px" /></Flex>
                                                            ) : searchProvidersResults.length > 0 ? (
                                                                searchProvidersResults.map(provider => (
                                                                    <Card key={provider.id} style={{ cursor: 'pointer', opacity: addingContactId ? (addingContactId === provider.id ? 1 : 0.5) : 1, pointerEvents: addingContactId ? 'none' : 'auto' }} onClick={() => handleSelectProvider(provider)}>
                                                                        <Flex gap="3" align="center">
                                                                            <Avatar src={`http://localhost:8000/storage/${provider.profile_picture}`} fallback={provider.name[0]} radius="full" />
                                                                             <Box style={{ flex: 1 }}>
                                                                                 <Text size="2" weight="bold" className="text-primary">{provider.name}</Text>
                                                                                 <Text size="1" className="block text-secondary">{provider.bio || 'Professional Provider'}</Text>
                                                                             </Box>
                                                                            <IconButton variant="ghost" color="blue" disabled={addingContactId}>
                                                                                {addingContactId === provider.id ? <Spinner size="1" /> : <UserPlus size={16} />}
                                                                            </IconButton>
                                                                        </Flex>
                                                                    </Card>
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </>
                                                    )}
                                                        <>
                                                            <Text size="1" color="gray" weight="bold" mb="1">Suggested Providers</Text>
                                                            {suggestedProviders.map(provider => (
                                                                <Card key={provider.id} style={{ cursor: 'pointer', opacity: addingContactId ? (addingContactId === provider.id ? 1 : 0.5) : 1, pointerEvents: addingContactId ? 'none' : 'auto' }} onClick={() => handleSelectProvider(provider)}>
                                                                    <Flex gap="3" align="center">
                                                                        <Avatar src={`http://localhost:8000/storage/${provider.profile_picture}`} fallback={provider.name[0]} radius="full" />
                                                                         <Box style={{ flex: 1 }}>
                                                                             <Text size="2" weight="bold" className="text-primary">{provider.name}</Text>
                                                                             <Text size="1" className="block text-secondary">{provider.bio || 'Professional Provider'}</Text>
                                                                         </Box>
                                                                        <IconButton variant="ghost" color="blue" disabled={addingContactId}>
                                                                            {addingContactId === provider.id ? <Spinner size="1" /> : <UserPlus size={16} />}
                                                                        </IconButton>
                                                                    </Flex>
                                                                </Card>
                                                            ))}
                                                        </>
                                                </Flex>
                                            </ScrollArea>
                                        </Flex>

                                        <Flex gap="3" mt="4" justify="end">
                                            <Dialog.Close>
                                                <Button variant="soft" color="gray">Cancel</Button>
                                            </Dialog.Close>
                                        </Flex>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </Flex>
                            <TextField.Root
                                placeholder="Search contacts..."
                                style={{ width: '100%' }}
                                value={searchContacts}
                                onChange={(e) => setSearchContacts(e.target.value)}
                            >
                                <TextField.Slot>
                                    <Search size={16} />
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        <ScrollArea scrollbars="vertical" style={{ flex: 1 }}>
                            <Flex direction="column" gap="1" p="2">
                                {loadingContacts ? (
                                    <>
                                        {[...Array(6)].map((_, i) => <ContactSkeleton key={i} />)}
                                    </>
                                ) : (
                                    contacts.map((contact) => {
                                        if(contact.name.toLowerCase().includes(searchContacts.toLowerCase())){
                                            return(
                                                    <Box
                                                        key={contact.id}
                                                        p="3"
                                                        style={{
                                                            borderRadius: 'var(--radius-3)',
                                                            cursor: 'pointer',
                                                            backgroundColor: selectedContact?.id === contact.id ? 'var(--accent-3)' : 'transparent',
                                                            transition: 'background-color 0.2s',
                                                            overflow: 'hidden',
                                                        }}
                                                        onClick={() => handleContactSelect(contact)}
                                                    >
                                                    <Flex gap="3" align="center"  style={{ width: '100%' }}>
                                                        <Box position="relative" style={{ flexShrink: 0 }}>
                                                            <Avatar
                                                                size="3"
                                                                src={`http://localhost:8000/storage/${contact.profile_picture}`}
                                                                fallback={(contact.name?.[0] || contact.email?.[0] || '?').toUpperCase()}
                                                                radius="full"
                                                            />
                                                        </Box>
                                                        <Box style={{ flex: 1, minWidth: 0 }}>
                                                            <Flex justify="arround" align="center" gap="2">
                                                                 <Text weight="bold" size="2" className="text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                     {contact.name}
                                                                 </Text>
                                                                 <Text size="1" className="text-secondary shrink-0">{contact.time}</Text>
                                                             </Flex>
                                                             <Flex justify="between" align="center" gap="2">
                                                                 <Text size="2" className="text-secondary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                 {contact.lastMessage}
                                                             </Text>
                                                            {contact.unread > 0 && (
                                                                <Badge color="blue" variant="solid" radius="full" style={{ flexShrink: 0 }}>
                                                                    {contact.unread}
                                                                </Badge>
                                                            )}
                                                        </Flex>
                                                    </Box>
                                                </Flex>
                                            </Box>
                                            )
                                        }
                                    })
                                )}
                            </Flex>
                        </ScrollArea>
                    </Box>

                    {/* Chat Area */}
                    <Flex direction="column" className="chat-area-container flex-1 min-w-0 bg-card">
                        {selectedContact ? (
                            <>
                                {/* Chat Header */}
                                <Box p="3" className="chat-header-container bg-bg-1 border-b border-border-subtle">
                                    <Flex justify="between" align="center"> 
                                        <Flex gap="3" align="center" >
                                            <IconButton 
                                                variant="ghost" 
                                                color="gray" 
                                                className="mobile-back-button"
                                                onClick={handleBackToList}
                                            >
                                                <ChevronLeft size={24} />
                                            </IconButton>
                                            <Avatar
                                                size="3"
                                                src={`http://localhost:8000/storage/${selectedContact.profile_picture}`}
                                                fallback={(selectedContact.name?.[0] || selectedContact.email?.[0] || '?').toUpperCase()}
                                                radius="full"
                                            />
                                             <Box>
                                                <Text weight="bold" size="3" className="text-primary">{selectedContact.name}</Text>
                                            </Box>
                                        </Flex>
                                        <IconButton variant="ghost" color="gray">
                                            <MoreVertical size={20} />
                                        </IconButton>
                                    </Flex>
                                </Box>

                                {/* Message History */}
                                <ScrollArea scrollbars="vertical" style={{ flex: 1, padding: '20px' }} className="bg-bg-1">
                                    <Flex direction="column" gap="4">
                                        {loadingMessages ? (
                                            <>
                                                <MessageSkeleton isMe={false} />
                                                <MessageSkeleton isMe={true} />
                                                <MessageSkeleton isMe={false} />
                                                <MessageSkeleton isMe={true} />
                                            </>
                                        ) : messages.length > 0 ? (
                                            <>
                                                {messages.map((msg) => (
                                                    <Flex
                                                        key={msg.id}
                                                        justify={authUser.id === msg.sender_id ? 'end' : 'start'}
                                                        direction="column"
                                                        align={authUser.id === msg.sender_id ? 'end' : 'start'}
                                                    >
                                                        <Box
                                                            p="3"
                                                            style={{
                                                                maxWidth: '85%',
                                                                borderRadius: 'var(--radius-4)',
                                                                backgroundColor: authUser.id === msg.sender_id ? 'var(--blue-9)' : 'var(--color-card)',
                                                                color: authUser.id === msg.sender_id ? 'white' : 'var(--text-primary)',
                                                                boxShadow: 'var(--shadow-soft)',
                                                                border: authUser.id === msg.sender_id ? 'none' : '1px solid var(--border-subtle)'
                                                            }}
                                                        >
                                                            <Text size="2" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.message}</Text>
                                                        </Box>
                                                        <Text size="1" mt="1" className="text-secondary">{new Date(msg.created_at).toLocaleString()}</Text>
                                                    </Flex>
                                                ))}
                                                {loadingSendMessage && <MessageSkeleton isMe={true} />}
                                                <div ref={messagesEndRef} />
                                            </>
                                        ) : (
                                            <Flex direction="column" align="center" justify="center" style={{ height: '100%', opacity: 0.5 }} mt="9">
                                                <Text size="4" className="text-secondary">Say hello to {selectedContact.name}!</Text>
                                                {loadingSendMessage && <MessageSkeleton isMe={true} />}
                                            </Flex>
                                        )}
                                    </Flex>
                                </ScrollArea>

                                {/* Input Area */}
                                <Box p="4" className="bg-card border-t border-border-subtle">
                                    <Flex gap="3">
                                        <TextField.Root
                                            placeholder="Type a message..."
                                            style={{ flex: 1 }}
                                            size="3"
                                            value={messageInput}
                                            disabled={loadingSendMessage}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && messageInput.trim()) {
                                                    handleSendMessage();
                                                }
                                            }}
                                        >
                                        </TextField.Root>
                                        <Button
                                            size="3"
                                            variant="solid"
                                            loading={loadingSendMessage}
                                            onClick={() => {
                                                if (messageInput.trim()) handleSendMessage();
                                            }}
                                        >
                                            <Send size={18} />
                                            <Text className="hidden sm:inline">Send</Text>
                                        </Button>
                                    </Flex>
                                </Box>
                            </>
                        ) : (
                            <Flex direction="column" align="center" justify="center" style={{ height: '100%' }} className="bg-bg-1">
                                <Box p="6" style={{ borderRadius: '50%' }} className="bg-hover-bg mb-4">
                                    <MessageSquare size={48} className="text-secondary" />
                                </Box>
                                <Text size="5" weight="bold" className="text-primary">Your Messages</Text>
                                <Text size="2" className="text-secondary mt-1">Select a conversation to start chatting.</Text>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
}
