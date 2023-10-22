import { useEffect } from "react";
import ThemeState from "../../context/ThemeContext";
import {
  Button,
  IconButton,
  Input,
  SlideFade,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TasksState from "../../context/TasksContext";
import "../../scss/index.scss";
import TaskList from "./TaskList";
import propTypes from "prop-types";
import { BiSolidTrashAlt } from "react-icons/bi";

const TaskCard = ({ page }) => {
  TaskCard.propTypes = {
    page: propTypes.string,
  };

  const { theme } = ThemeState();
  const navigate = useNavigate();

  const { presentTask, setPresentTask, updatePresentTask, deleteTask } =
    TasksState();
  const { isOpen, onToggle } = useDisclosure(); // eslint-disable-line

  useEffect(() => {
    if (presentTask.id) {
      onToggle();
    }
  }, []); // eslint-disable-line

  return (
    <div className={`task-card m-0 px-3`}>
      <div className='card-heading px-1 px-md-3 d-flex flex-row justify-content-between align-items-center'>
        <Input
          type='text'
          variant='unstyled'
          isReadOnly={page === "shared" ? true : false}
          className={`task-title heading`}
          placeholder='Task title'
          defaultValue={presentTask.title}
          onChange={(e) => {
            setPresentTask({ ...presentTask, title: e.target.value });
          }}
        />
        <IconButton
          icon={<MdClose size={"25px"} />}
          variant={"unstyled"}
          color={theme === "dark" ? "white" : "gray"}
          isRound={true}
          size='sm'
          onClick={() => {
            navigate(`/${page === "notes" ? "" : page}`);
          }}
        />
      </div>
      <div className='card-body d-flex flex-column flex-md-row'>
        <SlideFade
          in={isOpen}
          offsetY='100px'
          className='w-100'
          transition={{ enter: ".5s", exit: "1s" }}
        >
          <TaskList
            tasks={presentTask.items?.unchecked}
            presentTask={presentTask}
            setPresentTask={setPresentTask}
            ticked={true}
          />
        </SlideFade>
        <SlideFade
          in={isOpen}
          offsetY='100px'
          className='w-100'
          transition={{ enter: ".5s", exit: "1s" }}
        >
          <TaskList
            tasks={presentTask.items?.checked}
            presentTask={presentTask}
            setPresentTask={setPresentTask}
            ticked={false}
          />
        </SlideFade>
      </div>
      <div className='card-footer d-flex flex-row align-items-center'>
        <div className='left w-100 d-flex flex-row'>
          <Tooltip label='Trash' placement='top' hasArrow='true'>
            <IconButton
              variant='ghost'
              size={"lg"}
              isRound={true}
              color={`${theme === "dark" ? "#ADB5BD" : "#495057"}`}
              className='me-1'
              icon={<BiSolidTrashAlt size={"22px"} />}
              onClick={() => {
                deleteTask();
              }}
            />
          </Tooltip>
        </div>
        <Button
          variant='solid'
          colorScheme='yellow'
          onClick={() => {
            updatePresentTask();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
