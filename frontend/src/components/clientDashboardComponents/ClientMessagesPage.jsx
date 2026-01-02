import { Flex, Box, Text, TextField, Button, Avatar, ScrollArea, Separator, Card, Badge, IconButton, Skeleton } from "@radix-ui/themes";
import { Search, Send, Plus, MoreVertical, ChevronLeft, MessageSquare } from "lucide-react";
import { useMessagesStore } from '../../store/messagesStore';
import { useAuthStore } from '../../store/authStore';
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
    const {contacts,loadingContacts,getContacts,messages,loadingMessages,getMessages,sendMessage,loadingSendMessage,subscribeToMessages}=useMessagesStore();

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

    return (
        <Flex direction="column" style={{ height: '100vh', backgroundColor: 'var(--gray-2)', overflow: 'hidden' }}>
            <Box style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
                <Flex style={{ width: '100%', height: '100%' }}>
                    {/* Contacts List Sidebar */}
                    <Box 
                        className="contact-list-container"
                        style={{ 
                            width: '350px', 
                            flexShrink: 0,
                            borderRight: '1px solid var(--gray-5)', 
                            display: mobileView === 'chat' ? 'none' : 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
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

                        <Box p="4" style={{ borderBottom: '1px solid var(--gray-5)' }}> 
                            <Flex justify="between" align="center" mb="4">
                                <Text size="5" weight="bold">Messages</Text>
                                <IconButton variant="ghost" color="gray">
                                    <Plus size={18} />
                                </IconButton>
                            </Flex>
                            <TextField.Root
                                placeholder="Search contacts..."
                                style={{ width: '100%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                    contacts.map((contact) => (
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
                                                        fallback={contact.name[0].toUpperCase()}
                                                        radius="full"
                                                    />
                                                </Box>
                                                <Box style={{ flex: 1, minWidth: 0 }}>
                                                    <Flex justify="arround" align="center" gap="2">
                                                        <Text weight="bold" size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {contact.name}
                                                        </Text>
                                                        <Text color="gray" size="1" style={{ flexShrink: 0 }}>{contact.time}</Text>
                                                    </Flex>
                                                    <Flex justify="between" align="center" gap="2">
                                                        <Text color="gray" size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                                    ))
                                )}
                            </Flex>
                        </ScrollArea>
                    </Box>

                    {/* Chat Area */}
                    <Flex direction="column" className="chat-area-container" style={{ flex: 1, minWidth: 0, backgroundColor: 'white' }}>
                        {selectedContact ? (
                            <>
                                {/* Chat Header */}
                                <Box p="3" className="chat-header-container" style={{ borderBottom: '1px solid var(--gray-5)', backgroundColor: 'var(--gray-1)' }}>
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
                                                fallback={selectedContact.name[0].toUpperCase()}
                                                radius="full"
                                            />
                                            <Box>
                                                <Text weight="bold" size="3">{selectedContact.name}</Text>
                                            </Box>
                                        </Flex>
                                        <IconButton variant="ghost" color="gray">
                                            <MoreVertical size={20} />
                                        </IconButton>
                                    </Flex>
                                </Box>

                                {/* Message History */}
                                <ScrollArea scrollbars="vertical" style={{ flex: 1, padding: '20px', backgroundColor: 'var(--gray-1)' }}>
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
                                                                backgroundColor: authUser.id === msg.sender_id ? 'var(--accent-9)' : 'white',
                                                                color: authUser.id === msg.sender_id ? 'white' : 'var(--gray-12)',
                                                                boxShadow: 'var(--shadow-1)',
                                                                border: authUser.id === msg.sender_id ? 'none' : '1px solid var(--gray-4)'
                                                            }}
                                                        >
                                                            <Text size="2" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.message}</Text>
                                                        </Box>
                                                        <Text size="1" color="gray" mt="1">{new Date(msg.created_at).toLocaleString()}</Text>
                                                    </Flex>
                                                ))}
                                                {loadingSendMessage && <MessageSkeleton isMe={true} />}
                                                <div ref={messagesEndRef} />
                                            </>
                                        ) : (
                                            <Flex direction="column" align="center" justify="center" style={{ height: '100%', opacity: 0.5 }} mt="9">
                                                <Text size="4" color="gray">Say hello to {selectedContact.name}!</Text>
                                                {loadingSendMessage && <MessageSkeleton isMe={true} />}
                                            </Flex>
                                        )}
                                    </Flex>
                                </ScrollArea>

                                {/* Input Area */}
                                <Box p="4" style={{ borderTop: '1px solid var(--gray-5)', backgroundColor: 'white' }}>
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
                            <Flex direction="column" align="center" justify="center" style={{ height: '100%', backgroundColor: 'var(--gray-1)' }}>
                                <Box p="6" style={{ borderRadius: '50%', backgroundColor: 'var(--gray-3)', marginBottom: '16px' }}>
                                    <MessageSquare size={48} color="var(--gray-9)" />
                                </Box>
                                <Text size="5" weight="bold" color="gray">Your Messages</Text>
                                <Text size="2" color="gray" mt="1">Select a conversation to start chatting.</Text>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
}
