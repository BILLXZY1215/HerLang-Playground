export function Button({ children, onClick }) {
  return (
    <button
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
