import { Avatar, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip } from '@chakra-ui/react'; //eslint-disable-line
import propsTypes from 'prop-types';
// import { BiSolidArchiveIn } from 'react-icons/bi';
// import { FaTrashRestore } from 'react-icons/fa';


const TrashModal = ({
  isOpen,
  onClose,
  currentNote,
  // archiveCurrentNote,
  // restoreCurrentNote,
}) => {
  TrashModal.propTypes = {
    isOpen: propsTypes.bool.isRequired,
    onClose: propsTypes.func.isRequired,
    currentNote: propsTypes.object.isRequired,
    // archiveCurrentNote: propsTypes.func.isRequired,
    // restoreCurrentNote: propsTypes.func.isRequired,
  };

  return (
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
          <div className="owner w-100" style={{ overflow: 'auto' }}>
            <Tooltip label={currentNote.owner && 'Owner: ' +currentNote.owner.displayName + ' ' + currentNote.owner.email}>
              <Avatar size={'sm'} name={currentNote.owner && currentNote.owner.displayName + ' ' + currentNote.owner.email} />
            </Tooltip>
          </div>
          <div className="btns d-flex flex-row">
            {/* <Tooltip label="Archive" placement="top">
              <IconButton className="round-btn" colorScheme="orange" variant='ghost' icon={<BiSolidArchiveIn />} onClick={() => {
                onClose()
                archiveCurrentNote()
              }} />
            </Tooltip>
            <Tooltip label="Restore" placement="top">
              <IconButton variant='ghost' colorScheme="green" className="round-btn" icon={<FaTrashRestore />} onClick={() => {
                onClose()
                restoreCurrentNote()
              }} />
            </Tooltip> */}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TrashModal