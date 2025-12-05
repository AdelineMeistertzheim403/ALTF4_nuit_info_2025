export default function DropZone({ onDropKey, children }) {
    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const keyId = e.dataTransfer.getData("keyId");
                onDropKey(keyId);
            }}
            className="w-32 h-32 border-2 border-dashed border-gray-500 flex items-center justify-center"
        >
            {children}
        </div>
    );
}
