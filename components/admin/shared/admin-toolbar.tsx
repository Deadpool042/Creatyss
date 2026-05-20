"use client";
import { type JSX } from "react";
import { AdminSearchInput } from "../tables/admin-search-input";

// DRAFT
// ACTIVE
// INACTIVE
// ARCHIVED

function FilterSelectStatus(): JSX.Element {
  return <div>draft</div>;
}

function FilterControls(): JSX.Element {
  return (
    <div>
      <AdminSearchInput placeholder="Rechercher..." className="w-full lg:w-1/3" />
      <FilterSelectStatus />
    </div>
  );
}

export function AdminToolbar(): JSX.Element {
  return (
    <div>
      <FilterControls />
    </div>
  );
}
