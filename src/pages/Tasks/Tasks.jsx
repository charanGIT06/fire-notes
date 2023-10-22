import { IconButton, Input } from "@chakra-ui/react";
import SideNav from "../../components/Navigation/SideNav";
import TasksContainer from "../../components/Tasks/TasksContainer";
import NavState from "../../context/NavContext";
import TasksState from "../../context/TasksContext";
import ThemeState from "../../context/ThemeContext";
import { BiPlus } from "react-icons/bi";
import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { isMobile } from "react-device-detect";

const Tasks = () => {
  const { theme } = ThemeState();
  const { searchText } = NavState();

  const [newTaskState, setNewTaskState] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { newTask, activeTasks } = TasksState();

  return (
    <div
      className={`tasks-page ${
        theme === "dark" ? "dark-theme text-white" : "light-theme"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <div className='main-section col-12 col-md-10 py-3 px-1'>
          <h6 className='px-1'>Tasks</h6>
          <TasksContainer
            tasks={activeTasks}
            searchText={searchText}
            from={"tasks"}
          />
        </div>
        <div
          className='new-task d-flex flex-column align-items-end'
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        >
          <div
            className={`${isMobile ? 'new-task-container-mobile' : 'new-task-container'} ${
              theme === "dark" ? "dark-element" : "light-element"
            } p-3 mb-2 d-flex ${newTaskState ? "d-block" : "d-none"}`}
          >
            <Input
              type='text'
              placeholder='Enter list title'
              variant='unstyled'
              onChange={(e) => {
                setNewTaskTitle(e.target.value);
                
              }}
            />
            <IconButton
              icon={newTaskTitle ? <AiOutlineArrowRight /> : <AiOutlineClose />}
              size={"lg"}
              rounded='full'
              colorScheme='yellow'
              onClick={() => {
                if (newTaskTitle) {
                  newTask(newTaskTitle);
                } else {
                  setNewTaskState(!newTaskState);
                }
              }}
            />
          </div>
          <IconButton
            icon={<BiPlus size={"25px"} />}
            size={"lg"}
            rounded='full'
            colorScheme='yellow'
            className={newTaskState ? "d-none" : ""}
            onClick={() => {
              setNewTaskState(!newTaskState);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
