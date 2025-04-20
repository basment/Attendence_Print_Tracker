import React from 'react';
import PropTypes from 'prop-types';

const MenuBar = ({
  onExport,
  onAddText,
  onAddCircle,
  onAddRect,
  onAddImage,
  onDelete,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onClearCanvas,
  canUndo,
  canRedo,
  canCopy,
  canPaste,
  canDelete
}) => {
  return (
    <div className="menu-bar">
      <button onClick={onExport}>Export</button>
      <button onClick={onAddText}>Add Text</button>
      <button onClick={onAddCircle}>Add Circle</button>
      <button onClick={onAddRect}>Add Rectangle</button>
      <button onClick={onAddImage}>Add Image</button>
      <button onClick={onDelete} disabled={!canDelete}>Delete</button>
      <button onClick={onUndo} disabled={!canUndo}>Undo</button>
      <button onClick={onRedo} disabled={!canRedo}>Redo</button>
      <button onClick={onCopy} disabled={!canCopy}>Copy</button>
      <button onClick={onPaste} disabled={!canPaste}>Paste</button>
      <button onClick={onClearCanvas}>Clear Canvas</button>
    </div>
  );
};

MenuBar.propTypes = {
  onExport: PropTypes.func.isRequired,
  onAddText: PropTypes.func.isRequired,
  onAddCircle: PropTypes.func.isRequired,
  onAddRect: PropTypes.func.isRequired,
  onAddImage: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  onClearCanvas: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  canCopy: PropTypes.bool.isRequired,
  canPaste: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired
};

export default MenuBar;
