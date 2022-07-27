import './App.css';
import Login from './components/Login/Login';
import ChatRoom from './components/ChatRoom/ChatRoom';
import AuthProvider from './context/AuthProvider';
import AppProvider from './context/AppProvider';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddRoomModels from './components/Models/AddRoomModels';
import InviteFriendsModals from './components/Models/InviteFriendsModal';

function App() {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <AppProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" element={<ChatRoom />} />
                        </Routes>
                        <AddRoomModels />
                        <InviteFriendsModals />
                    </AppProvider>
                </AuthProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
