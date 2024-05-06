import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ModalAnt } from 'antd';

const Modal = ({ open, title, handleOk, handleCancel, children, handleAfterOpen, footer }) => {
  const handleAfterOpenUpdated = (oppening) => {
    if (!oppening) {
      React.Children.forEach(children, (elemento) => {
        elemento.props?.form?.resetFields();
      });
      return;
    }

    if (handleAfterOpen) handleAfterOpen();
  };

  return (
    <ModalAnt
      open={open}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      wrapClassName={title.replaceAll(' ', '')}
      afterOpenChange={handleAfterOpenUpdated}
      footer={footer}
      centered
      destroyOnClose={true}
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
