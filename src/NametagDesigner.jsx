// NametagDesigner.jsx
import React, { useRef, useEffect, useState } from 'react';
import './NametagDesign.css';

const NametagDesigner = () => {
  const canvasRef = useRef(null);
  const [title, setTitle] = useState("Template");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [canvasWidth, setCanvasWidth] = useState(450);
  const [canvasHeight, setCanvasHeight] = useState(675);
  const [shapeColor, setShapeColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [textSize, setTextSize] = useState(16);
  const [textContent, setTextContent] = useState("Sample Text");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [selectedCorners, setSelectedCorners] = useState([false, false, false, false]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSelectingText, setIsSelectingText] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  const MAX_HISTORY = 20;
  const TEXT_SIZE_LOWER_BOUND = 10;
  const TEXT_SIZE_UPPER_BOUND = 150;
  const CANVAS_SIZE_LOWER_BOUND = 100;
  const CANVAS_SIZE_UPPER_BOUND = 2000;

  const saveState = () => {
    setUndoStack(prev => {
      // Create a deep copy of items without image objects
      const stateCopy = items.map(item => {
        if (item.type === 'image') {
          const { image, ...rest } = item;
          return rest;
        }
        return {...item};
      });
      const newStack = [...prev, stateCopy];
      return newStack.length > MAX_HISTORY ? newStack.slice(1) : newStack;
    });
    setRedoStack([]);
  };

  const findItemAtPosition = (x, y) => {
    const RECT_BUFFER = 5; // Pixel buffer for detecting resizing
    const RADIUS_BUFFER = 5; // Pixel buffer for circle resizing
    
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item.type === 'text') {
        const metrics = canvasRef.current.getContext('2d').measureText(item.text);
        const width = metrics.width;
        const height = item.size;
        if (x >= item.x && x <= item.x + width && 
            y >= item.y - height && y <= item.y) {
          return { item, index: i };
        }
      } else if (item.type === 'circle') {
        const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
        if (distance <= item.radius) {
          return { 
            item, 
            index: i,
            isResizing: distance > item.radius - RADIUS_BUFFER
          };
        }
      } else if (item.type === 'rect' || item.type === 'image') {
        if (x >= item.x && x <= item.x + item.width &&
            y >= item.y && y <= item.y + item.height) {
          // Check if click is near a corner for resizing
          const corners = [
            x < item.x + RECT_BUFFER && y < item.y + RECT_BUFFER, // top-left
            x > item.x + item.width - RECT_BUFFER && y < item.y + RECT_BUFFER, // top-right
            x < item.x + RECT_BUFFER && y > item.y + item.height - RECT_BUFFER, // bottom-left
            x > item.x + item.width - RECT_BUFFER && y > item.y + item.height - RECT_BUFFER // bottom-right
          ];
          return { 
            item, 
            index: i,
            isResizing: corners.some(c => c),
            selectedCorners: corners
          };
        }
      }
    }
    return null;
  };

  const drawItems = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    items.forEach((item, index) => {
      // Draw selection outline if item is selected
      if (selectedItem === index) {
        ctx.strokeStyle = '#4285F4';
        ctx.lineWidth = 2;
        if (item.type === 'text') {
          const metrics = ctx.measureText(item.text);
          ctx.strokeRect(item.x - 2, item.y - item.size - 2, 
                        metrics.width + 4, item.size + 4);
        } else if (item.type === 'circle') {
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (item.type === 'rect' || item.type === 'image') {
          ctx.strokeRect(item.x - 2, item.y - 2, 
                        item.width + 4, item.height + 4);
        }
      }
      if (item.type === 'text') {
        ctx.fillStyle = item.color;
        ctx.font = `${item.italic ? 'italic ' : ''}${item.bold ? 'bold ' : ''}${item.size}px ${item.font}`;
        
        // Draw text
        ctx.fillText(item.text, item.x, item.y);
        
        // Draw selection highlight if this is the selected item
        if (selectedItem === index && selectionStart !== null && selectionEnd !== null) {
          const start = Math.min(selectionStart, selectionEnd);
          const end = Math.max(selectionStart, selectionEnd);
          
          if (start !== end) {
            const beforeSelection = item.text.substring(0, start);
            const selectionText = item.text.substring(start, end);
            
            const beforeWidth = ctx.measureText(beforeSelection).width;
            const selectionWidth = ctx.measureText(selectionText).width;
            
            ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
            ctx.fillRect(
              item.x + beforeWidth,
              item.y - item.size,
              selectionWidth,
              item.size
            );
            
            // Draw text again over the highlight
            ctx.fillStyle = item.color;
            ctx.fillText(item.text, item.x, item.y);
          }
        }
      } else if (item.type === 'circle') {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
      } else if (item.type === 'rect') {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
      } else if (item.type === 'image') {
        // Draw border if specified
        if (item.borderWidth > 0) {
          ctx.strokeStyle = item.borderColor;
          ctx.lineWidth = item.borderWidth;
          ctx.strokeRect(item.x, item.y, item.width, item.height);
        }
        // Draw the image
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
      }
    });
  };

  useEffect(() => {
    drawItems();
  }, [items, backgroundColor, canvasWidth, canvasHeight]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = title || 'nametag_template';
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleAddText = () => {
    saveState();
    setItems(prev => [...prev, {
      type: 'text',
      text: textContent,
      size: textSize,
      font,
      x: 150,
      y: 100,
      color: shapeColor,
      bold,
      italic
    }]);
  };

  const handleAddCircle = () => {
    saveState();
    setItems(prev => [...prev, {
      type: 'circle',
      x: 150,
      y: 100,
      radius: 20,
      color: shapeColor
    }]);
  };

  const handleAddRect = () => {
    saveState();
    setItems(prev => [...prev, {
      type: 'rect',
      x: 150,
      y: 100,
      width: 30,
      height: 30,
      color: shapeColor
    }]);
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const result = findItemAtPosition(x, y);
    
    if (result) {
      const { item, index, isResizing, selectedCorners } = result;
      setSelectedItem(index);
      setSelectionStart(null);
      setSelectionEnd(null);
      
      if (isResizing && (item.type === 'rect' || item.type === 'image')) {
        setAspectRatio(item.width / item.height);
      }
      
      if (item.type === 'text') {
        // Always treat text clicks as drag (like shapes)
        setIsDragging(true);
        setIsSelectingText(false);
        setOffsetX(x - item.x);
        setOffsetY(y - item.y);
      } else {
        setIsDragging(!isResizing);
        setIsResizing(isResizing);
        setOffsetX(x - item.x);
        setOffsetY(y - item.y);
        
        if (isResizing && (item.type === 'rect' || item.type === 'image')) {
          setSelectedCorners(selectedCorners || [false, false, false, false]);
        }
        
        // Move selected item to top of items array
        const newItems = [...items];
        newItems.splice(index, 1);
        newItems.push(item);
        setItems(newItems);
        setSelectedItem(newItems.length - 1);
      }
      
      saveState();
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedItem !== null) {
      const item = items[selectedItem];
      if (item.type === 'text') {
        if (isSelectingText) {
          const ctx = canvas.getContext('2d');
          ctx.font = `${item.italic ? 'italic ' : ''}${item.bold ? 'bold ' : ''}${item.size}px ${item.font}`;
          
          // Find character position
          let charPos = item.text.length;
          let currentWidth = 0;
          
          for (let i = 0; i < item.text.length; i++) {
            const metrics = ctx.measureText(item.text[i]);
            currentWidth += metrics.width;
            if (x < item.x + currentWidth) {
              charPos = i;
              break;
            }
          }
          
          setSelectionEnd(charPos);
        } else if (isDragging) {
          const newItems = [...items];
          const item = newItems[selectedItem];
          item.x = x - offsetX;
          item.y = y - offsetY;
          setItems(newItems);
        }
      } else if (isDragging || isResizing) {
        const newItems = [...items];
        const item = newItems[selectedItem];
        
        if (isDragging) {
          item.x = x - offsetX;
          item.y = y - offsetY;
        } 
        else if (isResizing) {
          if (item.type === 'circle') {
            const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
            item.radius = distance;
          } 
            else if (item.type === 'rect' || item.type === 'image') {
              if (isResizing && !isDragging) {
                // Calculate new dimensions while maintaining aspect ratio
                const newWidth = x - item.x;
                const newHeight = y - item.y;
                
                if (selectedCorners[0]) { // Top-left
                  const widthChange = item.x - x;
                  const heightChange = widthChange / aspectRatio;
                  item.width += widthChange;
                  item.height += heightChange;
                  item.x = x;
                  item.y = y - heightChange;
                } 
                else if (selectedCorners[1]) { // Top-right
                  const widthChange = x - (item.x + item.width);
                  const heightChange = widthChange / aspectRatio;
                  item.width += widthChange;
                  item.height += heightChange;
                  item.y = y - heightChange;
                } 
                else if (selectedCorners[2]) { // Bottom-left
                  const widthChange = item.x - x;
                  const heightChange = widthChange / aspectRatio;
                  item.width += widthChange;
                  item.height += heightChange;
                  item.x = x;
                } 
                else if (selectedCorners[3]) { // Bottom-right
                  const widthChange = x - (item.x + item.width);
                  const heightChange = widthChange / aspectRatio;
                  item.width += widthChange;
                  item.height += heightChange;
                }

                // Enforce minimum size
                item.width = Math.max(10, item.width);
                item.height = Math.max(10, item.height);
              }
            }
        }
        
        setItems(newItems);
      }
      drawItems();
    }
  };

  const handleCanvasMouseUp = () => {
    setIsSelectingText(false);
    setIsDragging(false);
    setIsResizing(false);
    setSelectedCorners([false, false, false, false]);
  };

  const handleCopySelectedText = () => {
    if (selectedItem !== null && items[selectedItem].type === 'text' && 
        selectionStart !== null && selectionEnd !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      const selectedText = items[selectedItem].text.substring(start, end + 1);
      navigator.clipboard.writeText(selectedText);
    }
  };

  const handleDelete = () => {
    if (selectedItem !== null) {
      saveState();
      setItems(prev => prev.filter((_, index) => index !== selectedItem));
      setSelectedItem(null);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, items]);
      setItems(previousState);
      setUndoStack(prev => prev.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const handleCopy = () => {
    if (selectedItem !== null) {
      setCopiedItem(JSON.parse(JSON.stringify(items[selectedItem])));
    }
  };

  const handlePaste = () => {
    if (copiedItem) {
      saveState();
      const newItem = JSON.parse(JSON.stringify(copiedItem));
      newItem.x += 20; // Offset slightly from original
      newItem.y += 20;
      setItems(prev => [...prev, newItem]);
      setSelectedItem(items.length); // Select the new pasted item
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, items]);
      setItems(nextState);
      setRedoStack(prev => prev.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const handleClearCanvas = () => {
    saveState();
    setItems([]);
    setSelectedItem(null);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          saveState();
          setItems(prev => [...prev, {
            type: 'image',
            image: img,
            x: 150,
            y: 100,
            width: img.width,
            height: img.height,
            borderColor: shapeColor,
            borderWidth: 0,
            borderStyle: 'solid'
          }]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedItem !== null) {
        handleDelete();
      }
      if (e.ctrlKey && e.key === 'z') {
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        handleRedo();
      }
      if (e.ctrlKey && e.key === 'c' && selectedItem !== null) {
        handleCopy();
      }
      if (e.ctrlKey && e.key === 'v' && copiedItem) {
        handlePaste();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, items, undoStack, redoStack]);

  return (
    <div className="nametag-container" tabIndex="0">
      <textarea
        className="nametag-title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter template name"
      />
      <div className="menu-bar">
        <button className="menu-button" onClick={handleExport}>Export Design</button>
        <button className="menu-button" onClick={handleAddText}>Add Text</button>
        <button className="menu-button" onClick={handleAddCircle}>Add Circle</button>
        <button className="menu-button" onClick={handleAddRect}>Add Rectangle</button>
        <button 
          className="menu-button" 
          onClick={handleDelete}
          disabled={selectedItem === null}
        >
          Delete Selected
        </button>
        <button
          className="menu-button"
          onClick={handleUndo}
          disabled={undoStack.length === 0}
        >
          Undo
        </button>
          <button
            className="menu-button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            Redo
          </button>
          <button
            className="menu-button"
            onClick={handleCopy}
            disabled={selectedItem === null}
          >
            Copy
          </button>
          <button
            className="menu-button"
            onClick={handlePaste}
            disabled={!copiedItem}
          >
            Paste
          </button>
          <button
            className="menu-button"
            onClick={handleCopySelectedText}
            disabled={selectedItem === null || items[selectedItem].type !== 'text' || selectionStart === selectionEnd}
          >
            Copy Selected Text
          </button>
          <button
            className="menu-button"
            onClick={handleClearCanvas}
            disabled={items.length === 0}
          >
            Clear Canvas
          </button>
          <button
            className="menu-button"
            onClick={handleAddImage}
          >
            Add Image
          </button>
      </div>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="design-canvas"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        ></canvas>
      </div>
      <div className="control-panel">
        <div className="control-section">
          <h3 className="section-title">Canvas Settings</h3>
          <div className="control-group">
            <label className="control-label">Background Color:</label>
            <input
              type="color"
              className="control-input color-picker"
              value={backgroundColor}
              onChange={e => setBackgroundColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label className="control-label">Canvas Width:</label>
            <input
              type="number"
              className="control-input"
              value={canvasWidth}
              onChange={e => {
                let val = Math.max(CANVAS_SIZE_LOWER_BOUND, Math.min(CANVAS_SIZE_UPPER_BOUND, parseInt(e.target.value) || 0));
                setCanvasWidth(val);
              }}
            />
          </div>
          <div className="control-group">
            <label className="control-label">Canvas Height:</label>
            <input
              type="number"
              className="control-input"
              value={canvasHeight}
              onChange={e => {
                let val = Math.max(CANVAS_SIZE_LOWER_BOUND, Math.min(CANVAS_SIZE_UPPER_BOUND, parseInt(e.target.value) || 0));
                setCanvasHeight(val);
              }}
            />
          </div>
          <div className="control-group">
            <label className="control-label">Shape Color:</label>
            <input
              type="color"
              className="control-input color-picker"
              value={shapeColor}
              onChange={e => setShapeColor(e.target.value)}
            />
          </div>
        </div>
        <div className="control-section">
          <h3 className="section-title">Image Settings</h3>
          <div className="control-group">
            <label className="control-label">Border Width:</label>
            <input
              type="number"
              className="control-input"
              min="0"
              max="20"
              value={selectedItem !== null && items[selectedItem]?.type === 'image' ? items[selectedItem].borderWidth : 0}
              onChange={e => {
                if (selectedItem !== null && items[selectedItem]?.type === 'image') {
                  const newItems = [...items];
                  newItems[selectedItem].borderWidth = parseInt(e.target.value) || 0;
                  setItems(newItems);
                }
              }}
              disabled={selectedItem === null || items[selectedItem]?.type !== 'image'}
            />
          </div>
          <div className="control-group">
            <label className="control-label">Border Color:</label>
            <input
              type="color"
              className="control-input color-picker"
              value={selectedItem !== null && items[selectedItem]?.type === 'image' ? items[selectedItem].borderColor : '#000000'}
              onChange={e => {
                if (selectedItem !== null && items[selectedItem]?.type === 'image') {
                  const newItems = [...items];
                  newItems[selectedItem].borderColor = e.target.value;
                  setItems(newItems);
                }
              }}
              disabled={selectedItem === null || items[selectedItem]?.type !== 'image'}
            />
          </div>
        </div>
        <div className="control-section">
          <h3 className="section-title">Text Settings</h3>
          <div className="control-group">
            <label className="control-label">Font:</label>
            <select 
              className="control-input"
              value={font} 
              onChange={e => setFont(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Garamond">Garamond</option>
              <option value="Courier New">Courier New</option>
              <option value="Brush Script MT">Brush Script MT</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Size:</label>
            <input
              type="number"
              className="control-input"
              value={textSize}
              min={TEXT_SIZE_LOWER_BOUND}
              max={TEXT_SIZE_UPPER_BOUND}
              onChange={e => setTextSize(parseInt(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label className="control-label">Content:</label>
            <input
              type="text"
              className="control-input"
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
            />
          </div>
          <div className="control-group checkbox-group">
            <label className="control-label">Bold:</label>
            <input
              type="checkbox"
              checked={bold}
              onChange={e => setBold(e.target.checked)}
            />
          </div>
          <div className="control-group checkbox-group">
            <label className="control-label">Italic:</label>
            <input
              type="checkbox"
              checked={italic}
              onChange={e => setItalic(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NametagDesigner;