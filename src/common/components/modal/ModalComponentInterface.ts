interface ModalProps {
  dialogClassName?: string;
  contentClassName?: string;
  padding?: number;
}

export interface ModalComponentProps {
  id: string;
  render: Function;
  title?: string | object;
  className?: string;
  actions?: object;
  modalProps?: ModalProps;
  onClose?: Function;
  theme?: "light" | "dark";
}