import SideNav from "../../components/Navigation/SideNav";
import ThemeState from "../../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDisclosure, SlideFade } from "@chakra-ui/react";
import TasksState from "../../context/TasksContext";
import TaskCard from "../../components/Tasks/TaskCard";

const PresentTask = () => {
  const { presentTask } = TasksState();
  const { theme } = ThemeState();
  const navigate = useNavigate();
  let page = useParams();

  useEffect(() => {
    if (!presentTask.id) {
      navigate(`/${page.page === "notes" ? "" : page.page}`);
    }
  });

  return (
    <div
      className={`tasks-page ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <TaskCard page={page.page} />
      </div>
    </div>
  );
};

export default PresentTask;
