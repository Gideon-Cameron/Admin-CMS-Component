import { useState } from "react";

const Tooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-gray-500 cursor-help text-sm border border-gray-400 px-1 rounded-full">
        ?
      </span>

      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] p-2 text-sm bg-black text-white rounded shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
