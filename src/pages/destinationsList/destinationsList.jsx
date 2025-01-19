import "./destinationsList.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableDestinations from "../../components/datatableDestinations/datatableDestinations"

const AttributesList = () => {
  
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
       
        <DatatableDestinations/>
      </div>
    </div>
  )
}

export default AttributesList