import { rudderanalytics } from "./rudderInitialize";
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export async function onRouteDidUpdate({location, previousLocation}) {
  // Don't execute if we are still on the same page; the lifecycle may be fired
  // because the hash changes (e.g. when navigating between headings)
  if (ExecutionEnvironment.canUseDOM && location.pathname !== previousLocation?.pathname) {
    // await rudderInitialize()
    rudderanalytics.page();
    rudderanalytics.track('Track Page Viewed');
  }
}
