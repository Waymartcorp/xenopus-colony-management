"use client";

// TODO: Fetch location hierarchy from API
// TODO: Expand/collapse tree nodes
// TODO: Show frog count and capacity per node
// TODO: Highlight bins at capacity or with health warnings
// TODO: Click to select a location for assignment/filtering

export interface LocationNode {
  id: string;
  label: string;
  locationType: string;
  capacity: number | null;
  frogCount?: number;
  status: string;
  children: LocationNode[];
}

interface LocationTreeProps {
  nodes: LocationNode[];
  onSelect?: (locationId: string) => void;
}

export default function LocationTree({ nodes, onSelect }: LocationTreeProps) {
  if (nodes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No locations defined. Add a room to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <LocationNodeItem key={node.id} node={node} onSelect={onSelect} depth={0} />
      ))}
    </ul>
  );
}

function LocationNodeItem({
  node,
  onSelect,
  depth,
}: {
  node: LocationNode;
  onSelect?: (id: string) => void;
  depth: number;
}) {
  const typeIcons: Record<string, string> = {
    room: "🏠",
    rack: "📦",
    bin: "🗄️",
    tank: "🐟",
    tub: "🛁",
    cohort: "👥",
  };

  const icon = typeIcons[node.locationType] ?? "📍";
  const capacityText =
    node.capacity != null
      ? `${node.frogCount ?? 0}/${node.capacity}`
      : undefined;

  const atCapacity =
    node.capacity != null &&
    node.frogCount != null &&
    node.frogCount >= node.capacity;

  return (
    <li style={{ paddingLeft: `${depth * 1.25}rem` }}>
      <button
        onClick={() => onSelect?.(node.id)}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50 ${
          atCapacity ? "bg-red-50" : ""
        }`}
      >
        <span>{icon}</span>
        <span className="font-medium text-gray-800">{node.label}</span>
        <span className="text-xs text-gray-400">({node.locationType})</span>
        {capacityText && (
          <span
            className={`ml-auto text-xs font-medium ${
              atCapacity ? "text-red-600" : "text-gray-500"
            }`}
          >
            {capacityText}
          </span>
        )}
      </button>
      {node.children.length > 0 && (
        <ul className="space-y-1">
          {node.children.map((child) => (
            <LocationNodeItem
              key={child.id}
              node={child}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
