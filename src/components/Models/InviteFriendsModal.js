import { async } from '@firebase/util';
import { Avatar, Form, Input, Modal, Select, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { debounce } from 'lodash';
import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from 'react';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../../Firebase/config';

const DebounceSelected = ({members, selectedRoom, fetchOptions, debounceTimeOut = 300, ...data }) => {
    const [options, setOptions] = useState([]);

    const DebounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([])
            fetchOptions(value, members).then((newOptions) => {
                setOptions(newOptions);
            });
        };
        return debounce(loadOptions, debounceTimeOut);
    }, [debounceTimeOut, fetchOptions, members]);

    return (
        <Select
            allowClear
            filterOption={false}
            style={{ width: '100%' }}
            labelInValue
            onSearch={DebounceFetcher}
            {...data}
        >
            {options &&
                options.length > 0 &&
                options.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                        <Avatar src={opt.photoURL}></Avatar>
                        {opt.label}
                    </Select.Option>
                ))}
        </Select>
    );
};

async function fetchUserList(search, members) {
    
    const q = query(
        collection(db, 'users'),
        where('keywords', 'array-contains', search)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL,
    })).filter((doc) => {
        return !members.includes(doc.value)
    });
}

export default function InviteFriendsModals() {
    const {
        user: { uid },
    } = useContext(AuthContext);
    const { selectedRoomId, selectedRoom } = useContext(AppContext);

    const { isInviteFriendsVisible, setIsInviteFriendsVisible } =
        useContext(AppContext);
    const [value, setValue] = useState();

    const [form] = useForm();

    const handleOk = async () => {
        const newUserInRoom = [...selectedRoom.members, ...value.map(val => val.value)]
        const roomRef = doc(db, 'rooms', selectedRoomId);
        await updateDoc(roomRef, { members: newUserInRoom })
    };

    const handleCancel = () => {
        setIsInviteFriendsVisible(false);
    };


    return (
        <Modal
            title="Tên Các thành viên"
            visible={isInviteFriendsVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <DebounceSelected
                showSearch
                mode="multiple"
                label="Tên các thành viên"
                value={value}
                placeholder="Please Select"
                fetchOptions={fetchUserList}
                selectedRoom={selectedRoom}
                onChange={(newValue) => setValue(newValue)}
                members={selectedRoom?.members}
            ></DebounceSelected>
        </Modal>
    );
}
