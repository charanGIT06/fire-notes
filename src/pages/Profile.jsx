import { Avatar, Button, Card, CardBody, FormControl, FormLabel, Input } from '@chakra-ui/react'
import SideNav from '../components/SideNav'
import { useEffect, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import UserAuth from '../context/UserContext';
import { collection, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import firebase from '../js/firebase.js';
import { useNavigate, useParams } from 'react-router-dom';
import { BsUpload } from 'react-icons/bs';
import ThemeState from '../context/ThemeContext';

const Profile = () => {
  const auth = getAuth();
  const db = firebase.db;
  const navigate = useNavigate();
  const { userId } = useParams();
  const { theme } = ThemeState();

  const { user, setUser } = UserAuth();
  const [edit, setEdit] = useState(false);
  const { profile, setProfile, setProfileDetails } = UserAuth();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // eslint-disable-line no-unused-vars
  const [location, setLocation] = useState('');

  const updateProfileDetails = () => {
    const q = query(collection(db, "users"), where("username", "==", userId));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          profile: {
            firstName: firstName,
            lastName: lastName,
            location: location
          }
        });
        console.log(doc.data());
      });
    });
  }

  // const getProfileDetails = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", userId));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setUsername(data.username);
      setFirstName(data.profile.firstName);
      setLastName(data.profile.lastName);
      setEmail(data.email);
    });
  });
  // }

  useEffect(() => {
    if (!profile) {
      console.log('Setting profile')
      setProfileDetails(user.displayName)
    } else {
      console.log('profile found')
      setUsername(profile.displayName)
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
      setEmail(profile.email)
      setLocation(profile.location)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`profile-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app container-fluid d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="main-section col-12 col-md-10 p-4">
          <div className="main-content">
            <div className="my-profile">
              <h6>My Profile</h6>
              <Card className={`mt-3 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`} style={theme === 'dark' ? {
                border: '1px solid #e2e8f0',
              } : {}}>
                <CardBody>
                  <div className="section-1 d-flex align-items-center p-3">
                    <div className="profile-img">
                      <Avatar name={user && user.displayName} size='xl' />
                    </div>
                    <div className="basic-info ps-4 w-100">
                      <div className="name">
                        <h5 className='pb-2 mb-0'>{firstName} {lastName}</h5>
                      </div>
                      <div className="username">
                        <p className='pb-2 mb-0'>{user && user.displayName}</p>
                      </div>
                      <div className="email">
                        <p className='pb-2 mb-0'>{user && user.email}</p>
                      </div>
                    </div>
                    <div className="editButton">
                      <Button size='sm' rightIcon={<BsUpload />} variant='outline' colorScheme={theme === 'dark' ? 'white' : 'black'} style={{ borderRadius: '50px' }}
                        onClick={() => {
                        }} isDisabled={true} >Change Profile Pic</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="personal-details mt-4">
                <h6>Personal Details</h6>
                <Card className={`mt-3 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`} style={theme === 'dark' ? {
                  border: '1px solid #e2e8f0',
                } : {}}>
                  <CardBody>
                    <div className="section-2 px-3">
                      <div className="user-details d-flex">
                        <div className="inputs pt-2 w-100">
                          <div className="username mb-4">
                            <FormControl id="username" className='pe-2'>
                              <FormLabel>Username</FormLabel>
                              <Input id='profile-username' className="username" defaultValue={username} variant={edit ? 'outline' : 'unstyled'} placeholder="Username" isReadOnly={!edit} onChange={(e) => { setUsername(e.target.value) }} />
                            </FormControl>
                          </div>
                          <div className="name mb-4 d-flex w-100">
                            <FormControl id="firstname" className="pe-2">
                              <FormLabel>First Name</FormLabel>
                              <Input id='profile-firstname' className="firstname" defaultValue={firstName} variant={edit ? 'outline' : 'unstyled'} placeholder="First Name" isReadOnly={!edit} onChange={(e) => { setFirstName(e.target.value) }} />
                            </FormControl>
                            <FormControl id="lastname" className="pe-2">
                              <FormLabel>Last Name</FormLabel>
                              <Input id='profile-lastname' className="lastname" defaultValue={lastName} variant={edit ? 'outline' : 'unstyled'} placeholder="Last Name" isReadOnly={!edit} onChange={(e) => {
                                setLastName(e.target.value);
                              }} />
                            </FormControl>
                          </div>
                          <div className="location">
                            <FormControl id="location">
                              <FormLabel>Location</FormLabel>
                              <Input id='profile-location' className="location" defaultValue={location} variant={edit ? 'outline' : 'unstyled'} placeholder="Location" isReadOnly={!edit} onChange={(e) => { setLocation(e.target.value) }} />
                            </FormControl>
                          </div>
                        </div>
                        <div className="editButton">
                          <Button size='sm' rightIcon={<EditIcon />} variant='outline' style={{ borderRadius: '50px' }}
                            colorScheme={theme === 'dark' ? 'white' : 'black'}
                            onClick={() => {
                              setEdit(!edit);
                            }}>Edit</Button>
                        </div>
                      </div>
                    </div>
                    <div className={`section-3 px-3 ${edit ? 'd-inline' : 'd-none'}`}>
                      <div className='btn-container px-3 pt-2'>
                        <Button className="me-2 round-btn" onClick={() => { setEdit(false) }} >Cancel</Button>
                        <Button className='round-btn' colorScheme='yellow' onClick={() => {
                          updateProfileDetails();
                          setEdit(false);
                        }}>Save Changes</Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="account-actions mt-4">
                <h6>Links</h6>
                <Card className={`mt-3 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`} style={theme === 'dark' ? {
                  border: '1px solid #e2e8f0',
                } : {}}>
                  <CardBody>
                    <div className="section-3 px-3 pt-2">
                      <div className="btn-container">
                        <Button variant='solid' className='me-2'>Change Password</Button>
                        <Button variant='solid' colorScheme='red' onClick={() => {
                          signOut(auth).then(() => {
                            setUser({})
                            setProfile({})
                            navigate('/login');
                          }).catch((error) => {
                            console.log(error);
                          });
                        }} >Sign out</Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile