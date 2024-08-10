import React, { useState } from 'react';
import { memo } from 'react';
import { Heading, SubHeading, InputBox, Button, BottomWarning } from '../Components/Components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignedup, setIsSignedup] = useState(false);
    const [isPasswordMatched, setIsPasswordMatched] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsPasswordMatched(true);

        if (confirmPassword !== password) {
            setIsPasswordMatched(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://paytm-fgrn.onrender.com/api/v2/user/signup', {
                firstName: firstname,
                lastName: lastname,
                username,   
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.data;

            if (response.status === 200) {
                setIsSignedup(true);
                const token = responseData.jwt_token;
                localStorage.setItem('jwt_token', token);
                localStorage.setItem('username', username);

                navigate('/Dashboard');
            } else {
                setIsSignedup(false);
                setErrorMessage(responseData.error);
            }
        } catch (error) {
            setIsSignedup(false);
            setErrorMessage('An error occurred: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-lightGrey py-8 flex justify-center h-max'>
            <div className='flex flex-col justify-center h-screen'>
                <form className='rounded-lg bg-white w-96 text-center p-2 px-4' onSubmit={handleSignUp}>
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter Your Information to create an account"} />
                    <InputBox label={"Username"} type={"text"} onChange={(e) => setUsername(e.target.value)} />
                    <InputBox label={"Firstname"} type={"text"} onChange={(e) => setFirstname(e.target.value)} />
                    <InputBox label={"Lastname"} type={"text"} onChange={(e) => setLastname(e.target.value)} />
                    <InputBox label={"Password"} type={"password"} onChange={(e) => setPassword(e.target.value)} />
                    <InputBox label={"Confirm Password"} type={"password"} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button label={isLoading ? "Signing up..." : "Sign up"} />
                    {!isPasswordMatched && <div className='text-red-500'>Password and Confirm Password Should be Same</div>}
                    {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
                    <BottomWarning label={"Already Have An Account?"} buttonText={"Sign in"} to={'/signin'} />
                </form>
            </div>
        </div>
    );
};

export default Signup;
