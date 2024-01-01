import { Spinner } from "@nextui-org/react";

export default function Loading() {

  return (
    <div className="flex flex-col justify-center bg-gray-800 items-center min-h-screen min-w-screen">
      <Spinner
        color="danger"
        size="lg"
      />
    </div>
  )
}