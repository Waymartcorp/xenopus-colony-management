type NoticeStatus =
  | "not_sent"
  | "queued"
  | "sent"
  | "delivered"
  | "acknowledged"
  | "completed"
  | "dismissed"
  | "snoozed";

interface NoticeStatusBadgeProps {
  status: NoticeStatus;
  sentAt?: string;
  sentBy?: string;
  channel?: "email" | "sms" | "in_app";
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

const STATUS_CONFIG: Record<NoticeStatus, { label: string; color: string }> = {
  not_sent: { label: "Not sent", color: "bg-gray-100 text-gray-600" },
  queued: { label: "Queued", color: "bg-yellow-100 text-yellow-700" },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", color: "bg-blue-100 text-blue-700" },
  acknowledged: { label: "Acknowledged", color: "bg-green-100 text-green-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  dismissed: { label: "Dismissed", color: "bg-gray-100 text-gray-500" },
  snoozed: { label: "Snoozed", color: "bg-orange-100 text-orange-700" },
};

export default function NoticeStatusBadge({
  status,
  sentAt,
  channel,
}: NoticeStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
      {sentAt && (
        <span className="text-xs text-gray-400">{sentAt}</span>
      )}
      {channel && (
        <span className="text-xs text-gray-400">via {channel}</span>
      )}
    </span>
  );
}

export type { NoticeStatus, NoticeStatusBadgeProps };
