import { Fragment, useRef, type FC } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

type ScaryPopupProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => void;
  name: string;
}

export const ScaryPopup: FC<ScaryPopupProps> = ({open, setOpen, onConfirm, name}) => {
  const cancelButtonRef = useRef(null)

  return (
   
  )
}

export default ScaryPopup;