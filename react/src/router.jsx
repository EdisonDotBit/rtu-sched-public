import { createBrowserRouter } from 'react-router-dom'
import Login from './Component/Login.jsx'
import App from './App.jsx';
import GuestLayout from './GuestLayout.jsx';
import StudentLayout from './StudentLayout.jsx';
import Dashboard from './Component/Dashboard.jsx';
import SetAppointment from './Component/SetAppointment.jsx';
import ViewAppointments from './Component/ViewAppointments.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/guest',
        element: <GuestLayout />
    },
    {
        path: '/student',
        element: <StudentLayout />,
        
    },
    {
        path: '/student/dashboard',
        element: <Dashboard />,
        
    },
    
    {
        path: '/student/set-appointment',
        element: <SetAppointment />,
        
    },
    
    {
        path: '/student/view-appointment',
        element: <ViewAppointmentsy />,
        
    },
    
])
export default router;