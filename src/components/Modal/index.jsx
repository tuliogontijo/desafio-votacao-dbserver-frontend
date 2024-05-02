import React from 'react';
import PropTypes from 'prop-types'
import { Modal as ModalAnt } from "antd";

const Modal = ({ open, title, handleOk, handleCancel, children, handleAfterOpen }) => {


  const handlerListener = (e) => e.key === 'Enter' && handleOk();
  let modalContainer = null;

  const handleAfterOpenUpdated = () => {
    modalContainer = document.querySelector(`.${title.replaceAll(" ", "")}`);
    modalContainer.addEventListener('keypress', handlerListener);
    return handleAfterOpen;
  }

  const handleAfterClose = () => {
    React.Children.forEach(children, (elemento) => {
      elemento.props?.form?.resetFields();
    });
    modalContainer && modalContainer.removeEventListener('keypress', handlerListener);
  };

  return (
    <ModalAnt
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      afterOpenChange={handleAfterOpenUpdated}
      afterClose={handleAfterClose}
      wrapClassName={title.replaceAll(" ", "")}
      centered
    >
      {children}
    </ModalAnt>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  handleAfterOpen: PropTypes.func,
}

export default Modal;
