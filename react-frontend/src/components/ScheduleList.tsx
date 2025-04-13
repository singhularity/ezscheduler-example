import React from 'react';
import './ScheduleList.css';

interface ScheduleListProps {
  schedules: { id: string; name: string }[];
  loading: boolean;
  onLoadSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  activeScheduleId?: string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ 
  schedules, 
  loading, 
  onLoadSchedule, 
  onDeleteSchedule,
  activeScheduleId
}) => {
  if (loading) {
    return (
      <div className="schedule-list-container">
        <h3>Saved Schedules</h3>
        <div className="schedule-list">
          <p className="loading">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-list-container">
      <h3>Saved Schedules</h3>
      <div className="schedule-list">
        {schedules.length === 0 ? (
          <p>No saved schedules</p>
        ) : (
          schedules.map(schedule => (
            <div 
              key={schedule.id} 
              className={`schedule-item ${schedule.id === activeScheduleId ? 'active' : ''}`}
            >
              <div className="schedule-name">{schedule.name}</div>
              <div className="schedule-item-actions">
                <button 
                  className="action-button"
                  onClick={() => onLoadSchedule(schedule.id)}
                >
                  Load
                </button>
                <button 
                  className="action-button delete"
                  onClick={() => onDeleteSchedule(schedule.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleList;
