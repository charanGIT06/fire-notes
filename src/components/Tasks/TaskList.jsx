import { Checkbox, Input } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import ThemeState from "../../context/ThemeContext";
import propTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";

const TaskList = ({
  tasks,
  presentTask,
  setPresentTask,
  ticked,
}) => {
  TaskList.propTypes = {
    tasks: propTypes.array,
    presentTask: propTypes.object,
    setPresentTask: propTypes.func,
    ticked: propTypes.bool,
    checked: propTypes.array,
    setChecked: propTypes.func,
    unchecked: propTypes.array,
    setUnchecked: propTypes.func,
  };

  const { theme } = ThemeState();
  return (
    <div className='task-list w-100 p-2'>
      <h6>
        {ticked ? "Completed Tasks - " : "Incomplete Tasks - "} {tasks?.length}
      </h6>
      <div
        className={`p-4 ${theme === "dark" ? "dark-element" : "light-element"}`}
        style={{ borderRadius: "20px" }}
      >
        {tasks
          ?.filter(({ id, text, completed }) => {
            if (ticked && !completed) {
              return { id, text, completed };
            } else if (!ticked && completed) {
              return { id, text, completed };
            }
          })
          ?.map(({ id, text, completed }) => {
            return (
              <div
                key={id}
                className='task d-flex flex-row my-3 align-items-center'
                onFocus={() => {}}
              >
                <Checkbox
                  size='md'
                  colorScheme='yellow'
                  defaultChecked={completed}
                  onChange={() => {
                    const items = tasks;
                    items.forEach((item) => {
                      if (item.id === id) {
                        item.completed = !completed;
                        setPresentTask({
                          ...presentTask,
                          items: ticked
                            ? {
                                unchecked: tasks.filter((item) => {
                                  return item.id !== id;
                                }),
                                checked: [
                                  ...(presentTask.items.checked || []),
                                  item,
                                ],
                              }
                            : {
                                unchecked: [
                                  ...(presentTask.items.unchecked || []),
                                  item,
                                ],
                                checked: tasks.filter((item) => {
                                  return item.id !== id;
                                }),
                              },
                        });
                      }
                    });
                  }}
                />
                <Input
                  id={id}
                  type='text'
                  variant='unstyled'
                  className={`task-item ms-3`}
                  placeholder='Task item'
                  defaultValue={text}
                  style={{
                    textDecoration: completed ? "line-through" : "",
                  }}
                  onKeyDown={(e) => {
                    console.log(e.key);
                    if (e.key === "Enter") {
                      const newTaskId = Math.random();
                      setPresentTask({
                        ...presentTask,
                        items: {
                          unchecked: [
                            ...(presentTask.items.unchecked || []),
                            {
                              id: newTaskId,
                              text: '',
                              completed: false,
                              timeStamp: new Date().getTime(),
                            },
                          ],
                          checked: presentTask.items.checked,
                        },
                      });
                      document.getElementById(id).target.focus();
                    } else if (e.key === "Backspace" && e.target.value === "") {
                      setPresentTask({
                        ...presentTask,
                        items: {
                          unchecked: tasks.filter((item) => {
                            return item.id !== id;
                          }),
                          checked: tasks.filter((item) => {
                            return item.id !== id;
                          }),
                        },
                      });
                    }
                  }}
                />
                <AiOutlineClose
                  onClick={() => {
                    setPresentTask({
                      ...presentTask,
                      items: {
                        unchecked: tasks.filter((item) => {
                          return item.id !== id;
                        }),
                        checked: tasks.filter((item) => {
                          return item.id !== id;
                        }),
                      },
                    });
                  }}
                />
              </div>
            );
          })}
        <div
          className={`new-task d-flex flex-row align-items-center ${
            ticked === "Completed Tasks" ? "d-none" : ""
          }`}
        >
          <MdAdd size={"22px"} />
          <Input
            type='text'
            variant='unstyled'
            className={`task-item ms-2 `}
            placeholder='Add item'
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPresentTask({
                  ...presentTask,
                  items: {
                    unchecked: [
                      ...(presentTask.items.unchecked || []),
                      {
                        id: Math.random(),
                        text: e.target.value,
                        completed: false,
                        timeStamp: new Date().getTime(),
                      },
                    ],
                    checked: presentTask.items.checked || [],
                  },
                });
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskList;
