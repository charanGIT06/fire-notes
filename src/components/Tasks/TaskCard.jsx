import React, { useEffect } from "react";
import ThemeState from "../../context/ThemeContext";
import {
  Checkbox,
  IconButton,
  Input,
  SlideFade,
  useDisclosure,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TasksState from "../../context/TasksContext";
import Task from "./Task";
import "../../scss/index.scss";

const TaskCard = ({ page }) => {
  const { theme } = ThemeState();
  const navigate = useNavigate();

  const { presentTask, setPresentTask } = TasksState();
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    if (presentTask.id) {
      onToggle();
    }
  }, []);

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
      {/* <SlideFade
        in={isOpen}
        offsetY='100px'
        className='w-100 mx-2 mx-md-3'
        transition={{ enter: ".5s", exit: "1s" }}
        > */}
      <div className='card-body d-flex flex-column flex-md-row'>
        <div className='p-2 col-12 col-md-6'>
          <h6>Incomplete</h6>
          <div
            className={`incomplete p-4 ${
              theme === "dark" ? "dark-element" : "light-element"
            }`}
            style={{ borderRadius: "20px" }}
          >
            {presentTask?.items
              ?.filter(({ id, text, completed }) => {
                if (!completed) {
                  return { id, text, completed };
                }
              })
              ?.map(({ id, text, completed }) => {
                return (
                  <div key={id} className='d-flex flex-row my-3'>
                    <Checkbox
                      size='md'
                      colorScheme='yellow'
                      defaultChecked={completed}
                      onChange={(e) => {
                        const items = presentTask.items.map((item) => {
                          if (item.id === id) {
                            item.completed = e.target.checked;
                          }
                          return item;
                        });
                        setPresentTask({ ...presentTask, items });
                      }}
                    />
                    <Input
                      type='text'
                      variant='unstyled'
                      isReadOnly={page === "shared" ? true : false}
                      className={`task-item ms-3 ${
                        theme === "dark" ? "dark-element" : "light-element"
                      }`}
                      placeholder='Task item'
                      defaultValue={text}
                      style={{
                        textDecoration: completed ? "line-through" : "",
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className='p-2 col-12 col-md-6'>
          <h6>Complete</h6>
          <div
            className={`complete p-4 ${
              theme === "dark" ? "dark-element" : "light-element"
            }`}
            style={{ borderRadius: "20px", overflowY: "auto" }}
          >
            {presentTask?.items
              ?.filter(({ id, text, completed }) => {
                if (completed) {
                  return { id, text, completed };
                }
              })
              ?.map(({ id, text, completed }) => {
                return (
                  <div
                    key={id}
                    className='d-flex flex-row my-3'
                    style={{ overflowY: "auto" }}
                  >
                    <Checkbox
                      size='md'
                      colorScheme='yellow'
                      defaultChecked={completed}
                      onChange={(e) => {
                        const items = presentTask.items.map((item) => {
                          if (item.id === id) {
                            item.completed = e.target.checked;
                          }
                          return item;
                        });
                        setPresentTask({ ...presentTask, items });
                      }}
                    />
                    <Input
                      type='text'
                      variant='unstyled'
                      isReadOnly={page === "shared" ? true : false}
                      className={`task-item ms-3 ${
                        theme === "dark" ? "dark-element" : "light-element"
                      }`}
                      placeholder='Task item'
                      defaultValue={text}
                      style={{
                        textDecoration: completed ? "line-through" : "",
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* </SlideFade> */}
    </div>
  );
};

export default TaskCard;
