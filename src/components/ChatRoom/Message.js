import { Avatar, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Title } = Typography;

const Wapper = styled.div`
    .message {
        padding: 10px;
        display: flex;
        flex-direction: column;

        &-info {
            display: flex;
            align-items: center;

            &-name {
                margin: 0;
                margin-left: 10px;
            }

            &-time {
                margin: 0;
                margin-left: 10px;
                font-size: 13px;
                color: #636e72;
            }
        }

        &-inner {
            margin-left: 40px;
            p {
                margin: 0;
            }
        }
    }
`;

export default function Message({ text, displayName, photoURL, createAt }) {

    return (
        <Wapper>
            <div className="message">
                <div className="message-info">
                    <Avatar src={photoURL}></Avatar>
                    <Title className="message-info-name" level={5}>
                        {displayName}
                    </Title>
                    <p className="message-info-time">{createAt}</p>
                </div>
                <div className="message-inner">
                    <p> {text} </p>
                </div>
            </div>
        </Wapper>
    );
}
