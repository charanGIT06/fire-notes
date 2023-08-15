import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react';
import propsTypes from 'prop-types';
import { BiSolidArchiveOut } from 'react-icons/bi';
import '../../scss/shared.scss'

const ArchiveModal = ({
  isOpen,
  onClose,
  currentNote,
  // currentNoteTitle,
  // currentNoteContent,
  unArchiveCurrentNote,
  deleteCurrentNote,
}) => {
  ArchiveModal.propTypes = {
    isOpen: propsTypes.bool.isRequired,
    onClose: propsTypes.func.isRequired,
    currentNote: propsTypes.object.isRequired,
    // currentNoteTitle: propsTypes.string.isRequired,
    // currentNoteContent: propsTypes.string.isRequired,
    unArchiveCurrentNote: propsTypes.func.isRequired,
    deleteCurrentNote: propsTypes.func.isRequired,
  };

  window.addEventListener('popstate', () => {
    if (isOpen === true) {
      onClose();
      window.history.forward();
    }
  })

  return (
    <div className="archive-modal">
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size='xl' scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled' isReadOnly={true} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="m-body d-flex flex-row">
              <Textarea
                className={`text-area mb-4 w-50`} placeholder="Take a note..."
                rows='1' size='md' height={50} variant='unstyled' isReadOnly={true}
                autoFocus={true}
                defaultValue={currentNote.content}
              />
              {/* <div className="collabs-container w-50">
                <div className="shared-collaborators">
                  {
                    currentNote.collaborators && currentNote.collaborators.map((collab, index) => {
                      return (
                        <div className="collab d-flex flex-row align-items-center px-1 py-1 mb-1 rounded bg-light" key={index}>
                          <Avatar name={collab.displayName} label={collab.email} />
                          <div className="details px-2">
                            <h6 className='m-0 p-0'>{collab.displayName}</h6>
                            <p className='m-0 p-0'>{collab.email}</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="tag-container w-100" style={{ overflow: 'auto' }}>
            </div>
            <div className="btns d-flex flex-row">
              <Tooltip label="Unarchive" placement="top">
                <IconButton className="round-btn" colorScheme="orange" variant='ghost' icon={<BiSolidArchiveOut />} onClick={() => {
                  onClose()
                  unArchiveCurrentNote()
                }} />
              </Tooltip>
              <Tooltip label="Delete" placement="top">
                <IconButton variant='ghost' colorScheme="red" className="round-btn" icon={<DeleteIcon />} onClick={() => {
                  onClose()
                  deleteCurrentNote()
                }} />
              </Tooltip>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ArchiveModal