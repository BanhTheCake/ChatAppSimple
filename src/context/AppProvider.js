import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Spin } from 'antd';
import { AuthContext } from './AuthProvider';
import { useFirestore } from '../hooks/useFireStore';

const AppContext = createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteFriendsVisible, setIsInviteFriendsVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const { user } = useContext(AuthContext);

    const { uid } = user;

    const rooms = useFirestore('rooms', {
        value1: 'members',
        compareValue: 'array-contains',
        value2: uid,
    });

    const selectedRoom = useMemo(() => {
        return rooms.find((room) => room.id === selectedRoomId);
    }, [rooms, selectedRoomId]);

    const members = useFirestore('users', {
        value1: 'uid',
        compareValue: 'in',
        value2: selectedRoom?.members,
    });

    const value = {
        rooms,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        members,
        isInviteFriendsVisible,
        setIsInviteFriendsVisible,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
