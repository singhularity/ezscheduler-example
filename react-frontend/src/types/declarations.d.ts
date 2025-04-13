/**
 * TypeScript declarations for local modules
 */

// Declare component modules
declare module './components/ScheduleInfo' {
  import React from 'react';
  import { Schedule } from 'ezscheduler';
  
  interface ScheduleInfoProps {
    schedule: Schedule | null;
  }
  
  const ScheduleInfo: React.FC<ScheduleInfoProps>;
  export default ScheduleInfo;
}

declare module './components/NewScheduleModal' {
  import React from 'react';
  
  interface NewScheduleModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (scheduleName: string, timeZone: string) => void;
  }
  
  const NewScheduleModal: React.FC<NewScheduleModalProps>;
  export default NewScheduleModal;
}

declare module './components/ImportModal' {
  import React from 'react';
  import { Schedule } from 'ezscheduler';
  
  interface ImportModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (schedule: Schedule) => void;
  }
  
  const ImportModal: React.FC<ImportModalProps>;
  export default ImportModal;
}

declare module './components/Notification' {
  import React from 'react';
  
  interface NotificationProps {
    message: string;
    isError: boolean;
    show: boolean;
  }
  
  const Notification: React.FC<NotificationProps>;
  export default Notification;
}

declare module './services/api' {
  import { Schedule } from 'ezscheduler';
  
  export function fetchSchedules(): Promise<{ id: string; name: string }[]>;
  export function getSchedule(id: string): Promise<Schedule>;
  export function saveSchedule(schedule: Schedule): Promise<Schedule>;
  export function deleteSchedule(id: string): Promise<void>;
}

// Declare CSS modules
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
