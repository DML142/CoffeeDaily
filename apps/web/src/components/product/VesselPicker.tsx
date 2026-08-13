import type { Vessel } from "@coffee-daily/types";

const VESSEL_LABELS: Record<Vessel, string> = {
  glass: "Glass",
  plastic: "Plastic",
  paper: "Paper cup",
  ceramic: "Ceramic mug",
};

export type VesselPickerProps = {
  vessels: Vessel[];
  value: Vessel;
  onChange: (vessel: Vessel) => void;
  disabledVessels: Set<Vessel>;
};

export function VesselPicker({
  vessels,
  value,
  onChange,
  disabledVessels,
}: VesselPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {vessels.map((vessel) => {
        const isSelected = vessel === value;
        const isDisabled = disabledVessels.has(vessel);
        return (
          <button
            key={vessel}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(vessel)}
            className={`border px-4 py-2 text-body-s transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? "border-cd-ink bg-cd-ink text-cd-cream"
                : "border-cd-line hover:border-cd-ink hover:bg-cd-ink hover:text-cd-cream"
            }`}
          >
            {VESSEL_LABELS[vessel]}
          </button>
        );
      })}
    </div>
  );
}
