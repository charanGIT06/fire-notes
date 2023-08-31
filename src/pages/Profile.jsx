import { Avatar, Button, Card, CardBody, FormControl, FormLabel, Input } from '@chakra-ui/react'
import SideNav from '../components/SideNav'
import { useRef, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import UserAuth from '../context/UserContext';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { BsUpload } from 'react-icons/bs';
import ThemeState from '../context/ThemeContext';
import NotesState from '../context/NotesContext';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { theme } = ThemeState();
  const { user, setUser, updateCurrentUser } = UserAuth();
  const [edit, setEdit] = useState(false);
  const { updateProfileDetails } = UserAuth();
  const { setActiveNotes, setArchiveNotes, setTrashNotes, setSharedNotes } = NotesState();

  const firstName = useRef(null);
  const lastName = useRef(null);
  const location = useRef(null);

  const handleSignOut = () => {
    setUser({})
    setActiveNotes([])
    setArchiveNotes([])
    setTrashNotes([])
    setSharedNotes([])
    navigate('/login');
  }

  const handleSubmit = async () => {
    console.log('formSubmit');
    await updateProfileDetails(firstName?.current?.value, lastName?.current?.value, location?.current?.value);
    setEdit(false);
  }

  if (!user.firstName) {
    updateCurrentUser().catch((error) => {
      console.log(error);
    });
  }

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
                  <div className="section-1 d-flex flex-column flex-md-row align-items-center p-3">
                    <div className="profile-img">
                      <Avatar name={user.displayName} size='xl' />
                    </div>
                    <div className="basic-info ps-4 w-100 my-3">
                      <div className="name">
                        <h5 className='pb-2 mb-0'>{user.firstName} {user.lastName}</h5>
                      </div>
                      <div className="username">
                        <p className='pb-2 mb-0'>{user.displayName}</p>
                      </div>
                      <div className="email">
                        <p className='pb-2 mb-0'>{user.email}</p>
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
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}>
                      <div className="section-2 px-3 d-flex flex-column">
                        <div className="user-details d-flex flex-column flex-md-row">
                          <div className="inputs pt-2 w-100">
                            <div className="username mb-4">
                              <FormControl id="username" className='pe-2'>
                                <FormLabel>Username</FormLabel>
                                <Input id='profile-username' className="username" defaultValue={user.displayName} variant={'unstyled'} placeholder="Username" readOnly={true} />
                              </FormControl>
                            </div>
                            <div className="name mb-4 d-flex flex-column flex-md-row w-100">
                              <FormControl id="firstname" className="pe-3">
                                <FormLabel>First Name</FormLabel>
                                <Input id='profile-firstname' className="firstname" defaultValue={user.firstName} variant={edit ? 'outline' : 'unstyled'} placeholder="First Name" isReadOnly={!edit} ref={firstName} />
                              </FormControl>
                              <FormControl id="lastname" className="pe-2 pt-4 pt-md-0">
                                <FormLabel>Last Name</FormLabel>
                                <Input id='profile-lastname' className="lastname" defaultValue={user.lastName} variant={edit ? 'outline' : 'unstyled'} placeholder="Last Name" isReadOnly={!edit} ref={lastName} />
                              </FormControl>
                            </div>
                            <div className="location">
                              <FormControl id="location">
                                <FormLabel>Location</FormLabel>
                                <Input id='profile-location' className="location" defaultValue={user.location ?? ''} variant={edit ? 'outline' : 'unstyled'} placeholder="Location" isReadOnly={!edit} ref={location} />
                              </FormControl>
                            </div>
                          </div>
                          <div className="editButton mt-4 mt-md-0">
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
                          <Button type='submit' className='round-btn' colorScheme='yellow'>Save Changes</Button>
                        </div>
                      </div>
                    </form>
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
                        <Button variant='solid' className='me-2 mb-2'>Change Password</Button>
                        <Button variant='solid' className='mb-2' colorScheme='red' onClick={() => {
                          signOut(auth).then(() => {
                            handleSignOut();
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