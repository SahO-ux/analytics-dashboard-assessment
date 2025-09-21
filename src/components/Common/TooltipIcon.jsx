const TooltipIcon = ({ text = "" }) => {
  return (
    <span
      className={`text-slate-400 cursor-pointer inline-flex items-center`}
      data-tooltip-id="app-tooltip"
      data-tooltip-content={text}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1" />
        <path
          d="M10 6.5a.75.75 0 110-1.5.75.75 0 010 1.5zM9.25 8.5h1.5v6h-1.5v-6z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};

export default TooltipIcon;
