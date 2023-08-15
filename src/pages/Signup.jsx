import '../scss/loginsignup.scss'
import '../scss/index.scss'
import { AbsoluteCenter, Box, Button, Card, CardBody, Divider, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react';
import { BsEye, BsEyeFill, BsEyeSlash, BsFacebook, BsGoogle } from 'react-icons/bs'; //eslint-disable-line
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import firebase from '../js/firebase';
import Banner from '../components/Banner';
import UserAuth from '../context/UserContext';
import ThemeState from '../context/ThemeContext';

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const db = firebase.db;
  const { theme } = ThemeState();

  const { createUser, googleLogin, facebookLogin } = UserAuth();

  // Data
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState({}); //eslint-disable-line
  const [showPassword, setShowPassword] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(false); //eslint-disable-line
  const [usernames, setUsernames] = useState([]); //eslint-disable-line
  const [cnt, setCnt] = useState(0); //eslint-disable-line

  // Error States
  const [userNameError, setUserNameError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const getUsernames = async () => {
    console.log("Getting Usernames");
    const q = query(collection(db, "usernames"));
    const querySnapshot = await getDocs(q);
    const usernames = [];
    querySnapshot.forEach((doc) => {
      usernames.push(doc.data().displayName);
    });
    setUsernames(usernames);
  };

  const checkUserName = () => {
    console.log("Checking")
    try {

      for (let i = 0; i < usernames.length; i++) {
        usernames[i]
        if (usernames[i].toLowerCase() === username.toLowerCase()) {
          console.log("Username already exists");
          setUserNameError(true);
          setUsernameAvailable(false);
          // return true;
        }
        // return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Form Validation
  const formValidation = async () => {
    if (username === "") {
      toast({
        title: "Username cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setUserNameError(true);
    } else if (firstName === "") {
      toast({
        title: "First Name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setFirstNameError(true);
    } else if (lastName === "") {
      toast({
        title: "Last Name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLastNameError(true);
    } else if (checkUserName()) {
      setUserNameError(true);
    } else if (email === "") {
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
    } else if (confirmPassword === "") {
      toast({
        title: "Confirm Password cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setConfirmPasswordError(true);
    } else if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPasswordError(true);
      setConfirmPasswordError(true);
    } else {
      createUser(username, firstName, lastName, email, password);
    }
  };

  useEffect(() => {
    getUsernames();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkUserName();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`signup-page main-section d-flex flex-column flex-md-row ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <Banner />
      <div className={`signup-right   w-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
        <div className="signup-container px-0 py-5 d-flex flex-row justify-content-center align-items-center">
          <Card size='md' className={`signup-card w-75 p-md-3 p-sm-1 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`} border={theme == 'dark' ? '1px' : '0px'}>
            <CardBody>
              <div className="heading">
                <Heading size='lg' className="signup-heading">Signup</Heading>
                <Text className="signup-text">Create your account now...</Text>
              </div>
              <div className="form">
                <FormControl isRequired isInvalid={userNameError} className='mb-2'>
                  <FormLabel>Username</FormLabel>
                  <Input focusBorderColor='yellow.400' type='text' placeholder='Enter your username' onChange={(e) => {
                    setUsername(e.target.value)
                    setUserNameError(false)
                  }} />
                  {!usernameAvailable ?
                    <FormErrorMessage>Username already exists</FormErrorMessage>
                    : null
                  }
                </FormControl>
                <div className="name d-flex flex-row">
                  <FormControl isRequired isInvalid={firstNameError} className='mb-2 me-1 w-50'>
                    <FormLabel>First Name</FormLabel>
                    <Input focusBorderColor='yellow.400' type='text' placeholder='Enter your first name' onChange={(e) => {
                      setFirstName(e.target.value)
                      setFirstNameError(false)
                    }} />
                  </FormControl>
                  <FormControl isRequired isInvalid={lastNameError} className='ms-1 mb-2 w-50'>
                    <FormLabel>Last Name</FormLabel>
                    <Input focusBorderColor='yellow.400' type='text' placeholder='Enter your last name' onChange={(e) => {
                      setLastName(e.target.value)
                      setLastNameError(false)
                    }} />
                  </FormControl>
                </div>
                <FormControl isRequired isInvalid={emailError} className='mb-2'>
                  <FormLabel >Email</FormLabel>
                  <Input focusBorderColor='yellow.400' type='email' placeholder='Enter your email' onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError(false)
                  }} />
                </FormControl>
                <FormControl className='mb-2' isRequired isInvalid={passwordError}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input focusBorderColor='yellow.400' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError(false)
                    }} />
                    <InputRightElement>
                      <IconButton variant='ghost' size='sm' aria-label='show password' icon={showPassword ? <BsEyeFill /> : <BsEye />} onClick={() => { setShowPassword(!showPassword) }} />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired isInvalid={confirmPasswordError}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input focusBorderColor='yellow.400' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordError(false)
                      setConfirmPasswordError(false)
                    }} />
                    <InputRightElement>
                      <IconButton variant='ghost' size='sm' aria-label='show password' icon={showPassword ? <BsEyeFill /> : <BsEye />} onClick={() => { setShowPassword(!showPassword) }} />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button type='fill' colorScheme='yellow' width='100%' className='mt-4' onClick={() => { formValidation() }} >Create account</Button>
                <div className='mt-3 d-flex flex-row justify-content-center align-items-baseline'>Already have an account? <Button className='ms-1' variant='link' colorScheme='yellow' onClick={() => { navigate('/login') }}>Login</Button></div>
              </div>
              <Box position='relative' padding='5'>
                <Divider />
                <AbsoluteCenter style={{ borderRadius: '25px' }} bg={theme === 'dark' ? 'gray' : 'white'} px='4' color={theme === 'dark' ? 'white' : 'gray.500'}>
                  OR
                </AbsoluteCenter>
              </Box>
              <div className="provider-signups d-flex flex-row justify-content-center">
                <Button variant='solid' className='me-2' onClick={() => {googleLogin()}} >  Google</Button>
                <Button colorScheme='facebook' variant='solid' onClick={()=>{facebookLogin()}}> Facebook</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Signup;