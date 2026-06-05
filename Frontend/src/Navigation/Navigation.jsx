import Registration from "../Pages/Registration";
import { BrowserRouter, Route, Router } from "react-router";

function Navigation(){
<BrowserRouter>
 <Router>
    <Route path="/" element ={<Registration/>} />
 </Router>
</BrowserRouter>
}
export default Navigation;