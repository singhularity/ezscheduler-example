import React, { useState, useEffect } from 'react';
import * as SchedulerWidget from 'ezscheduler';
import type { Schedule as PackageSchedule, ScheduleDetail as PackageScheduleDetail } from 'ezscheduler';
import {
  Box,
  Button,

  Typography,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  FileDownload as ImportIcon,
  FileUpload as ExportIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

import ScheduleList from './components/ScheduleList';
import ScheduleInfo from './components/ScheduleInfo';
import NewScheduleModal from './components/NewScheduleModal';
import ImportModal from './components/ImportModal';
import Notification from './components/Notification';
import { fetchSchedules, saveSchedule, deleteSchedule, getSchedule } from './services/api';
import './App.css';

interface ExtendedScheduleDetail extends SchedulerWidget.ScheduleDetail {
  description?: string;
}

const convertToPackageSchedule = (schedule: SchedulerWidget.Schedule): PackageSchedule => {
  if (!schedule || !schedule.scheduleDetails) {
    return {
      scheduleName: schedule?.scheduleName || 'New Schedule',
      timeZone: schedule?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      id: schedule?.id,
      scheduleDetails: []
    } as PackageSchedule;
  }

  return {
    ...schedule,
    scheduleDetails: schedule.scheduleDetails.map(detail => {
      const packageDetail: PackageScheduleDetail = {
        id: detail.id || '',
        startTime: detail.startTime,
        endTime: detail.endTime,
        startDate: detail.startDate || new Date().toISOString().split('T')[0],
        endDate: detail.endDate || new Date().toISOString().split('T')[0]
      };

      if (detail.title) packageDetail.title = detail.title;

      return packageDetail;
    })
  } as PackageSchedule;
};

const convertFromPackageSchedule = (schedule: PackageSchedule): SchedulerWidget.Schedule => {
  if (!schedule || !schedule.scheduleDetails) {
    return {
      scheduleName: schedule?.scheduleName || 'New Schedule',
      timeZone: schedule?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      id: schedule?.id,
      scheduleDetails: []
    };
  }

  return {
    ...schedule,
    scheduleDetails: schedule.scheduleDetails.map(detail => ({
      id: detail.id || '',
      startTime: detail.startTime,
      endTime: detail.endTime,
      startDate: detail.startDate,
      endDate: detail.endDate,
      title: detail.title
    }))
  };
};

const App: React.FC = () => {
  const [currentSchedule, setCurrentSchedule] = useState<SchedulerWidget.Schedule | null>(null);
  const [schedules, setSchedules] = useState<{ id: string; name: string }[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNewScheduleModal, setShowNewScheduleModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; isError: boolean; show: boolean }>({
    message: '',
    isError: false,
    show: false
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await fetchSchedules();
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading schedules:', error);
      showNotification('Failed to load schedules', true);
      setLoading(false);
    }
  };

  const handleLoadSchedule = async (scheduleId: string) => {
    try {
      const packageSchedule = await getSchedule(scheduleId);

      const schedule = convertFromPackageSchedule(packageSchedule);

      if (schedule.scheduleDetails) {
        schedule.scheduleDetails = schedule.scheduleDetails.map((detail: SchedulerWidget.ScheduleDetail) => {
          if (!detail.id) {
            detail.id = 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
          }
          return detail;
        });
      } else {
        schedule.scheduleDetails = [];
      }

      setCurrentSchedule(schedule);
      setSelectedDates([]);
      showNotification(`Schedule "${schedule.scheduleName}" loaded`);
    } catch (error) {
      console.error('Error loading schedule:', error);
      showNotification('Failed to load schedule', true);
    }
  };

  const handleSaveSchedule = async (scheduleToSave = currentSchedule) => {
    console.log('Saving schedule with name:', scheduleToSave?.scheduleName);

    if (!scheduleToSave || !scheduleToSave.scheduleName) {
      showNotification('Please create a schedule with a name before saving', true);
      setShowNewScheduleModal(true);
      return null;
    }

    try {
      const scheduleToProcess = JSON.parse(JSON.stringify(scheduleToSave));

      const scheduleWithIds = {
        ...scheduleToProcess,
        scheduleDetails: scheduleToProcess.scheduleDetails ? scheduleToProcess.scheduleDetails.map((detail: SchedulerWidget.ScheduleDetail) => {
          if (!detail.id) {
            detail.id = 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
          }
          return detail;
        }) : []
      };

      const packageSchedule = convertToPackageSchedule(scheduleWithIds);

      console.log('Saving schedule with details:', packageSchedule.scheduleDetails?.length || 0);

      const result = await saveSchedule(packageSchedule);

      const savedSchedule = convertFromPackageSchedule(result);

      console.log('Received saved schedule with details:', savedSchedule.scheduleDetails?.length || 0);

      if (!savedSchedule.scheduleDetails || savedSchedule.scheduleDetails.length === 0) {
        if (scheduleToProcess.scheduleDetails && scheduleToProcess.scheduleDetails.length > 0) {
          savedSchedule.scheduleDetails = scheduleToProcess.scheduleDetails;
          console.log('Restored schedule details from original schedule');
        }
      }

      console.log('Saved schedule name from backend:', savedSchedule.scheduleName);

      const displayName = savedSchedule.scheduleName || 'New Schedule';
      console.log('Display name to use in schedules list:', displayName);

      setSchedules(prevSchedules => {
        const filteredSchedules = prevSchedules.filter(s => !s.id.startsWith('temp-'));

        if (savedSchedule.id && filteredSchedules.some(s => s.id === savedSchedule.id)) {
          return filteredSchedules.map(s =>
            s.id === savedSchedule.id ? { id: savedSchedule.id, name: displayName } : s
          );
        } else if (savedSchedule.id) {
          return [...filteredSchedules, { id: savedSchedule.id, name: displayName }];
        }
        return filteredSchedules;
      });

      setCurrentSchedule(savedSchedule);

      showNotification(`Schedule "${savedSchedule.scheduleName}" saved`);
      return savedSchedule;
    } catch (error) {
      console.error('Error saving schedule:', error);
      showNotification('Failed to save schedule', true);
      return null;
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      loadSchedules();
      setCurrentSchedule(null);
      showNotification('Schedule deleted successfully', false);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showNotification('Failed to delete schedule', true);
    }
  };

  const handleImportSchedule = async (importedSchedule: SchedulerWidget.Schedule) => {
    try {
      await saveSchedule(importedSchedule);
      loadSchedules();
      showNotification('Schedule imported successfully', false);
    } catch (error) {
      console.error('Error importing schedule:', error);
      showNotification('Failed to import schedule', true);
    }
  };

  const createEmptySchedule = () => {
    setCurrentSchedule({
      scheduleName: 'Untitled Schedule',
      timeZone: 'America/New_York',
      scheduleDetails: [],
      id: generateUniqueId()
    });
    setSelectedDates([]);
  };

  const generateUniqueId = (): string => {
    return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleScheduleChange = (newSchedule: PackageSchedule) => {
    setCurrentSchedule(convertFromPackageSchedule(newSchedule));
  };

  const handleDetailedScheduleChange = (newSchedule: PackageSchedule, changeType: string, detailId?: string) => {
    if (changeType === 'add' && selectedDates.length > 1 && detailId) {
      const newSlot = newSchedule.scheduleDetails.find(detail => detail.id === detailId);

      if (newSlot) {
        const newSlotDate = newSlot.startDate;

        const existingDetails = newSchedule.scheduleDetails.filter(detail => detail.id !== detailId);

        const allSlots: PackageScheduleDetail[] = [];

        selectedDates.forEach(date => {
          const formattedDate = formatDate(date);

          if (formattedDate === newSlotDate) {
            allSlots.push(newSlot);
          } else {
            allSlots.push({
              ...newSlot,
              id: generateUniqueId(),
              startDate: formattedDate,
              endDate: formattedDate
            });
          }
        });

        const updatedSchedule = {
          ...newSchedule,
          scheduleDetails: [...existingDetails, ...allSlots]
        };

        setCurrentSchedule(convertFromPackageSchedule(updatedSchedule));
        console.log(`New time slots added for multiple dates`);
        showNotification('Time slots added to all selected dates');
        return;
      }
    }

    setCurrentSchedule(convertFromPackageSchedule(newSchedule));

    switch (changeType) {
      case 'add':
        console.log(`New time slot added with ID: ${detailId}`);
        showNotification('Time slot added');
        break;
      case 'edit':
        console.log(`Time slot edited with ID: ${detailId}`);
        showNotification('Time slot updated');
        break;
      case 'delete':
        console.log(`Time slot deleted with ID: ${detailId}`);
        showNotification('Time slot deleted');
        break;
      default:
        console.log(`Schedule changed: ${changeType} - Detail ID: ${detailId}`);
    }
  };

  const handleTimeSlotSelect = (scheduleDetail: PackageScheduleDetail) => {
    console.log('Time slot selected:', scheduleDetail);
  };

  const handleSlotEdit = (scheduleDetailId: string, updatedDetail: PackageScheduleDetail) => {
    console.log('Editing time slot:', scheduleDetailId, updatedDetail);
  };

  const handleSlotDelete = (scheduleDetailId: string) => {
    console.log('Deleting time slot:', scheduleDetailId);
  };

  const handleDateSelect = (date: Date, multiSelect?: boolean) => {
    if (multiSelect) {
      const dateExists = selectedDates.some(d =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );

      if (dateExists) {
        const newDates = selectedDates.filter(d =>
          !(d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate())
        );
        setSelectedDates(newDates);
      }
    } else {
      setSelectedDates([date]);
    }

    console.log('Selected dates:', selectedDates);
  };

  const handleScheduleSubmit = async (finalSchedule: PackageSchedule) => {
    const savedSchedule = await handleSaveSchedule(finalSchedule);

    if (savedSchedule) {
      showNotification('Schedule submitted and saved!');
    }
  };

  const handleNewScheduleSubmit = (scheduleName: string, timeZone: string) => {
    console.log('Creating new schedule with name:', scheduleName, 'and timezone:', timeZone);

    if (!scheduleName) {
      console.error('Schedule name is empty or undefined');
      showNotification('Schedule name cannot be empty', true);
      return;
    }

    const newSchedule: SchedulerWidget.Schedule = {
      scheduleName: scheduleName,
      timeZone: timeZone,
      scheduleDetails: [],
      id: generateUniqueId()
    };

    console.log('New schedule object:', newSchedule);

    setCurrentSchedule(newSchedule);

    setSelectedDates([]);

    setShowNewScheduleModal(false);

    showNotification(`New schedule "${scheduleName}" created`);

    setTimeout(async () => {
      const savedSchedule = await handleSaveSchedule(newSchedule);
    }, 100);
  };

  const handleImportSubmit = (importedSchedule: SchedulerWidget.Schedule) => {
    setCurrentSchedule(importedSchedule);
    setShowImportModal(false);
    showNotification(`Schedule "${importedSchedule.scheduleName}" imported`);
  };

  const handleExportSchedule = () => {
    if (!currentSchedule) {
      showNotification('No schedule to export', true);
      return;
    }

    const jsonString = JSON.stringify(currentSchedule, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSchedule.scheduleName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    showNotification('Schedule exported to JSON');
  };

  const showNotification = (message: string, isError: boolean = false) => {
    setNotification({
      message,
      isError,
      show: true
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Paper elevation={1} sx={{ width: 280, minWidth: 280, p: 2, flexShrink: 0 }}>
        <ScheduleList
          schedules={schedules}
          loading={loading}
          onLoadSchedule={handleLoadSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          activeScheduleId={currentSchedule?.id}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>

          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={() => setShowImportModal(true)}
            size="small"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                borderColor: '#0969da',
                backgroundColor: '#f6f8fa'
              }
            }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportSchedule}
            size="small"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                borderColor: '#0969da',
                backgroundColor: '#f6f8fa'
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Paper>
      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {currentSchedule?.scheduleName || 'Untitled Schedule'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewScheduleModal(true)}
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1,
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }
              }}
            >
              New Schedule
            </Button>
          </Box>
        </Box>

        <Paper elevation={1} sx={{ p: 2, height: 'calc(100vh - 120px)', overflow: 'auto' }}>
          {currentSchedule && (
            <SchedulerWidget.Scheduler
              schedule={convertToPackageSchedule(currentSchedule)}
              onChange={(newSchedule: PackageSchedule) => {
                setCurrentSchedule(convertFromPackageSchedule(newSchedule));
              }}
              onScheduleSubmit={(finalSchedule: PackageSchedule) => {
                handleScheduleSubmit(finalSchedule);
              }}
              onSlotEdit={(scheduleDetailId: string, updatedDetail: PackageScheduleDetail) => {
                handleSlotEdit(scheduleDetailId, updatedDetail);
              }}
              onSlotDelete={(scheduleDetailId: string) => {
                handleSlotDelete(scheduleDetailId);
              }}
              onScheduleChange={(newSchedule: PackageSchedule, changeType: string, detailId?: string) => {
                handleDetailedScheduleChange(newSchedule, changeType, detailId);
              }}
              onDateSelect={(date: Date, multiSelect?: boolean) => {
                handleDateSelect(date, multiSelect);
              }}
              selectedDates={selectedDates}
              theme={{
                primaryColor: '#0969da',
                secondaryColor: '#f6f8fa',
                textColor: '#24292e',
                borderColor: '#d1d5da',
                backgroundColor: '#ffffff',
                timeSlot: {
                  backgroundColor: '#e6f3ff',
                  hoverBackgroundColor: '#d0e8ff',  // Changed from &:hover.backgroundColor
                  selectedBackgroundColor: '#c5e1f5', // Changed from &.selected.backgroundColor
                  textColor: '#1a56db',
                  borderColor: '#0969da',
                  borderRadius: '4px',
                },
              }}
              className="scheduler"
            />
          )}
        </Paper>
      </Box>
      <Paper elevation={1} sx={{ width: 360, minWidth: 360, p: 2, flexShrink: 0 }}>
        <ScheduleInfo
          schedule={currentSchedule}
        />
      </Paper>

      <NewScheduleModal
        isOpen={showNewScheduleModal}
        onCancel={() => setShowNewScheduleModal(false)}
        onCreateSchedule={handleNewScheduleSubmit}
      />

      <ImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleImportSubmit}
      />

      <Notification
        message={notification.message}
        isError={notification.isError}
        show={notification.show}
      />
    </Box>
  );
};

export default App;
