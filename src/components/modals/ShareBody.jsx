import { Alert, AlertIcon, IconButton, Input, Switch, Button, Avatar, Tooltip } from "@chakra-ui/react"
import { GrClose } from "react-icons/gr"
import ThemeState from "../../context/ThemeContext"
import NotesState from "../../context/NotesContext"

const ShareBody = ({ handleShare, onClose, setEmail }) => { // eslint-disable-line

  const { theme } = ThemeState()
  const { presentNote } = NotesState()

  return (
    <div className="shareMenu">
      <div className={`modal-container ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className="modal-header d-flex flex-row align-items-center px-4 pt-4">
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
            <h6>Shared with</h6>
            <div className="share-panel">
              <div className="collaborators d-flex pt-1">
                {
                  presentNote?.collaborators?.map((collaborator) => {
                    return (
                      <Tooltip label={collaborator.email} key={collaborator.displayName}>
                        <div className="shared-card d-flex flex-row align-items-center mb-2 me-1 p-1">
                          <Avatar name={collaborator.displayName} size='sm' className="" />
                          <p className="p-0 m-0 ms-1 me-1">{collaborator.displayName}</p>
                        </div>
                      </Tooltip>
                    )
                  })
                }
              </div>
            </div>
            <hr />
            <h6>New User</h6>
            <Input name='email' id='email' placeholder="Enter email..." type="text" onChange={(e) => setEmail(e.target.value)} focusBorderColor="yellow.500" />
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
    </div>
  )
}

export default ShareBody