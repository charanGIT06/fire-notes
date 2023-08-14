import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react';
import propsTypes from 'prop-types';
import { BiSolidArchiveOut } from 'react-icons/bi';

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
            <Textarea
              className={`text-area mb-4`} placeholder="Take a note..."
              rows='1' size='md' height={50} variant='unstyled' isReadOnly={true}
              autoFocus={true}
              defaultValue={currentNote.content}
            />
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