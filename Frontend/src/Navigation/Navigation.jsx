import Registration from "../Pages/Registration";
import Login from "../Pages/Login";
import { BrowserRouter, Route ,Routes} from "react-router";
import Dashboard from "../Pages/Dashboard";
import MovieDetails from "../Pages/MovieDetails";
function Navigation(){
   return(
<BrowserRouter>
 <Routes>
    <Route path="/" element ={<Registration/>} />
    <Route path="/login" element ={<Login/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/movie/:id" element={<MovieDetails/>}/>
 </Routes>
</BrowserRouter>
   );
}
export default Navigation;