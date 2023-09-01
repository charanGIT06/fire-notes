import propTypes from 'prop-types'
import '../scss/notes.scss'
import { IconButton, Input, Tooltip, Button, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, Avatar, Tag, TagLabel } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import ThemeState from '../context/ThemeContext'
import CollaboratorPopover from './popovers/CollaboratorPopover' // eslint-disable-line no-unused-vars
import { BiSolidArchiveOut, BiSolidLabel, BiSolidTrashAlt } from 'react-icons/bi'
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinAngleFill, BsPinFill } from 'react-icons/bs'
import NotesState from '../context/NotesContext'
import { FaTrashRestoreAlt } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import firebase from '../js/firebase'
import ShareBody from './modals/ShareBody'
import LabelsBody from './modals/LabelsBody'

const NoteCard = ({ page }) => {
  NoteCard.propTypes = {
    page: propTypes.string.isRequired
  }

  const navigate = useNavigate();
  const db = firebase.db
  const { theme } = ThemeState()
  const { updateNote, archiveNote, unArchiveNote, deleteNote, restoreNote, presentNote, setPresentNote, shareNote } = NotesState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [collaborators, setCollaborators] = useState(presentNote.collaborators || [])
  const [labels, setLabels] = useState(presentNote.labels || [])
  const [email, setEmail] = useState('')

  const [modal, setModal] = useState('share')

  const handleShare = async () => {

    let sharedPerson = {}
    const usersRef = query(collection(db, 'users'), where('email', '==', email))
    await getDocs(usersRef).then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          sharedPerson = { id: doc.id, ...doc.data() }
        })
      }
    ).catch((error) => {
      console.log(error)
    })

    const permission = document.getElementById('canEdit').checked;
    const status = await shareNote(sharedPerson, permission).then(() => {
      setPresentNote(presentNote)
      if (collaborators.length > 0) {
        if (collaborators.find((person) => person.uid === sharedPerson.uid)) {
          console.log('already shared')
        } else {
          setCollaborators([...presentNote.collaborators, sharedPerson])
        }
      }
      onClose()
    })
    if (status === 'success') {
      console.log(status)
    } else {
      console.log(status)
    }
  }

  const handleSubmit = async () => {
    console.log('submit')
    setPresentNote({
      ...presentNote,
      modified: new Date().getTime(),
      collaborators: collaborators,
      labels: labels
    })
    await updateNote()
    navigate(`/${page === 'notes' ? '' : page}`)
  }

  useEffect(() => {
    setPresentNote(presentNote)
  }, [presentNote])

  return (
    <div className={`note-card my-1 px-3 py-2 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div style={{ height: '100%', border: '2px solid gray', borderRadius: '20px' }} className='m-0 px-3'>
        <div className="card-heading d-flex flex-row justify-content-between align-items-center">
          <Input type="text" variant='unstyled' isReadOnly={page==='shared' ? true : false} className='note-title heading' defaultValue={presentNote.title} onChange={(e) => setPresentNote({
            ...presentNote,
            title: e.target.value
          })} />
          <IconButton icon={<MdClose size={'25px'} />} variant={'unstyled'} color={theme === 'dark' ? 'white' : 'gray'} isRound={true} size='sm' onClick={() => {
            navigate(`/${page === 'notes' ? '' : page}`)
          }} />
        </div>
        <div className="card-content pe-2">
          <Textarea variant='unstyled' isReadOnly={page === 'shared' ? true : false} className='note-textarea p-0 m-0 mb-3' defaultValue={presentNote.content} onChange={(e) => setPresentNote({
            ...presentNote,
            content: e.target.value
          })} />
          <div className={`tags-collaborators d-flex flex-md-row ${page === 'shared' ? 'd-none' : ''}`}>
            <div className="tags w-50">
              <h6>Labels:</h6>
              <div className="d-flex flex-row">
                {
                  labels.map((label) => {
                    return ((
                      labels.length > 0
                        ?
                        <Tag key={label} size={'md'} className='me-1 mb-1' borderRadius='full' colorScheme='yellow'>
                          <TagLabel>{label}</TagLabel>
                        </Tag>
                        :
                        <></>
                    ))
                  })
                }
              </div>
            </div>
            <div className="collaborators w-50">
              <h6>Shared with:</h6>
              <div className="d-flex flex-row">
                {
                  collaborators?.map((person) => {
                    return (
                      <Tooltip label={person.displayName} key={person.uid}>
                        <Avatar name={person.displayName} size={'sm'} className='me-1' />
                      </Tooltip>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex align-items-center">
          <div className={`${page !== 'shared' ? 'd-none' : ''} d-flex align-items-center w-100`}>
            <div className='d-flex ms-2'>
              <Tooltip label={`Shared by: ${presentNote?.owner?.email}`}>
                <div className="owner d-flex flex-row align-items-center p-2" style={{ border: '2px solid gray', borderRadius: '30px' }}>
                  <Avatar name={presentNote?.owner?.displayName} size={'sm'} className='me-1' />
                  <p className='p-0 m-0 ms-1'>{presentNote?.owner?.displayName}</p>
                </div>
              </Tooltip>
            </div>
            {/* <div className="d-flex flex-row items-center ms-2 px-2" style={{ border: '2px solid gray', borderRadius: '30px', padding: '12px' }}>
            <h6 className='m-0 p-0'>Last Modified: </h6>
            <p className="m-0 p-0 ms-2">{new Date(presentNote?.modified || '123456789').toISOString().split('T')[0]}</p>
            </div> */}
          </div>
          <div className="btns d-flex flex-row align-items-center justify-content-start w-100 mt-2">
            <div className="left w-100 d-flex flex-row">
              <Tooltip label={presentNote.isPinned === true ? 'Unpin' : 'Pin'} placement="top" hasArrow='true' >
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' isRound={true} variant='ghost' size={'lg'} icon={presentNote.isPinned !== true ? <BsPinFill size={'22px'} /> : <BsPinAngleFill size={'22px'} />} onClick={() => {
                  setPresentNote({
                    ...presentNote,
                    isPinned: presentNote.isPinned ? false : true
                  })
                }} />
              </Tooltip>
              <Tooltip label="Archive" placement="top" hasArrow='true'>
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} isRound={true} color='gray.500' variant='ghost' size={'lg'} icon={<BsFillArchiveFill size={'22px'} />} onClick={() => {
                  navigate(`/${page === 'notes' ? '' : page}`)
                  archiveNote()
                }} />
              </Tooltip>
              <Tooltip label="Unarchive" placement="top" hasArrow='true'>
                <IconButton variant='ghost' size={'lg'} isRound={true} color='gray.500' className={`${page === 'archive' ? 'me-1' : 'd-none'}`} icon={<BiSolidArchiveOut size={'22px'} />} onClick={() => {
                  navigate(`/${page === 'notes' ? '' : page}`)
                  unArchiveNote()
                }} />
              </Tooltip>
              <Tooltip label="Trash" placement="top" hasArrow='true'>
                <IconButton variant='ghost' size={'lg'} isRound={true} color='gray.500' className={`${page === 'notes' ? 'me-1' : 'd-none'}`} icon={<BiSolidTrashAlt size={'22px'} />} onClick={() => {
                  navigate(`/${page === 'notes' ? '' : page}`)
                  deleteNote()
                }} />
              </Tooltip>
              <Tooltip label="Restore" placement="top" hasArrow='true'>
                <IconButton variant='ghost' size={'lg'} isRound={true} color='gray.500' className={`${page === 'trash' ? 'me-1' : 'd-none'}`} icon={<FaTrashRestoreAlt size={'22px'} />} onClick={() => {
                  navigate(`/${page === 'notes' ? '' : page}`)
                  restoreNote()
                }} />
              </Tooltip>
              <Tooltip label="Label" placement="top" hasArrow='true'>
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BiSolidLabel size={'25px'} />} onClick={() => {
                  setModal('labels')
                  onOpen()
                }} />
              </Tooltip>
              <Tooltip label="Share" placement="top" hasArrow='true'>
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BsFillPersonPlusFill size={'25px'} />} onClick={() => {
                  setModal('share')
                  onOpen()
                }} />
              </Tooltip>
            </div>
            <Button className={`${page === 'shared' ? 'd-none' : ''}`} variant={'ghost'} colorScheme='white' onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} isCentered={true} size='lg' className={`${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`} onOverlayClick={onClose}>
        <ModalOverlay />
        <ModalContent>
          {
            (modal === 'share'
              ? <ShareBody handleShare={handleShare} onClose={onClose} email={email} setEmail={setEmail} />
              : (modal === 'labels'
                ? <LabelsBody onClose={onClose} labels={labels} setLabels={setLabels} />
                : <></>))
          }
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NoteCard