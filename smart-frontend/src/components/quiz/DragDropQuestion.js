import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './DragDropQuestion.css';

const DragDropQuestion = ({ question, onAnswer, disabled }) => {
    const [items, setItems] = useState(question.drag_drop_items);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleDragEnd = (result) => {
        if (!result.destination || disabled) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setItems(newItems);
    };

    const handleSubmit = () => {
        if (disabled || hasSubmitted) return;

        const answers = items.map((item, index) => ({
            itemId: item.id,
            position: index + 1
        }));

        setHasSubmitted(true);
        onAnswer(question.id, answers);
    };

    return (
        <div className="drag-drop-question">
            <h2 className="question-text">{question.text}</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="draggable-container"
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id.toString()}
                                    index={index}
                                    isDragDisabled={disabled}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`draggable-item ${
                                                snapshot.isDragging ? 'dragging' : ''
                                            }`}
                                        >
                                            {item.draggable_text}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={disabled || hasSubmitted}
            >
                {disabled ? 'Submitting...' : 'Submit Order'}
            </button>
        </div>
    );
};

export default DragDropQuestion;