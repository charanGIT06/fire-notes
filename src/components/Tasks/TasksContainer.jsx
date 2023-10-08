import { useNavigate } from "react-router-dom";
import TasksState from "../../context/TasksContext";
import Task from "./Task";
import { ScaleFade, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

const TasksContainer = ({ tasks, searchText, from }) => {
  const { setPresentTask } = TasksState();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    onToggle();
  }, []);

  return (
    <div className='tasks-container'>
      <div className='container'>
        <div className='row d-flex flex-row'>
          {tasks
            ?.filter((task) => {
              if (
                task?.title?.toLowerCase()?.includes(searchText?.toLowerCase())
              ) {
                return task;
              }
              return null;
            })
            ?.map((task, index) => {
              return (
                <div
                  className='col-6 col-md-4 col-lg-3 p-1'
                  key={index}
                  onClick={() => {
                    setPresentTask(task);
                    navigate(`/ptask/${from}`);
                  }}
                >
                  <ScaleFade initialScale={0.8} in={isOpen}>
                    <Task task={task} />
                  </ScaleFade>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TasksContainer;
