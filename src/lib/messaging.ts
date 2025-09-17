import { supabase } from "@/integrations/supabase/client";

export async function sendMessage(
  senderId: string,
  receiverId: string,
  subject: string,
  message: string
) {
  try {
    // Insert message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        subject,
        message,
        conversation_id: `${senderId}-${receiverId}`
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Create notification for recipient (check if not already exists to prevent duplicates)
    const { data: existingNotif } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', receiverId)
      .eq('related_id', messageData.id)
      .eq('type', 'message')
      .maybeSingle();

    if (!existingNotif) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: receiverId,
          title: 'New Message Received',
          message: `You have received a new message: ${subject}`,
          type: 'message',
          related_id: messageData.id,
          related_type: 'message'
        });

      if (notificationError) throw notificationError;
    }

    return { data: messageData, error: null };
  } catch (error) {
    console.error("Error sending message:", error);
    return { data: null, error };
  }
}

export async function getMessages(userId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(name, email),
        receiver:receiver_id(name, email)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { data: null, error };
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { error };
  }
}