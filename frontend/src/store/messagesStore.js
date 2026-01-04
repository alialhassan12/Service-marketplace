import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import { supabase } from '../lib/supabase';

export const useMessagesStore = create((set, get) => ({
    contacts:[],
    loadingContacts:false,
    getContacts:async()=>{
        set({loadingContacts:true});
        try {
            const response = await axiosInstance.get('/messages/contacts');
            set({contacts:response.data.contacts});
            console.log(response.data.contacts);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            set({loadingContacts:false});
        }
    },
    messages:[],
    loadingMessages:false,
    getMessages:async(id)=>{
        set({loadingMessages:true});
        try {
            const response = await axiosInstance.get('/messages/'+id);
            set({messages:response.data.messages});
            console.log(response.data.messages);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            set({loadingMessages:false});
        }
    },
    loadingSendMessage:false,
    sendMessage: async (id, messageText) => {
        set({loadingSendMessage:true});
        try {
            const response = await axiosInstance.post('/messages/sendMessage/' + id, { message: messageText });
            const newMessage = response.data.message_data;
            
            // Note: We don't necessarily need to append here if the realtime listener is active,
            // but it helps with "instant" feel.
            set((state) => ({
                messages: state.messages.some(m => m.id === newMessage.id) 
                    ? state.messages 
                    : [...state.messages, newMessage]
            }));
            
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            set({loadingSendMessage:false});
        }
    },
    addingContact:false,
    addContact:async(receiver_id)=>{
        set({addingContact:true});
        try {
            const response = await axiosInstance.post('/messages/contacts/addContact', { receiver_id });
            const messageData = response.data.contact_data;
            
            // The contact is the receiver (the person we just messaged)
            const newContact = messageData.receiver;
            
            set((state) => ({
                contacts: state.contacts.some(c => c.id === newContact.id) 
                    ? state.contacts 
                    : [newContact, ...state.contacts]
            }));
            
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        finally{
            set({addingContact:false});
        }
    },

    subscribeToMessages: (currentUserId, contactId) => {
        const channel = supabase
            .channel(`chat_${currentUserId}_${contactId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages' 
            }, payload => {
                const newMessage = payload.new;
                
                // Only update if the message belongs to this conversation
                const isRelevant = 
                    (newMessage.sender_id === currentUserId && newMessage.receiver_id === contactId) ||
                    (newMessage.sender_id === contactId && newMessage.receiver_id === currentUserId);

                if (isRelevant) {
                    set((state) => {
                        // Prevent duplicate if we already added it via sendMessage response
                        if (state.messages.some(m => m.id === newMessage.id)) return state;
                        return { messages: [...state.messages, newMessage] };
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
}));
