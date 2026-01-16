import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const TYPE = "QUESTION";

export function DraggableQuestion({
  index,
  moveQuestion,
  onDrop,
  children,
}: {
  index: number;
  moveQuestion: (from: number, to: number) => void;
  onDrop: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: TYPE,
    item: { index },
    end: () => {
      onDrop(); // ✅ persist once
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Get rectangle on screen
      const hoverRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverRect.bottom - hoverRect.top) / 2;

      // Get mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to top
      const hoverClientY = clientOffset.y - hoverRect.top;

      /**
       * Only move when mouse crosses half
       */
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveQuestion(dragIndex, hoverIndex);

      // 🔥 IMPORTANT: mutate dragged index
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
}
