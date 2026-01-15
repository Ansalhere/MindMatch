import { Fragment } from "react/jsx-runtime";
import { MouseEvent, useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onItemClick: (item: string) => void;
}

function ListGroup({ items, heading, onItemClick }: Props) {
  const [activeItem, setActiveItem] = useState(-1);

  return (
    <Fragment>
      <h1>{heading} </h1>
      {items.length === 0 ? <p>No items found</p> : null}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={index}
            className={
              index === activeItem
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => {
              setActiveItem(index);
              onItemClick(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;
