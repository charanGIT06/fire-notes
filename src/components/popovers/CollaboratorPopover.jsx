import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import propTypes from 'prop-types'

const CollaboratorPopover = ({ trigger, header, body, footer, alert }) => {
  CollaboratorPopover.propTypes = {
    trigger: propTypes.element.isRequired,
    header: propTypes.element.isRequired,
    body: propTypes.element.isRequired,
    footer: propTypes.element.isRequired,
    alert: propTypes.object.isRequired,
  }

  return (
    <Popover>
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{header}</PopoverHeader>
        <PopoverBody>
          {/* {body} */}

          <Alert status='info' className='my-2 rounded text-dark'>
            <AlertIcon />
            Collaborators should be registered users of this app.
          </Alert>
          <div className={`${alert.alert === true ? 'd-block' : 'd-none'} text-dark`}>
            <Alert status={alert.status} className='my-2 rounded'>
              <AlertIcon />
              {alert.message}
            </Alert>
          </div>
        </PopoverBody>
        <PopoverFooter>{footer}</PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default CollaboratorPopover