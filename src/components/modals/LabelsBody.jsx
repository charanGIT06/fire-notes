import { IconButton, Input,  Button, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"
import { GrClose } from "react-icons/gr"
import ThemeState from "../../context/ThemeContext"
import { useState } from "react"
import propTypes from 'prop-types'

const ShareBody = ({ onClose, labels, setLabels, handleAdd }) => { // eslint-disable-line
  ShareBody.propTypes = {
    onClose: propTypes.func.isRequired,
    labels: propTypes.array.isRequired,
    setLabels: propTypes.func.isRequired
  }

  const { theme } = ThemeState()
  const [labelName, setLabelName] = useState('')

  return (
    <div className="shareMenu">
      <div className={`modal-container ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className="modal-header d-flex flex-row align-items-center px-4 pt-4">
          <h4 className="modal-title m-0 p-0">Manage Labels</h4>
          <IconButton icon={<GrClose />} isRound={true} size='sm' onClick={onClose} />
        </div>
        <div className="modal-content px-4 pb-4">
          <hr />
          <h6>Labels</h6>
          <div className="labels py-2">
            {
              (labels.length > 0 ? labels.map((label) => {
                return (
                  <Tag key={label} size={'lg'} className='me-1 mb-1' borderRadius='full' colorScheme='yellow'>
                    <TagLabel>{label}</TagLabel>
                    <TagCloseButton onClick={() => setLabels(
                      labels.filter((l) => l !== label)
                    )} />
                  </Tag>
                )
              }) : <></>)
            }
          </div>
          <hr />
          <h6>New Label</h6>
          <form onSubmit={(e) => {
            e.preventDefault()
          }}>
            <Input name='label' id='label' placeholder="Enter Label Name..." type="text" onChange={(e) => setLabelName(e.target.value)} focusBorderColor="yellow.500" />
            <div className="d-flex flex-row justify-content-end mt-3">
              <Button variant='solid' colorScheme='yellow' onClick={() => {
                setLabels([...labels, labelName])
                document.getElementById('label').value = ''
                onClose()
                // await handleAdd()
                setLabelName('')
              }}>Add</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShareBody