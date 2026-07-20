import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Select>;

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

/** Controlled single-select that reports the chosen value. */
function SingleSelectDemo() {
  const [value, setValue] = useState<string>("Apple");
  return (
    <div className="flex flex-col items-center gap-3">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">Selected: {value}</span>
    </div>
  );
}

/** No default value — placeholder is shown until the user picks one. */
function WithPlaceholderDemo() {
  return (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((f) => (
          <SelectItem key={f} value={f}>
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Disabled root — the trigger can't be opened. */
function DisabledDemo() {
  return (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Can't touch this" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((f) => (
          <SelectItem key={f} value={f}>
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Items organized into labelled groups separated by a divider. */
function GroupsDemo() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="brt">Brasília (BRT)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe &amp; Africa</SelectLabel>
          <SelectItem value="gmt">London (GMT)</SelectItem>
          <SelectItem value="cet">Central Europe (CET)</SelectItem>
          <SelectItem value="eet">Eastern Europe (EET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia &amp; Pacific</SelectLabel>
          <SelectItem value="jst">Tokyo (JST)</SelectItem>
          <SelectItem value="aest">Sydney (AEST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** Sizes side by side for visual comparison. */
function AllSizesDemo() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <Select defaultValue="Apple">
        <SelectTrigger size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="Apple">
        <SelectTrigger size="default" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const SingleSelect: Story = { render: () => <SingleSelectDemo /> };
export const WithPlaceholder: Story = { render: () => <WithPlaceholderDemo /> };
export const Disabled: Story = { render: () => <DisabledDemo /> };
export const Groups: Story = { render: () => <GroupsDemo /> };
export const AllSizes: Story = { render: () => <AllSizesDemo /> };

/** Aggregated view of every Select variant for visual reference. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
      <SingleSelectDemo />
      <WithPlaceholderDemo />
      <DisabledDemo />
      <GroupsDemo />
    </div>
  ),
};
