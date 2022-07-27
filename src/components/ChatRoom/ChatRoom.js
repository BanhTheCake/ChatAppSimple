import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthProvider';

import { Col, Row, Collapse } from 'antd';
import { Avatar, Typography, Button } from 'antd';

import UserInfo from './UserInfo';
import RoomList from './RoomList';
import { useFirestore } from '../../hooks/useFireStore';
import { AppContext } from '../../context/AppProvider';


export default function ChatRoom() {

    return (
        <Row>
            <Col span={6}>
                <UserInfo />
            </Col>
            <Col span={18}>
                <RoomList />
            </Col>
        </Row>
    );
}
