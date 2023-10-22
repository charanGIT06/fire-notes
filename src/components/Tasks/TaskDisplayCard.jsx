import "../../scss/index.scss";
import { Checkbox, Text } from "@chakra-ui/react";
import ThemeState from "../../context/ThemeContext";
import propTypes from "prop-types";

const Task = ({ task }) => {
  Task.propTypes = {
    task: propTypes.object,
  };

  const { theme } = ThemeState();

  return (
    <div
      className={`task ${
        theme === "dark" ? "dark-element" : "light-element"
      } p-4`}
    >
      <h5>{task.title}</h5>
      <div className='task-items'>
        {task.items?.unchecked?.slice(0,4).map(({ id, text }) => {
          return (
            <div key={id} className='d-flex flex-row'>
              <Checkbox size='sm' colorScheme='yellow' />
              <Text noOfLines={1} className='p-0 m-0 ms-2'>
                {text}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Task;
