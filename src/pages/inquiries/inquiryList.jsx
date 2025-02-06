import "./inquiryList.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableCategory from "../../components/datatableInquiry/DatatableInquiry"

const CategoryList = () => {
  
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableCategory/>
      </div>
    </div>
  )
}

export default CategoryList