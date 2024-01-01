import React from "react";
import ModalComponent from './components/modal'

export default function Home() {

  return (
    <div style={{ backgroundImage: "url(/backgroundv4.png)" }} className='bg-opacity-25 bg-cover min-h-screen flex flex-col gap-12 items-center justify-center p-24'>
      <ModalComponent />
    </div >
  )
}
