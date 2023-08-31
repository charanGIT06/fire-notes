import propTypes from 'prop-types'
import '../scss/notes.scss'
import { IconButton, Input, Tooltip, Button, Textarea, Alert, AlertIcon } from '@chakra-ui/react'
import { GrClose } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import ThemeState from '../context/ThemeContext'
import CollaboratorPopover from './popovers/CollaboratorPopover' // eslint-disable-line no-unused-vars
import { BiSolidArchiveOut, BiSolidTrashAlt } from 'react-icons/bi'
import { BsFillArchiveFill, BsFillPersonPlusFill, BsPinFill } from 'react-icons/bs'
import NotesState from '../context/NotesContext'
import { useState } from 'react'
import { FaTrashRestoreAlt } from 'react-icons/fa'

const NoteCard = ({ note, page }) => {
  NoteCard.propTypes = {
    note: propTypes.object.isRequired,
    page: propTypes.string.isRequired
  }

  const navigate = useNavigate();
  const { theme } = ThemeState()
  const { updateNote, archiveNote, unArchiveNote, deleteNote, restoreNote, setPresentNote } = NotesState()
  const [edit, setEdit] = useState(false)

  return (
    <div className={`note-card my-1 px-3 py-2 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div style={{ height: '100%', border: '2px solid gray', borderRadius: '20px' }} className='m-0 px-3 shadow-lg'>
        <div className="card-heading d-flex flex-row justify-content-between align-items-center">
          <Input type="text" variant='unstyled' className='note-title heading' defaultValue={note.title} onChange={(e) => setPresentNote({
            ...note,
            title: e.target.value
          })} />
          <IconButton icon={<GrClose />} isRound={true} size='sm' onClick={() => {
            navigate(`/${page === 'notes' ? '' : page}`)
            updateNote()
          }} />
        </div>
        <div className="card-content pe-2">
          <Textarea variant='unstyled' className='note-textarea p-0 m-0 w-100' defaultValue={note.content} onChange={(e) => setPresentNote({
            ...note,
            content: e.target.value
          })} />
          <div className={`add-collaborator ${edit ? 'd-block' : 'd-none'} w-100 py-2 px-3 text-white`}>
            <h6>Add Collaborator</h6>
            <hr />
            <Alert status='info' className='text-dark rounded mb-3'>
              <AlertIcon />
              The collaborator should be a registered user of this app.
            </Alert>
            <div className='d-flex'>
              <Input type='text' placeholder='Enter Email' className='me-1' color={'white'} />
              <Button>Add</Button>
            </div>
          </div>
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
                <IconButton className={`${page === 'notes' ? 'me-1' : 'd-none'}`} color='gray.500' variant='ghost' size={'lg'} isRound={true} icon={<BsFillPersonPlusFill size={'25px'} />} onClick={() => setEdit(!edit)} />
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
            <Button variant={'ghost'} colorScheme='white' onClick={() => {
              updateNote()
            }}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard