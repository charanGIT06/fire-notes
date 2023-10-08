import SideNav from "../../components/Navigation/SideNav";
import TasksContainer from "../../components/Tasks/TasksContainer";
import NavState from "../../context/NavContext";
import TasksState from "../../context/TasksContext";
import ThemeState from "../../context/ThemeContext";

const Tasks = ({}) => {
  const { theme } = ThemeState();
  const { searchText } = NavState();

  const { tasksList, setTasksList } = TasksState();

  return (
    <div
      className={`tasks-page ${
        theme === "dark" ? "dark-theme text-white" : "light-theme"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <div className='main-section col-12 col-md-10 py-3 px-1'>
          <h6 className="px-1">Tasks</h6>
          <TasksContainer
            tasks={tasksList}
            searchText={searchText}
            from={"tasks"}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
