import '../scss/loginsignup.scss'
import '../scss/index.scss'
import { AbsoluteCenter, Box, Button, Card, CardBody, Checkbox, Divider, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react';
import { BsEye, BsEyeFill, BsEyeSlash, BsFacebook, BsGoogle } from 'react-icons/bs'; //eslint-disable-line
import { useNavigate } from 'react-router-dom';
import firebase from '../js/firebase.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import Banner from '../components/Banner';
import UserAuth from '../context/UserContext';
import ThemeState from '../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate()
  const toast = useToast();

  const auth = firebase.auth;
  const { login } = UserAuth();
  const { theme } = ThemeState();

  // Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  // Error-States
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const formValidation = () => {
    if (email === "") {
      toast({
        title: "Email cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setEmailError(true);
    } else if (password === "") {
      toast({
        title: "Password cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPasswordError(true);
    } else {
      login(email, password);
    }
  };

  // Social Logins
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; //eslint-disable-line
        const user = result.user;
        navigate(`/profile/${userData.displayName}`);
        setUserData(user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const facebookLogin = async () => {
  // };

  return (
    <div className={`login-page main-section d-flex flex-column flex-md-row ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <Banner />
      <div className={`login-right   w-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
        <div className="login-container py-5 d-flex flex-row justify-content-center align-items-center">
          <Card size='md' className={`login-card w-75 p-3 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
            border={theme == 'dark' ? '1px' : '0px'}>
            <CardBody>
              <div className="heading">
                <Heading size='lg' className="login-heading">Log in</Heading>
                <Text className="login-text">Welcome back! Please enter your details.</Text>
              </div>
              <div className="form">
                <FormControl isRequired className='mb-2' isInvalid={emailError}>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <Input focusBorderColor='yellow.400' type='email' placeholder='Enter your email' id='email' onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError(false);
                  }} />
                </FormControl>
                <FormControl isRequired isInvalid={passwordError}>
                  <FormLabel>
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input focusBorderColor='yellow.400' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' id='login-password' onChange=
                      {(e) => {
                        setPassword(e.target.value)
                        setPasswordError(false)
                      }
                      } />
                    <InputRightElement>
                      <IconButton variant='ghost' size='sm' aria-label='show password' icon={showPassword ? <BsEyeFill /> : <BsEye />} onClick={() => { setShowPassword(!showPassword) }} />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <div className="div d-flex flex-sm-column flex-md-row justify-content-between align-items-center mt-2">
                  <div className="show">
                    <Checkbox>Remember me</Checkbox>
                  </div>
                  <Button colorScheme='yellow' variant='link'>Forgot Password?</Button>
                </div>
                <Button type='fill' colorScheme='yellow' width='100%' className='mt-4' onClick={() => {
                  formValidation();
                }
                } >Sign in</Button>
                <div className='mt-3 d-flex flex-row justify-content-center align-items-baseline'>{`Don't have an account yet?`}<Button className='ms-1' variant='link' colorScheme='yellow' onClick={() => { navigate('/signup') }}>Create</Button></div>
              </div>
              <Box position='relative' padding='5'>
                <Divider />
                <AbsoluteCenter style={{ borderRadius: '25px' }} bg={theme === 'dark' ? 'gray' : 'white'} px='4' color={theme === 'dark' ? 'white' : 'gray.500'}>
                  OR
                </AbsoluteCenter>
              </Box>
              <div className="provider-signups d-flex flex-row justify-content-center">
                <Button variant='solid' className='me-2' onClick={() => { googleLogin() }} > <BsGoogle className='me-2' /> Google</Button>
                <Button colorScheme='facebook' variant='solid' ><BsFacebook className='me-2' size='1.2em' /> Facebook</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login;