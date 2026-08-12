"use client";

import { locations } from "@coffee-daily/mocks";
import { Badge } from "@coffee-daily/ui/Badge";
import { Button } from "@coffee-daily/ui/Button";
import { Input } from "@coffee-daily/ui/Input";
import { Select } from "@coffee-daily/ui/Select";
import { isLocationOpenNow } from "@coffee-daily/utils/hours";
import { useMemo, useState } from "react";
import { usePageTransition } from "@/motion/PageTransition";
import { Reveal } from "@/motion/Reveal";
import { useLocationStore } from "@/stores/useLocationStore";

const cities = Array.from(
  new Set(locations.map((location) => location.city)),
).sort();

function formatHour(time: string) {
  const [hoursStr = "0", minutesStr = "00"] = time.split(":");
  const hours = Number(hoursStr);
  const period = hours >= 12 ? "pm" : "am";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return minutesStr === "00"
    ? `${displayHour}${period}`
    : `${displayHour}:${minutesStr}${period}`;
}

export default function LocationsPage() {
  const { navigate } = usePageTransition();
  const selectLocation = useLocationStore((state) => state.selectLocation);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [driveThroughOnly, setDriveThroughOnly] = useState(false);

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        location.name.toLowerCase().includes(normalizedQuery) ||
        location.address.toLowerCase().includes(normalizedQuery);
      const matchesCity = city.length === 0 || location.city === city;
      const matchesOpenNow = !openNowOnly || isLocationOpenNow(location.hours);
      const matchesDriveThrough =
        !driveThroughOnly || location.features.includes("drive-through");

      return (
        matchesQuery && matchesCity && matchesOpenNow && matchesDriveThrough
      );
    });
  }, [query, city, openNowOnly, driveThroughOnly]);

  const handleChoose = (locationId: string) => {
    selectLocation(locationId);
    navigate("/menu");
  };

  return (
    <>
      <section className="bg-cd-paper-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-6 text-label text-cd-ink-mute">[ Locations ]</p>
          <h1 className="mb-6 max-w-3xl text-display-xl text-cd-ink">
            Find a counter near you
          </h1>
          <p className="max-w-2xl text-body-l text-cd-ink-mute">
            Six spots around Chicago. Pick one to unlock ordering.
          </p>
        </div>
      </section>

      <section className="bg-cd-paper px-4 py-8 sm:px-6 lg:px-10">
        <div className="container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label htmlFor="location-search" className="w-full max-w-md">
            <span className="sr-only">Search by name or street</span>
            <Input
              id="location-search"
              type="search"
              placeholder="Search by name or street"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label className="w-full max-w-[220px]">
              <span className="sr-only">City</span>
              <Select
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">All cities</option>
                {cities.map((cityOption) => (
                  <option key={cityOption} value={cityOption}>
                    {cityOption}
                  </option>
                ))}
              </Select>
            </label>

            <label className="flex items-center gap-2 border border-cd-line px-4 py-3 text-body-s">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(event) => setOpenNowOnly(event.target.checked)}
              />
              Open now
            </label>

            <label className="flex items-center gap-2 border border-cd-line px-4 py-3 text-body-s">
              <input
                type="checkbox"
                checked={driveThroughOnly}
                onChange={(event) => setDriveThroughOnly(event.target.checked)}
              />
              Drive-through
            </label>
          </div>
        </div>
      </section>

      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container">
          {filteredLocations.length === 0 ? (
            <p className="text-body text-cd-ink-mute">
              No locations match those filters.
            </p>
          ) : (
            <Reveal
              stagger
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredLocations.map((location) => {
                const isOpen = isLocationOpenNow(location.hours);
                return (
                  <div
                    key={location.id}
                    className="flex flex-col gap-4 bg-cd-paper-warm p-6"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-display-m">{location.name}</p>
                      <Badge tone={isOpen ? "success" : "danger"}>
                        {isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-body-s text-cd-ink-mute">
                      {location.address}
                    </p>
                    <p className="text-body-s text-cd-ink-mute">
                      Mon–Fri {formatHour(location.hours.weekday.open)}–
                      {formatHour(location.hours.weekday.close)}, Sat–Sun{" "}
                      {formatHour(location.hours.weekend.open)}–
                      {formatHour(location.hours.weekend.close)}
                    </p>
                    {location.features.includes("drive-through") ? (
                      <p className="text-label text-cd-ink-mute">
                        Drive-through
                      </p>
                    ) : null}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2 self-start"
                      onClick={() => handleChoose(location.id)}
                    >
                      Choose
                    </Button>
                  </div>
                );
              })}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
