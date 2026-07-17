"use client";

export default function RoleSelect({
  userId,
  currentRole,
  updateRole,
}: {
  userId: string;
  currentRole: string;
  updateRole: (formData: FormData) => void;
}) {
  return (
    <form action={updateRole} className="inline-flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="text-xs rounded-full border border-line px-2 py-1 bg-white"
      >
        <option value="customer">customer</option>
        <option value="affiliate">affiliate</option>
        <option value="admin">admin</option>
      </select>
    </form>
  );
}