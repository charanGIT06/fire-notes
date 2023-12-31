import { Avatar, Button, IconButton, Input, Modal, ModalContent, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react';
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinFill } from 'react-icons/bs';
import propsTypes from 'prop-types';
import CollaboratorPopover from '../popovers/CollaboratorPopover';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import UserAuth from '../../context/UserContext';
import firebase from '../../js/firebase';
import { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { CloseIcon } from '@chakra-ui/icons';
import firestoreFunctions from '../../js/firestoreFunctions.js';

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

  const [collaborator, setCollaborator] = useState('')

  const handleClick = () => {
  }
  // const handleClick = async () => {
  //   let newCollaborator = {}
  //   if (collaborator === '') {
  //     setAlert({
  //       alert: true,
  //       status: 'error',
  //       message: 'Please enter an email'
  //     })
  //     return
  //   } else if (collaborator === user.email) {
  //     setAlert({
  //       alert: true,
  //       status: 'error',
  //       message: 'You cannot add yourself as a collaborator'
  //     })

  //   } else {
  //     await firestoreFunctions.getUserFromEmail(collaborator).then((user) => {
  //       console.log(user)
  //       setCollaborator({
  //         uid: user.uid,
  //         email: user.email || '',
  //         // displayName: user.displayName || '',
  //       })
  //     })

  //     if (collaborator === 'none') {
  //       console.log('User not found')
  //       setAlert({
  //         alert: true,
  //         status: 'error',
  //         message: 'User not found'
  //       })
  //     } else {
  //       const sharedDoc = doc(db, 'notes', collaborator.uid, 'shared', currentNote.id)
  //       await setDoc(sharedDoc, {
  //         ...currentNote,
  //         owner: {
  //           uid: user.uid,
  //           email: user.email || '',
  //           // displayName: user.displayName || '',
  //         }
  //       }).then(() => {
  //         console.log('Added to shared notes')
  //       })
  //       const sharedNoteRef = doc(db, 'notes', user.uid, 'active', currentNote.id)
  //       setCurrentNoteChanged(true)
  //       console.log(collaborator)
  //       setCurrentNote({
  //         ...currentNote,
  //         collaborators: [{
  //           uid: collaborator.uid,
  //           email: collaborator.email || '',
  //         }, currentNote.collaborators?.(...currentNote.collaborators)]
  //       })

  //       // await updateDoc(sharedNoteRef, {
  //       //   collaborators: [{
  //       //     uid: collaborator.uid,
  //       //     email: collaborator.email || '',
  //       //   }, currentNote.collaborators?.(...currentNote.collaborators)]
  //       // }).then(() => {
  //       //   console.log('Added to collaborators')
  //       //   let prevAlertState = alert.status === 'success' ? true : false
  //       //   setAlert({
  //       //     alert: true,
  //       //     status: 'success',
  //       //     message: (!prevAlertState ? 'User found. Added collaborator.' : 'Added collaborator.')
  //       //   })
  //       //   getNotes('active')
  //       // })
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size={modalSize} scrollBehavior="inside" style={{ borderRadius: '25px' }}>
        <ModalOverlay />
        <ModalContent >
          <div className={`note-modal-content bg-dark text-white ${modalSize === 'full' ? 'mobile-modal' : 'desktop-modal'}`} style={{ height: '100%' }}>
            <div className="note-modal-header d-flex p-4">
              <div className="notes-heading w-100">
                <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled'
                  onChange={(e) => {
                    if (!currentNoteChanged) {
                      setCurrentNoteChanged(true)
                    }
                    setCurrentNote({ ...currentNote, title: e.target.value });
                  }}
                  isReadOnly={true}
                  onClick={(e) => {
                    e.target.readOnly = false
                  }}
                  onFocus={() => setModalHeight()}
                />
              </div>
              <IconButton variant='ghost' isRound={true} color='gray.500' className="round-btn ms-3" icon={<CloseIcon />} onClick={() => onClose()} />
            </div>
            <div className="note-modal-body px-4">
              <Textarea
                id='note-content'
                ref={modalText}
                isReadOnly={true}
                onClick={(e) => {
                  e.target.readOnly = false
                }}
                className={`text-area`} placeholder="Take a note..."
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
            <div className="note-modal-footer px-4 d-flex flex-column justify-content-center">
              <div className="collaborators d-flex flex-row align-items-center mb-2 ps-2 w-100">
                {currentNote.collaborators && currentNote.collaborators.map((collaborator, index) => {
                  return (
                    <Tooltip label={collaborator.displayName || '' + '\n' + collaborator.email} placement="top" hasArrow='true' key={index}>
                      <Avatar className='me-1' size={'sm'} name={collaborator.email} src={collaborator.sample} />
                    </Tooltip>
                  )
                })}
              </div>
              <div className="btns d-flex flex-row align-items-start justify-content-start w-100 mt-2">
                <div className="left w-100">
                  <Tooltip label='Pin' placement="top" hasArrow='true'>
                    <IconButton className="me-1" color='gray.500' isRound={true} variant='ghost' size={'lg'} icon={<BsPinFill size={'22px'} />} />
                  </Tooltip>
                  <Tooltip label="Archive" placement="top" hasArrow='true'>
                    <IconButton className='me-1' isRound={true} color='gray.500' variant='ghost' size={'lg'} icon={<BsFillArchiveFill size={'22px'} />} onClick={() => {
                      archiveNote()
                    }} />
                  </Tooltip>
                  <Tooltip label="Delete" placement="top" hasArrow='true'>
                    <IconButton variant='ghost' size={'lg'} isRound={true} color='gray.500' className="me-1" icon={<BiSolidTrashAlt size={'22px'} />} onClick={() => {
                      deleteNote()
                    }} />
                  </Tooltip>
                  <CollaboratorPopover
                    trigger={
                      <IconButton className="me-1" color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BsFillPersonPlusFill size={'25px'} />} />
                    }
                    header={<h4 className='text-dark'>Collaborators</h4>}

                    body={
                      <div className="form d-flex flex-row text-dark">
                        <Input type='email' placeholder='Enter email...' className='me-1' onChange={(e) => {
                          setCollaborator(e.target.value)
                        }} />
                        <Button onClick={handleClick}>Add</Button>
                      </div>
                    }
                    footer={<></>}
                    alert={alert}
                  />
                </div>
                <Button colorScheme='gray' onClick={() => updateNote()
                }>
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
