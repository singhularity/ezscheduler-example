import React from 'react';
import './Notification.css';

interface NotificationProps {
  message: string;
  isError: boolean;
  show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, isError, show }) => {
  if (!message || !show) {
    return null;
  }

  return (
    <div className={`notification ${show ? 'show' : ''} ${isError ? 'error' : ''}`}>
      {message}
    </div>
  );
};

export default Notification;
