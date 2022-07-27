import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import { Col, Row } from 'antd';
import { Typography } from 'antd';

import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth, db } from '../../Firebase/config';

import { addDocument, generateKeywords } from '../../Firebase/services';
import { AuthContext } from '../../context/AuthProvider';

const { Title } = Typography;

const provider = new FacebookAuthProvider();

export default function Login() {

    const { setIsError } = useContext(AuthContext)

    const handleLoginWithFacebook = async () => {
        try {
            const data = await signInWithPopup(auth, provider);
            if (data) {
                const { _tokenResponse, user } = data;
                if (_tokenResponse?.isNewUser) {
                    try {
                        await addDocument('users', {
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            providerId: user.providerId,
                            keywords: generateKeywords(user.displayName)
                        });
                    } catch (err) {
                        if (err) {
                            setIsError(true)
                            console.log('something wrong with database: ', err);
                        }
                    }
                }
            }
        } catch (err) {
            console.log('Login.js handleLoginWithFacebook err: ', err);
        }
    };

    return (
        <>
            <Row style={{ marginTop: 20 }} justify="center">
                <Col>
                    <Title level={2}>Fun Chat</Title>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={6}>
                    <Button
                        style={{ width: '100%' }}
                        onClick={handleLoginWithFacebook}
                    >
                        Login With Facebook
                    </Button>
                </Col>
            </Row>
        </>
    );
}
