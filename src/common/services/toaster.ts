import React from 'react';
import { toast } from 'react-toastify';

export const toastSuccess = (message: React.ReactNode) => toast(message, { theme: 'dark', type: 'success' });
export const toastError = (message: React.ReactNode) => toast(message, { theme: 'dark', type: 'error' });
export const toastInfo = (message: React.ReactNode) => toast(message, { theme: 'dark', type: 'info' });