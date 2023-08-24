import { CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip, theme } from '@chakra-ui/react';
import propsTypes from 'prop-types';
import { BiSolidArchiveOut } from 'react-icons/bi';
import '../../scss/shared.scss'
import { isMobile } from 'react-device-detect';
import { useRef } from 'react';

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

  const modalSize = isMobile ? 'full' : '2xl'

  window.addEventListener('popstate', () => {
    if (isOpen === true) {
      onClose();
      window.history.forward();
    }
  })

  const modalText = useRef();

  const setModalHeight = () => {
    if (modalText.current) {
      modalText.current.style.height = `${modalText.current.scrollHeight}` + 'px';
    } else {
      return
    }
  }

  return (
    <div className="archive-modal">
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size='xl' scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <div className={`note-modal-content bg-dark text-white ${modalSize === 'full' ? 'mobile-modal' : 'desktop-modal'}`} style={{ height: '100%' }}>
            <div className="note-modal-header d-flex p-4">
              <div className="notes-heading w-100">
                <Input id='title-input' style={{ fontSize: '20px', fontWeight: '600' }} type="text" defaultValue={currentNote.title} placeholder="Title" variant='unstyled' isReadOnly={true} onFocus={() => setModalHeight()} />
              </div>
              <IconButton variant='ghost' isRound={true} color='gray.500' className="round-btn ms-3" icon={<CloseIcon />} onClick={() => onClose()} />
            </div>
            <div className="note-modal-body px-4">
              <Textarea
                className={`text-area mb-4 w-50`} placeholder=""
                rows='' size='md' variant='unstyled' isReadOnly={true}
                defaultValue={currentNote.content}
              />
            </div>
            <div className="note-modal-footer px-4 d-flex flex-column justify-content-center">
              <div className="btns d-flex flex-row">
                <Tooltip label="Unarchive" placement="top">
                  <IconButton className="me-1" isRound={true} color={'gray.500'} variant='ghost' size={'lg'} icon={<BiSolidArchiveOut size={'22px'} />} onClick={() => {
                    onClose()
                    unArchiveCurrentNote()
                  }} />
                </Tooltip>
                <Tooltip label="Delete" placement="top">
                  <IconButton className="me-1" isRound={true} color={'gray.500'} variant='ghost' size={'lg'} icon={<DeleteIcon />} onClick={() => {
                    onClose()
                    deleteCurrentNote()
                  }} />
                </Tooltip>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ArchiveModal