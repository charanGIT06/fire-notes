import SideNav from "../components/SideNav"
import ThemeState from "../context/ThemeContext"

const Shared = () => {
  const { theme } = ThemeState()

  return (
    <div className={`notes-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="main-section col-12 col-md-10 py-3">
          <div className="main-content">
            <h1>Shared</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shared