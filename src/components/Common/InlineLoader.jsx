const InlineLoader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
      Loading CSV Data…
    </div>
  );
};

export default InlineLoader;
