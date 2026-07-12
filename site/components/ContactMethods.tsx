import { contactMethods } from "@/lib/content";

export default function ContactMethods() {
  return (
    <ul className="space-y-2 text-sm">
      {contactMethods.map((method) => (
        <li key={method.label}>
          <span className="font-medium text-foreground">{method.label}:</span>{" "}
          <a
            href={method.href}
            className="text-neutral-600 underline underline-offset-4 hover:text-foreground dark:text-neutral-400"
          >
            {method.value}
          </a>
        </li>
      ))}
    </ul>
  );
}
