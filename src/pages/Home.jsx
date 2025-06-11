import React from "react"
import Introduction from "../components/Introduction"
import CustomForms from "../components/CustomForms"
import Conclusions from "../components/Conclusions"

import "../stylesheet/home.scss"


function Home() {
  return (
    <div className="main-page">
      <Introduction />
      <CustomForms />
      <Conclusions />
    </div>
  )
}

export default Home
