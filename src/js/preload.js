import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    getTasks: () => ipcRenderer.invoke('get-tasks'),
    addTask: (task) => ipcRenderer.invoke('add-task', task),
    updateTask: (id, estado) => ipcRenderer.invoke('update-task', id, estado),
    deleteTask: (id) => ipcRenderer.invoke('delete-task', id)
});