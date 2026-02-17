import { WorkOrderSection } from "../types/workOrder";

export const DEFAULT_SECTIONS: WorkOrderSection[] = [
  {
    id: 'site-info',
    title: 'Site Information',
    type: 'text',
    fields: [
      {
        id: 'site-notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Enter site specific information...'
      }
    ]
  },
  {
    id: 'issues',
    title: 'Issues / Problems',
    type: 'mixed',
    fields: [
      {
        id: 'problem-desc',
        label: 'Description of Issue',
        type: 'textarea',
        required: true
      },
      {
        id: 'issue-photos',
        label: 'Photos of Issue',
        type: 'photo'
      }
    ]
  },
  {
    id: 'work-accomplished',
    title: 'Work Accomplished',
    type: 'checklist',
    required: true,
    fields: [
      {
        id: 'check-filters',
        label: 'Check filters',
        type: 'checkbox',
        required: true
      },
      {
        id: 'check-belts',
        label: 'Check belts',
        type: 'checkbox',
        required: true
      }
    ]
  },
  {
    id: 'meters',
    title: 'Meters & Readings',
    type: 'meters',
    fields: [
      {
        id: 'runtime-hours',
        label: 'Runtime Hours',
        type: 'meter',
        unit: 'hrs',
        required: true
      }
    ]
  },
  {
    id: 'completion',
    title: 'Completion',
    type: 'mixed',
    required: true,
    fields: [
      {
        id: 'completion-notes',
        label: 'Final Comments',
        type: 'textarea'
      },
      {
        id: 'signature',
        label: 'Signature',
        type: 'signature',
        required: true
      },
      {
        id: 'completion-timestamp',
        label: 'Completed At',
        type: 'timestamp',
        required: true
      }
    ]
  }
];
