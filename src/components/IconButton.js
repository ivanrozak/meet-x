const IconButton = ({ onClick, children }) => {
  return (
    <button
      className="p-4 hover:bg-actionBackgroundHover cursor-pointer rounded-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default IconButton;
