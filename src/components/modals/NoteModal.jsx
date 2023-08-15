import { DeleteIcon } from '@chakra-ui/icons';
import { Button, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react';
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinFill } from 'react-icons/bs'; //eslint-disable-line
import propsTypes from 'prop-types';
// import CollaboratorPopover from '../popovers/CollaboratorPopover';
// import { useState } from 'react';
// import { collection, doc, getDocs, query,  updateDoc, where } from 'firebase/firestore';
// import firebase from '../../js/firebase';
// import UserAuth from '../../context/UserContext';
// import { useHistory } from 'react-router-dom';
// import { useEffect } from 'react';

const NoteModal = ({
  isOpen,
  onClose,
  currentNote,
  setCurrentNote,
  currentNoteChanged,
  setCurrentNoteChanged,
  updateNote,
  deleteNote,
  archiveNote,
}) => {
  NoteModal.propTypes = {
    isOpen: propsTypes.bool.isRequired,
    onClose: propsTypes.func.isRequired,
    currentNote: propsTypes.object.isRequired,
    setCurrentNote: propsTypes.func.isRequired,
    currentNoteChanged: propsTypes.bool.isRequired,
    setCurrentNoteChanged: propsTypes.func.isRequired,
    updateNote: propsTypes.func.isRequired,
    deleteNote: propsTypes.func.isRequired,
    archiveNote: propsTypes.func.isRequired,
    setModalData: propsTypes.func.isRequired,
  };

  // const db = firebase.db;
  // const { user } = UserAuth();

  // const [collaborators, setCollaborators] = useState([]);
  // const [newCollaborator, setNewCollaborator] = useState('');

  // const [alert, setAlert] = useState({});

  // const findUser = (collaborators, email) => {
  //   const user = collaborators.find((collaborator) => {
  //     if (collaborator.email === email) {
  //       console.log("Already in the list")
  //       return true;
  //     } else {
  //       console.log('Added to the list')
  //       return false;
  //     }
  //   });
  //   return user;
  // }

  // const getUserFromEmail = async (email) => {
  //   try {
  //     const usersCollection = collection(db, 'users')
  //     const q = query(usersCollection, where('email', '==', email))
  //     const querySnapshot = await getDocs(q)
  //     const user = querySnapshot.docs.map(doc => {
  //       return {
  //         uid: doc.data().uid,
  //         email: doc.data().email,
  //         displayName: doc.data().username,
  //         firstName: doc.data().profile.firstName,
  //         lastName: doc.data().profile.lastName,
  //       }
  //     })
  //     if (user.length === 0) {
  //       return 'none'
  //     }
  //     return user[0]
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const setNoteInSharedNotes = async (uid) => {
  //   try {
  //     const sharedNotesCollection = collection(db, 'shared', uid, 'sharedNotes')
  //     const sharedDoc = doc(sharedNotesCollection, currentNote.id)
  //     await updateDoc(sharedDoc, {
  //       id: currentNote.id,
  //       note: currentNote,
  //       collaborators: collaborators,
  //       permissions: {
  //         read: true,
  //         write: true,
  //       },
  //       owner: {
  //         uid: user.uid,
  //         email: user.email,
  //         displayName: user.displayName,
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const setCollaboeatorsForUser = async () => {
  //   try {
  //     await updateDoc(doc(collection(db, 'notes', user.uid, 'active'), currentNote.id), {
  //       collaborators: collaborators
  //     })
  //     setNewCollaborator('');
  //     console.log('Added Collaborator')

  //     await setNoteInSharedNotes(user.uid);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  // const setCollaborator = async () => {
  //   if (newCollaborator === '') {
  //     return;
  //   } else {
  //     const collaborator = await getUserFromEmail(newCollaborator).then((collaborator) => {
  //       // if collaborator is not in collaborators array

  //       setCollaborators(findUser(collaborators, collaborator.email) ? [...collaborators, collaborator] : [...collaborators]);
  //       console.log('collaborators', collaborators)
  //     });

  //     if (collaborator === 'none') {
  //       console.log('User not found')
  //       setAlert({
  //         alert: true,
  //         type: 'error',
  //         message: 'User not found',
  //         status: 'error'
  //       })
  //     } else {
  //       await setCollaboeatorsForUser();
  //     }
  //   }
  // }

  window.addEventListener('popstate', () => {
    if (isOpen === true) {
      onClose();
      window.history.forward();
    }
  })

  return (
    <div className='note-modal'>
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size='xl' scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled' onClick={() => {
            }}
              onChange={(e) => {
                if (!currentNoteChanged) {
                  setCurrentNoteChanged(true)
                }
                setCurrentNote({ ...currentNote, title: e.target.value });
              }} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              className={`text-area mb-4`} placeholder="Take a note..."
              rows='1' size='md' height={50} variant='unstyled'
              autoFocus={true}
              onFocus={(e) => {
                e.target.value = currentNote.content || ''
              }}
              onChange={(e) => {
                if (!currentNoteChanged) {
                  setCurrentNoteChanged(true)
                }
                if (currentNote.content === '') {
                  e.target.style.height = '20px'
                } else {
                  e.target.style.height = `${e.target.scrollHeight}` + 'px';
                }
                setCurrentNote({ ...currentNote, content: e.target.value });
              }}
            />
          </ModalBody>
          <ModalFooter className='d-flex flex-column'>
            <div className="tag-container w-100">
            </div>
            <div className="btns d-flex flex-row align-items-start justify-content-start w-100 mt-2">
              <div className="left w-100">
                <Tooltip label='Pin' placement="top" hasArrow='true'>
                  <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsPinFill />} />
                </Tooltip>
                <Tooltip label="Archive" placement="top" hasArrow='true'>
                  <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsFillArchiveFill />} onClick={() => {
                    archiveNote()
                  }} />
                </Tooltip>
                <Tooltip label="Delete" placement="top" hasArrow='true'>
                  <IconButton variant='ghost' color='gray.500' className="round-btn" icon={<DeleteIcon />} onClick={() => {
                    deleteNote()
                  }} />
                </Tooltip>
                {/* <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsFillPersonPlusFill />} onClick={() => {
                }} /> */}
                {/* <CollaboratorPopover
                  trigger={
                    <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsFillPersonPlusFill />} onClick={() => {
                    }} />
                  }
                  header={<h4>Collaborators</h4>}

                  body={
                    <div className="form d-flex flex-row">
                      <Input type='email' placeholder='Enter email...' className='me-1' onChange={(e) => {
                        if (alert) {
                          setAlert({ alert: false })
                        }
                        setNewCollaborator(e.target.value)
                      }} />
                      <Button onClick={() => { setCollaborator() }}>Add</Button>
                    </div>
                  }
                  footer={<></>}
                  alert={alert}
                /> */}
              </div>
              <Button onClick={() => {
                updateNote()
              }}>
                Save
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NoteModal