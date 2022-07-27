import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { UserAddOutlined } from '@ant-design/icons';

import { Avatar, Button, Input, Layout, Spin, Tooltip, Typography } from 'antd';
import Message from './Message';
import { AppContext } from '../../context/AppProvider';
import { addDocument } from '../../Firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import { useFirestore } from '../../hooks/useFireStore';

import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import { formatRelative } from 'date-fns';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const Wapper = styled.div`
    .roomlist {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: white;

        &-header {
            background-color: transparent;
            padding: 10px 20px;
            border-bottom: 1px solid black;
            line-height: normal;
            display: flex;
            justify-content: space-between;
            height: 64px;

            .ant-typography {
                margin: 0;
            }

            p {
                margin: 0;
            }

            .roomlist-friends {
                display: flex;
                align-items: center;

                .invite-friends {
                    margin-right: 10px;
                }
            }
        }

        &-content {
            display: flex;
            height: calc(100vh - calc(2 * 64px));
            position: relative;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 10px;
            }

            /* Track */
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 2px;
            }

            /* Handle on hover */
            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            .roomlist-main {
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                min-height: 100%;
                flex-direction: column;
                overflow-y: auto;
                justify-content: flex-end;
            }
        }

        &-footer {
            padding: 20px;
            flex-shrink: 0;
            background-color: white;
            border-top: 1px solid black;
            display: flex;
            justify-content: space-between;

            .footer-input {
                margin-right: 20px;
            }
        }
    }
`;

const TitleNothing = styled(Title)`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
`;

function formatDate(seconds) {
    let formattedDate = '';
    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());
        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}

export default function RoomList() {

    const { selectedRoomId, selectedRoom, members, setIsInviteFriendsVisible } =
        useContext(AppContext);

    const { user } = useContext(AuthContext);
    const [inputText, setInputText] = useState('');
    const [isSelectedRoom, setIsSeletedRoom] = useState(false);

    const messagesEndRef = useRef();

    const messageData = useFirestore('message', {
        value1: 'roomId',
        compareValue: '==',
        value2: selectedRoomId,
    });

    useEffect(() => {
        setIsSeletedRoom(true);
        const id = setTimeout(() => {
            setIsSeletedRoom(false);
        }, 300);
        return () => {
            clearTimeout(id);
        };
    }, [selectedRoomId]);

    useEffect(() => {
        if (selectedRoom && Object.keys(selectedRoom)) {
            scrollToBottom();
        }
    }, [selectedRoom, messageData, isSelectedRoom]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleButtonClick = () => {
        addDocument('message', {
            uid: user.uid,
            photoURL: user.photoURL,
            roomId: selectedRoomId,
            displayName: user.displayName,
            message: inputText,
        });
        setInputText('');
    };

    const handleButtonKeyDown = (e) => {
        if (e.keyCode === 13) {
            addDocument('message', {
                uid: user.uid,
                photoURL: user.photoURL,
                roomId: selectedRoomId,
                displayName: user.displayName,
                message: inputText,
            });
            setInputText('');
        }
    };

    return (
        <>
            {selectedRoom && Object.keys(selectedRoom) ? (
                !isSelectedRoom ? (
                    <Wapper>
                        <Layout className="roomlist">
                            <Header className="roomlist-header">
                                <div className="header-name">
                                    <Title level={5}>
                                        {selectedRoom?.name}
                                    </Title>
                                    <p>{selectedRoom?.description}</p>
                                </div>
                                <div className="roomlist-friends">
                                    <Button
                                        className="invite-friends"
                                        icon={<UserAddOutlined />}
                                        onClick={() =>
                                            setIsInviteFriendsVisible(true)
                                        }
                                    >
                                        Mời
                                    </Button>
                                    <Avatar.Group
                                        maxCount={3}
                                        maxPopoverTrigger="click"
                                        size="large"
                                        maxStyle={{
                                            color: '#f56a00',
                                            backgroundColor: '#fde3cf',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {members &&
                                            members.length &&
                                            members.map((member, index) => (
                                                <Tooltip
                                                    key={member.id}
                                                    title={member.displayName}
                                                >
                                                    <Avatar
                                                        src={member?.photoURL}
                                                    >
                                                        {member.displayName}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                    </Avatar.Group>
                                </div>
                            </Header>
                            <Content className="roomlist-content">
                                <div className="roomlist-main">
                                    {messageData && messageData.length
                                        ? messageData.map((mess, index) => (
                                              <Message
                                                  key={mess.id}
                                                  text={mess.message}
                                                  displayName={mess.displayName}
                                                  photoURL={mess.photoURL}
                                                  createAt={formatDate(
                                                      mess.createAt?.seconds
                                                  )}
                                              />
                                          ))
                                        : ''}
                                    <div ref={messagesEndRef}></div>
                                </div>
                            </Content>
                            <Footer className="roomlist-footer">
                                <Input
                                    className="footer-input"
                                    placeholder="Type something ... "
                                    onChange={handleInputChange}
                                    value={inputText}
                                    onKeyDown={handleButtonKeyDown}
                                ></Input>
                                <Button
                                    size="large"
                                    onClick={handleButtonClick}
                                >
                                    Send
                                </Button>
                            </Footer>
                        </Layout>
                    </Wapper>
                ) : (
                    <TitleNothing level={2}>
                        <Spin></Spin>
                    </TitleNothing>
                )
            ) : (
                <TitleNothing level={2}>Nothing To See ... </TitleNothing>
            )}
        </>
    );
}
