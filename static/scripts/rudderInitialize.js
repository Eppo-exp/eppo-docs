import * as rudderanalytics from "rudder-sdk-js";
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  rudderanalytics.load('2QZQtWRgHfXP5H2cnzSR8xE9ZBZ', 'https://geteppojohdkq.dataplane.rudderstack.com');
  rudderanalytics.ready(() => {
    console.log("We are all set!!!");
  });
}

export { rudderanalytics };