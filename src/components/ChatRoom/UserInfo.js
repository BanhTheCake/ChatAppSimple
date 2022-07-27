import { Col, Row, Collapse } from 'antd';
import { Avatar, Typography, Button } from 'antd';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { auth } from '../../Firebase/config';
import { AuthContext } from '../../context/AuthProvider';
import { AppContext } from '../../context/AppProvider';

const { Panel } = Collapse;
const { Title } = Typography;

const Wrapper = styled.div`
    .chat-navigation {
        height: 100vh;
        background-color: #6c5ce7;

        &-header {
            padding: 15px 16px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #dfe6e9;

            .avatar-info {
                display: flex;
                align-items: center;
                .avatar {
                    margin-right: 5px;
                }
                .info {
                    margin: 0px;
                    color: white;
                }
            }
        }
    }
    .chat-collapse {
        padding: 20px 10px;
        border: none;

        .collapse {
            background-color: transparent;
            border: none;
        }

        .ant-collapse-header {
            display: flex;
            align-items: center;
        }

        .ant-collapse-expand-icon {
            span {
                font-size: 14px !important;
            }
        }

        .ant-collapse-item {
            border: none;
        }

        .ant-collapse-header-text {
            color: white;
            font-size: 16px;
        }

        .ant-btn {
            width: 100%;
            background-color: #6c5ce7;
            color: white;
        }
    }
`;

export default function UserInfo() {

    /* khi truyền tham số là 1 object vào thì khi render lại thì sẽ tạo ra object mới khác object cũ
     *   {} === {} => false
     * => khiến cho useEffect trong useFirestore loop infinity
     * Cách giải quyết
     * C1: Đưa object vào 1 biến đặt trong useMemo
     * C2: đưa object đó vào 1 useState
     * 
     * C1: roomCondition = useMemo(() => {
     *     return {
            value1: 'members',
            compareValue: 'array-contains',
            value2: uid,
            }
     * }, [uid])
     * rooms useFirestore('rooms', roomCondition)         
     * */

    const { rooms, setIsAddRoomVisible, setSelectedRoomId } = useContext(AppContext)

    const { user } = useContext(AuthContext);

    const { displayName, email, photoURL, uid } = user;

    const handleSigtOut = () => {
        auth.signOut();
        setSelectedRoomId('')
    };

    const handleOpenModalAddRoom = () => {
        setIsAddRoomVisible(true)
    }

    const handleSelectedRoom = (roomId) => {
        setSelectedRoomId(roomId)
    }

    return (
        <Wrapper>
            <div className="chat-navigation">
                <div className="chat-navigation-header">
                    <div className="avatar-info">
                        <Avatar className="avatar" src={photoURL}></Avatar>
                        <Title level={5} className="info">
                            {displayName}
                        </Title>
                    </div>
                    <div>
                        <Button ghost onClick={handleSigtOut}>
                            Đăng Xuất
                        </Button>
                    </div>
                </div>
                <div className="chat-collapse">
                    <Collapse className="collapse">
                        <Panel header="Danh sách phòng">
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <Title onClick={() => handleSelectedRoom(room.id)} key={room.id} level={5}>
                                        {room.name}
                                    </Title>
                                ))
                            ) : (
                                <Title level={5}>
                                    Don't have any room ...
                                </Title>
                            )}
                            <Button onClick={handleOpenModalAddRoom}>Thêm Phòng</Button>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </Wrapper>
    );
}
