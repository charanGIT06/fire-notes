import "../../scss/loginsignup.scss";
import "../../scss/index.scss";
import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  BsEye,
  BsEyeFill,
  BsEyeSlash,
  BsFacebook,
  BsGoogle,
} from "react-icons/bs"; //eslint-disable-line
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Banner from "../../components/Authentication/Banner";
import UserAuth from "../../context/UserContext";
import ThemeState from "../../context/ThemeContext";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = ThemeState();
  const { createUser, googleLogin, facebookLogin } = UserAuth();

  // Data
  const [profile, setProfile] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const { usernames, getUsernames } = UserAuth();

  // Error States
  const [error, setError] = useState({});

  const checkUserName = () => {
    try {
      for (let i = 0; i < usernames.length; i++) {
        usernames[i];
        if (
          usernames[i].toLowerCase() === profile?.displayName?.toLowerCase()
        ) {
          setError({
            ...error,
            userNameError: true,
          });
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
    if (profile.displayName === "") {
      toast({
        title: "Username cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        userNameError: true,
      });
    } else if (profile.firstName === "") {
      toast({
        title: "First Name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        firstNameError: true,
      });
    } else if (profile.lastName === "") {
      toast({
        title: "Last Name cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        lastNameError: true,
      });
    } else if (checkUserName()) {
      setError({
        ...error,
        userNameError: true,
      });
    } else if (profile.email === "") {
      toast({
        title: "Email cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        emailError: true,
      });
    } else if (profile.password === "") {
      toast({
        title: "Password cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        passwordError: true,
      });
    } else if (profile.confirmPassword === "") {
      toast({
        title: "Confirm Password cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        confirmPasswordError: true,
      });
    } else if (profile.password !== profile.confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError({
        ...error,
        passwordError: true,
        confirmPasswordError: true,
      });
    } else {
      createUser(profile);
    }
  };

  const handleSubmit = () => {
    formValidation();
  };

  useEffect(() => {
    getUsernames();
  }, []);

  useEffect(() => {
    checkUserName();
  }, [profile.displayName]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`signup-page main-section d-flex flex-column flex-md-row ${
        theme === "dark" ? "dark-theme text-white" : "light-theme"
      }`}
    >
      <Banner />
      <div
        className={`signup-right   w-100 ${
          theme === "dark" ? "bg-dark text-white" : ""
        } ${theme === "dark" ? "dark-theme text-white" : "light-theme"}`}
      >
        <div className='signup-container px-0 py-5 d-flex flex-row justify-content-center align-items-center'>
          <Card
            size='md'
            className={`signup-card w-75 p-md-3 p-sm-1 ${
              theme === "dark" ? "dark-element" : "light-element"
            }`}
          >
            <CardBody>
              <div className='heading'>
                <Heading size='lg' className='signup-heading'>
                  Signup
                </Heading>
                <Text className='signup-text'>Create your account now...</Text>
              </div>
              <div className='form'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <FormControl
                    isRequired
                    isInvalid={error.userNameError}
                    className='mb-2'
                  >
                    <FormLabel>Username</FormLabel>
                    <Input
                      className='input'
                      id='displayName'
                      focusBorderColor='yellow.400'
                      type='text'
                      placeholder='Enter your username'
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          displayName: e.target.value,
                        });
                        setError({
                          ...error,
                          userNameError: false,
                        });
                      }}
                    />
                    {!usernameAvailable ? (
                      <FormErrorMessage>
                        Username already exists
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <div className='name d-flex flex-column flex-md-row mt-2'>
                    <FormControl
                      isRequired
                      isInvalid={error.firstNameError}
                      className='mb-2 me-1'
                    >
                      <FormLabel>First Name</FormLabel>
                      <Input
                        id='firstName'
                        className='input'
                        focusBorderColor='yellow.400'
                        type='text'
                        placeholder='Enter your first name'
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            firstName: e.target.value,
                          });
                          setError({
                            ...error,
                            firstNameError: false,
                          });
                        }}
                      />
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={error.lastNameError}
                      className='ms-1 mb-2'
                    >
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        id='lastName'
                        className='input'
                        focusBorderColor='yellow.400'
                        type='text'
                        placeholder='Enter your last name'
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            lastName: e.target.value,
                          });
                          setError({
                            ...error,
                            lastNameError: false,
                          });
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormControl
                    isRequired
                    isInvalid={error.emailError}
                    className='mb-2'
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      id='email'
                      className='input'
                      focusBorderColor='yellow.400'
                      type='email'
                      placeholder='Enter your email'
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          email: e.target.value,
                        });
                        setError({
                          ...error,
                          emailError: false,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl
                    className='mb-2'
                    isRequired
                    isInvalid={error.passwordError}
                  >
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        id='password'
                        className='input'
                        focusBorderColor='yellow.400'
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            password: e.target.value,
                          });
                          setError({
                            ...error,
                            passwordError: false,
                          });
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          isRound={true}
                          variant='ghost'
                          colorScheme={theme === "dark" ? "whiteAlpha" : "gray"}
                          size='sm'
                          aria-label='show password'
                          icon={showPassword ? <BsEyeFill /> : <BsEye />}
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={error.confirmPasswordError}
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        id='confirmPassword'
                        className='input'
                        focusBorderColor='yellow.400'
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            confirmPassword: e.target.value,
                          });
                          setError({
                            ...error,
                            passwordError: false,
                            confirmPasswordError: false,
                          });
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          isRound={true}
                          variant='ghost'
                          colorScheme={theme === "dark" ? "whiteAlpha" : "gray"}
                          size='sm'
                          aria-label='show password'
                          icon={showPassword ? <BsEyeFill /> : <BsEye />}
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Button
                    type='submiterror.'
                    colorScheme='yellow'
                    width='100%'
                    className='mt-4'
                  >
                    Create account
                  </Button>
                </form>
                <div className='mt-3 d-flex flex-row justify-content-center align-items-baseline'>
                  Already have an account?{" "}
                  <Button
                    className='ms-1'
                    variant='link'
                    colorScheme='yellow'
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                </div>
              </div>
              <Box position='relative' padding='5'>
                <Divider />
                <AbsoluteCenter
                  style={{ borderRadius: "25px" }}
                  bg={theme === "dark" ? "gray" : "white"}
                  px='4'
                  color={theme === "dark" ? "white" : "gray.500"}
                >
                  OR
                </AbsoluteCenter>
              </Box>
              <div className='provider-signups d-flex flex-row justify-content-center'>
                <Button
                  variant='solid'
                  className='me-2'
                  onClick={() => {
                    googleLogin();
                  }}
                >
                  {" "}
                  Google
                </Button>
                <Button
                  colorScheme='facebook'
                  variant='solid'
                  onClick={() => {
                    facebookLogin();
                  }}
                >
                  {" "}
                  Facebook
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
