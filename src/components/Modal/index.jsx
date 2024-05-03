import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ModalAnt } from 'antd';

const Modal = ({ open, title, handleOk, handleCancel, children, handleAfterOpen, footer }) => {
  //const modalContainer = useRef();
  const handlerListener = (e) => e.key === 'Enter' && handleOk;

  const handleAfterOpenUpdated = (oppening) => {
    if (oppening) {
      document.querySelector(`.${title.replaceAll(' ', '')}`).addEventListener('keypress', handlerListener);

      if (handleAfterOpen) {
        return handleAfterOpen();
      }
      return;
    }

    React.Children.forEach(children, (elemento) => {
      elemento.props?.form?.resetFields();
    });
    document.querySelector(`.${title.replaceAll(' ', '')}`).removeEventListener('keypress', handlerListener);
  };

  //const handleAfterClose = () => {};

  return (
    <ModalAnt
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      afterOpenChange={handleAfterOpenUpdated}
      //afterClose={handleAfterClose}
      wrapClassName={title.replaceAll(' ', '')}
      footer={footer}
      centered
    >
      {children}
    </ModalAnt>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  handleAfterOpen: PropTypes.func,
  footer: PropTypes.func,
};

export default Modal;
