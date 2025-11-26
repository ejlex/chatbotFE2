import axios from 'axios';

export const ENDPOINT = import.meta.env.VITE_ENDPOINT || 'http://localhost:3000/message';

export async function sendChatMessage({ userId, message }) {
  const res = await axios.post(ENDPOINT, { userId, message });
  return res.data || {};
}
