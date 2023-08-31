import propTypes from 'prop-types'
import '../scss/notes.scss'
import { IconButton, Input, Tooltip, Button, Textarea, Alert, AlertIcon, useDisclosure, Modal, ModalOverlay, ModalContent, Switch } from '@chakra-ui/react'
import { GrClose } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import ThemeState from '../context/ThemeContext'
import CollaboratorPopover from './popovers/CollaboratorPopover' // eslint-disable-line no-unused-vars
import { BiSolidArchiveOut, BiSolidTrashAlt } from 'react-icons/bi'
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinFill } from 'react-icons/bs'
import NotesState from '../context/NotesContext'
import { FaTrashRestoreAlt } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { useRef } from 'react'

const NoteCard = ({ note, page }) => {
  NoteCard.propTypes = {
    note: propTypes.object.isRequired,
    page: propTypes.string.isRequired
  }

  const navigate = useNavigate();
  const { theme } = ThemeState()
  const { updateNote, archiveNote, unArchiveNote, deleteNote, restoreNote, setPresentNote, shareNote } = NotesState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const sharedPerson = useRef(null)


  const handleShare = async () => {
    const permission = document.getElementById('canEdit').checked;
    const status = await shareNote(sharedPerson?.current?.value, permission)
    if (status === 'success') {
      console.log(status)
    } else {
      console.log(status)
    }
  }

  const handleSubmit = async () => {
    console.log('submit')
    await updateNote()
    navigate(`/${page === 'notes' ? '' : page}`)
  }

  return (
    <div className={`note-card my-1 px-3 py-2 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div style={{ height: '100%', border: '2px solid gray', borderRadius: '20px' }} className='m-0 px-3'>
        <div className="card-heading d-flex flex-row justify-content-between align-items-center">
          <Input type="text" variant='unstyled' className='note-title heading' defaultValue={note.title} onChange={(e) => setPresentNote({
            ...note,
            title: e.target.value
          })} />
          <IconButton icon={<MdClose size={'25px'} />} variant={'unstyled'} color={theme === 'dark' ? 'white' : 'gray'} isRound={true} size='sm' onClick={() => {
            navigate(`/${page === 'notes' ? '' : page}`)
            updateNote()
          }} />
        </div>
        <div className="card-content pe-2">
          <Textarea variant='unstyled' className='note-textarea p-0 m-0' defaultValue={note.content} onChange={(e) => setPresentNote({
            ...note,
            content: e.target.value
          })} />
        </div>
        <div className="card-footer d-flex align-items-center">
          <div className="btns d-flex flex-row align-items-center justify-content-start w-100 mt-2">
            <div className="left w-100 d-flex flex-row">
              <Tooltip label='Pin' placement="top" hasArrow='true' >
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' isRound={true} variant='ghost' size={'lg'} icon={<BsPinFill size={'22px'} />} />
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
              <Tooltip label="Share" placement="top" hasArrow='true'>
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BsFillPersonPlusFill size={'25px'} />} onClick={() => { onOpen() }} />
              </Tooltip>
              {/* <CollaboratorPopover
                trigger={
                  <IconButton className="me-1" color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BsFillPersonPlusFill size={'25px'} />} />
                }
                header={<h4 className='text-dark'>Collaborators</h4>}

                body={
                  <div className="form d-flex flex-row text-dark">
                    <Input type='email' placeholder='Enter email...' className='me-1' onChange={() => {
                      setCollaborator(e.target.value)
                    }} />
                    <Button onClick={handleClick}>Add</Button>
                  </div>
                }
                footer={<></>}
                alert={alert}
              /> */}
            </div>
            <Button variant={'ghost'} colorScheme='white' onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} isCentered={true} size='lg' className={`${theme === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`} onOverlayClick={onClose}>
        <ModalOverlay />
        <ModalContent>
          <div className={`modal-container ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
            <div className="modal-header d-flex flex-row align-item-center px-4 pt-4">
              <h4 className="modal-title m-0 p-0">Share</h4>
              <IconButton icon={<GrClose />} isRound={true} size='sm' onClick={onClose} />
            </div>
            <div className="modal-content px-4 pb-4">
              <hr />
              <form onSubmit={(e) => {
                e.preventDefault()
              }}>
                <Alert status="info" className={`rounded mb-3 text-dark`}>
                  <AlertIcon />
                  The person you share with must have a Fire Notes account.
                </Alert>
                <Input name='sharedPerson' id='sharedPerson' type='text' placeholder="Enter email" ref={sharedPerson} focusBorderColor='yellow.500' />
                <h6 className='mt-4'>Permissions</h6>
                <div className="permissions px-3 pb-3">
                  <div className="permission d-flex flex-row align-items-center justify-content-between">
                    <p className='p-0 m-0'>Can Edit</p>
                    <Switch id='canEdit' name='canEdit' colorScheme='yellow' defaultChecked={false} size='md' className='m-0' />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end mt-3">
                  <Button variant='solid' colorScheme='yellow' onClick={handleShare}>Share</Button>
                </div>
              </form>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NoteCard