import "./attributesList.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableAttributes from "../../components/datatableAttributes/datatableAttributes"

const AttributesList = () => {
  
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableAttributes/>
      </div>
    </div>
  )
}

export default AttributesList