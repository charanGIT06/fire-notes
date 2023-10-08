import "../../scss/index.scss";
import { Checkbox, Text } from "@chakra-ui/react";
import ThemeState from "../../context/ThemeContext";
import TasksState from "../../context/TasksContext";
import { useNavigate } from "react-router-dom";

const Task = ({ task }) => {
  const { theme } = ThemeState();

  return (
    <div
      className={`task ${
        theme === "dark" ? "dark-element" : "light-element"
      } p-4`}
    >
      <h5>{task.title}</h5>
      <div className='task-items'>
        {task.items.slice(0,4)?.map(({ id, text }) => {
          return (
            <div key={id} className='d-flex flex-row'>
              <Checkbox size='sm' colorScheme='yellow' />
              <Text noOfLines={1} className="p-0 m-0 ms-2">{text}</Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Task;
