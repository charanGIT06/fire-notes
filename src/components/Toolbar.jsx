import { Tooltip } from '@chakra-ui/react'
import '../scss/notes.scss'
import { BiSelectMultiple, BiRefresh, BiGridAlt } from 'react-icons/bi'
import { CiGrid2H } from 'react-icons/ci'

const Toolbar = () => {
  return (
    <div className="toolbar px-4 py-2">
      <div className="tools d-flex flex-row justify-content-end">
        <Tooltip label='Select Items' hasArrow='true'>
          <div className="tool p-2 me-1">
            <BiSelectMultiple size={'25px'} />
          </div>
        </Tooltip>
        <Tooltip label='Refresh' hasArrow='true'>
          <div className="tool p-2 me-1">
            <BiRefresh size={'25px'} />
          </div>
        </Tooltip>
        <Tooltip label='List View' hasArrow='true'>
          <div className="tool p-2">
            <CiGrid2H size={'25px'} />
          </div>
        </Tooltip>
        <Tooltip label='Grid View' hasArrow='true'>
          <div className="tool p-2">
            <BiGridAlt size={'25px'} />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default Toolbar