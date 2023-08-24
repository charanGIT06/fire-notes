import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Button, IconButton, Input, Modal, ModalCloseButton, ModalContent, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react';
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinFill } from 'react-icons/bs'; //eslint-disable-line
import propsTypes from 'prop-types';
import CollaboratorPopover from '../popovers/CollaboratorPopover';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import UserAuth from '../../context/UserContext';
import firebase from '../../js/firebase';
import { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

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
  getNotes,
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
    getNotes: propsTypes.func.isRequired,
    setModalData: propsTypes.func.isRequired,
  };

  const db = firebase.db;
  const { user } = UserAuth();

  const modalSize = isMobile ? 'full' : '2xl'
  const modalText = useRef();

  const [alert, setAlert] = useState({});

  const setModalHeight = () => {
    if (modalText.current) {
      modalText.current.style.height = `${modalText.current.scrollHeight}` + 'px';
    } else {
      return
    }
  }

  const getUserFromEmail = async (email) => {
    try {
      const usersCollection = collection(db, 'users')
      const q = query(usersCollection, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      const user = querySnapshot.docs.map(doc => {
        return {
          uid: doc.data().uid,
          email: doc.data().email,
          displayName: doc.data().username,
          firstName: doc.data().profile.firstName,
          lastName: doc.data().profile.lastName,
        }
      })
      if (user.length === 0) {
        return 'none'
      }
      return user[0]
    } catch (error) {
      console.log(error)
    }
  }

  const collaboratorRef = useRef();

  const handleClick = async () => {
    let newCollaborator = {}
    if (collaboratorRef.current.value === '') {
      setAlert({
        alert: true,
        status: 'error',
        message: 'Please enter an email'
      })
      return
    } else if (collaboratorRef.current.value === user.email) {
      setAlert({
        alert: true,
        status: 'error',
        message: 'You cannot add yourself as a collaborator'
      })

    } else {
      await getUserFromEmail(collaboratorRef.current.value).then((collaborator) => {
        newCollaborator = collaborator
      })

      if (newCollaborator === 'none') {
        console.log('User not found')
        setAlert({
          alert: true,
          status: 'error',
          message: 'User not found'
        })
      } else {
        const sharedDoc = doc(db, 'notes', newCollaborator.uid, 'shared', currentNote.id)
        await setDoc(sharedDoc, {
          ...currentNote,
          owner: {
            uid: user.uid,
            sample: '',
            email: user.email,
            displayName: user.displayName,
          }
        }).then(() => {
          console.log('Added to shared notes')
        })

        const sharedNoteRef = doc(db, 'notes', user.uid, 'active', currentNote.id)
        setCurrentNoteChanged(true)
        setCurrentNote({
          ...currentNote,
          collaborators: [...currentNote.collaborators || [], newCollaborator]
        })
        // await updateNote()
        await updateDoc(sharedNoteRef, {
          collaborators: [...currentNote.collaborators || [], newCollaborator]
        }).then(() => {
          console.log('Added to collaborators')
          let prevAlertState = alert.status === 'success' ? true : false
          setAlert({
            alert: true,
            status: 'success',
            message: (!prevAlertState ? 'User found. Added collaborator.' : 'Added collaborator.')
          })
          getNotes('active')
        })
      }
    }
  }

  window.addEventListener('popstate', () => {
    if (isOpen === true) {
      onClose();
      window.history.forward();
    }
  })

  return (
    <div className='note-modal'>
      <Modal onEsc={() => {
        console.log('esc')
      }} isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size={modalSize} scrollBehavior="inside" style={{ borderRadius: '25px' }} onFocus={() => {
        modalText.current.style.height = `${modalText.current.scrollHeight}` + 'px';
        console.log(modalText.current.style.height)
      }}>
        <ModalOverlay />
        <ModalContent >
          <div className={`note-modal-content bg-dark text-white ${modalSize === 'full' ? 'mobile-modal' : 'desktop-modal'}`} style={{ height: '100%' }}>
            <div className="note-modal-header">
              <div className="notes-heading px-4 pt-5">
                <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled'
                  onChange={(e) => {
                    if (!currentNoteChanged) {
                      setCurrentNoteChanged(true)
                    }
                    setCurrentNote({ ...currentNote, title: e.target.value });
                  }}
                  onFocus={() => setModalHeight()}
                />
              </div>
              <ModalCloseButton />
            </div>
            <div className="note-modal-body px-4 my-3">
              <Textarea
                id='text-area'
                ref={modalText}
                className={`text-area mb-4`} placeholder="Take a note..."
                rows='1' size='md' height={50} variant='unstyled'
                defaultValue={currentNote.content}
                onFocus={(e) => {
                  e.target.value = currentNote.content || ''
                  e.target.style.height = `${e.target.scrollHeight}` + 'px';
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
            </div>
            <div className="note-modal-footer px-4">
              <div className="collaborators d-flex flex-row align-items-center mb-2 ps-2 w-100">
                {currentNote.collaborators && currentNote.collaborators.map((collaborator, index) => {
                  return (
                    <Tooltip label={collaborator.displayName + '\n' + collaborator.email} placement="top" hasArrow='true' key={index}>
                      <Avatar className='me-1' size={'sm'} name={collaborator.displayName} src={collaborator.sample} />
                    </Tooltip>
                  )
                })}
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
                  <CollaboratorPopover
                    trigger={
                      <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsFillPersonPlusFill />} />
                    }
                    header={<h4>Collaborators</h4>}

                    body={
                      <div className="form d-flex flex-row">
                        <Input type='email' placeholder='Enter email...' className='me-1' ref={collaboratorRef} />
                        <Button onClick={handleClick}>Add</Button>
                      </div>
                    }
                    footer={<></>}
                    alert={alert}
                  />
                </div>
                <Button onClick={() => {
                  updateNote()
                }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
          {/* <ModalHeader>
            <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled'
              onChange={(e) => {
                if (!currentNoteChanged) {
                  setCurrentNoteChanged(true)
                }
                setCurrentNote({ ...currentNote, title: e.target.value });
              }} />
          </ModalHeader> */}
          {/* <ModalCloseButton /> */}
          {/* <ModalBody>
            <Textarea
              className={`text-area mb-4`} placeholder="Take a note..."
              rows='1' size='md' height={50} variant='unstyled'
              defaultValue={currentNote.content}
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
          </ModalBody> */}
          {/* <ModalFooter className='d-flex flex-column'>
            <div className="collaborators d-flex flex-row align-items-center mb-2 ps-2 w-100">
              {currentNote.collaborators && currentNote.collaborators.map((collaborator, index) => {
                return (
                  <Tooltip label={collaborator.displayName + '\n' + collaborator.email} placement="top" hasArrow='true' key={index}>
                    <Avatar className='me-1' size={'sm'} name={collaborator.displayName} src={collaborator.sample} />
                  </Tooltip>
                )
              })}
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
                <CollaboratorPopover
                  trigger={
                    <IconButton className="round-btn" color='gray.500' variant='ghost' icon={<BsFillPersonPlusFill />} />
                  }
                  header={<h4>Collaborators</h4>}

                  body={
                    <div className="form d-flex flex-row">
                      <Input type='email' placeholder='Enter email...' className='me-1' ref={collaboratorRef} />
                      <Button onClick={handleClick}>Add</Button>
                    </div>
                  }
                  footer={<></>}
                  alert={alert}
                />
              </div>
              <Button onClick={() => {
                updateNote()
              }}>
                Save
              </Button>
            </div>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NoteModal
