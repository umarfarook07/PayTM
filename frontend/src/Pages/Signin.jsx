import React, { useState } from 'react';
import { memo } from 'react';
import { Heading, SubHeading, InputBox, Button, BottomWarning } from '../Components/Components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();


        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/v2/user/signin', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const responseData = await response.data;

            if (response.status === 200) {
                setIsSignedIn(true);
                alert(responseData.msg);
                const token = responseData.jwt_token;
                localStorage.setItem('jwt_token', token);
                localStorage.setItem('username', username);
                navigate('/Dashboard');
            } else {
                setIsSignedIn(false);
                setErrorMessage(responseData.error);
            }
        } catch (error) {
            setIsSignedIn(false);
            setErrorMessage('An error occurred: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-lightGrey py-8 flex justify-center h-max'>
            <div className='flex flex-col justify-center h-screen'>
                <form className='rounded-lg bg-white w-96 text-center p-2 px-4' onSubmit={handleSignIn}>
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter Your Credentials to access your account"} />
                    <InputBox
                        label={"Username"}
                        type={"text"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputBox
                        label={"Password"}
                        type={"password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button label={isLoading ? "Signing in..." : "Sign in"} />
                    {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
                    <BottomWarning label={" Don't Have an Account?"} buttonText={"Sign up"} to={'/'} />
                </form>
            </div>
        </div>
    );
};

export default Signin;
