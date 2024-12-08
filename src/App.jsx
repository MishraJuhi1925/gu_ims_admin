import { Route, Routes, useLocation } from 'react-router'
import './App.css'
import LayoutFile from './LayoutFile'
import SiteLayoutBeforeLogin from './SiteLayoutBeforeLogin'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Forget from './pages/Auth/Forget'
import Schools from './pages/Schools/College'
import Students from './pages/Students/Student'
import StudentByCollege from './pages/Students/StudentByCollege'
import FileUpload from './pages/CsvUpload/FileUpload'


const someLinks = ['/login', '/signup', '/forget', '/admin_login/:resetToken']

function App() {

  const { pathname } = useLocation()

  return (
    <>
      {/\/admin_login\//.test(pathname) ? <SiteLayoutBeforeLogin>
      </SiteLayoutBeforeLogin> :

        someLinks.includes(pathname) ?

          <SiteLayoutBeforeLogin>
            <Routes>
              {/* Auth */}
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/forget' element={<Forget />} />
            </Routes>
          </SiteLayoutBeforeLogin>
          :
          <LayoutFile>
            <Routes>
              <Route path='/college'  >
                <Route index element={<Schools />} />
                <Route path='/college/college/:collegeName' element={<StudentByCollege />} />
              </Route>
              <Route path='/student'  >
                <Route index element={<Students />} />
              </Route>
              <Route path='/csvupload' element={<FileUpload />} />
            </Routes>
          </LayoutFile>
      }
    </>
  )
}

export default App
