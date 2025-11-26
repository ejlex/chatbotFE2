import React from 'react';

export default function ChatBubble({ text, from, direction, time }) {
  const stamp = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
  }).format(time);

  return (
    <div className={`bubble ${direction}`}>
      <div>{text}</div>
      <div className="meta">
        <span>{from}</span>
        <span>•</span>
        <span>{stamp}</span>
      </div>
    </div>
  );
}
