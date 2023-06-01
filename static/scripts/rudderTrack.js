import React from "react";
import { rudderInitialize } from "./rudderInitialize";

export async function onRouteDidUpdate({location, previousLocation}) {
  // Don't execute if we are still on the same page; the lifecycle may be fired
  // because the hash changes (e.g. when navigating between headings)
  if (location.pathname !== previousLocation?.pathname) {
    await rudderInitialize()
    window.rudderanalytics.page();
    window.rudderanalytics.track('Sample Track Event');
  }
}
