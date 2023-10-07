import ThemeState from "../context/ThemeContext";
import SideNav from "../components/SideNav";
import { Button, Checkbox, Divider, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineCaretRight, AiOutlineCaretDown } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import TasksState from "../context/TasksContext";
import Task from "../components/Task";

const Tasks = () => {
  const { theme } = ThemeState();

  const {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    handleChange,
    newTask,
  } = TasksState();
  // const [tasks, setTasks] = useState([]);

  const [tabOpen, setTabOpen] = useState(true);

  return (
    <div
      className={`tasks-page ${
        theme === "dark" ? "bg-dark text-white" : "bg-white"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <div className='tasks-container px-5 w-100'>
          <div className='todos mb-4'>
            <h6>To Do</h6>
            <div className='tasks mt-3'>
              {tasks?.map((task) => {
                console.log(task);
                return <Task checked={false} task={task} key={task.id} />;
              })}
            </div>
            <div className='new-task d-flex align-items-center mt-2'>
              <BsPlusLg size={"20px"} />
              <Input
                className='ms-3'
                id='new-task'
                name='new-task'
                type='text'
                variant='unstyled'
                placeholder='New Task'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    newTask(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
          <div
            className={`completed ${
              completedTasks.length ? "d-block" : "d-none"
            }`}
          >
            <Divider />
            <div className='completed-tab d-flex align-items-center'>
              <div onClick={() => setTabOpen(!tabOpen)}>
                {tabOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
              </div>
              <h6 className='m-0 ms-3'>
                {completedTasks.length ? completedTasks.length : ""} Completed
                Items
              </h6>
            </div>
            <div
              className={`completed-tasks mt-2 ${
                tabOpen ? "d-block" : "d-none"
              }`}
            >
              {completedTasks?.map((task) => {
                return <Task checked={true} task={task} key={task.id} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tasks;
